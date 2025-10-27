import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  transaction_id: string;
  proof_url: string | null;
  status: string;
  created_at: string;
  registrations: {
    participant_name: string;
    participant_email: string;
    payment_proof_url: string | null;
    events: {
      title: string;
      registration_amount: number;
    };
  };
}

export default function ChapterPayments() {
  const { chapter } = useRole();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    if (chapter) {
      fetchPayments();
    }
  }, [chapter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();

      if (!chapterData) return;

      const { data: eventsData } = await supabase
        .from('events')
        .select('id')
        .eq('chapter_id', chapterData.id);

      const eventIds = eventsData?.map(e => e.id) || [];

      if (eventIds.length === 0) {
        setPayments([]);
        setLoading(false);
        return;
      }

      const { data: registrationsData } = await supabase
        .from('registrations')
        .select('id')
        .in('event_id', eventIds);

      const registrationIds = registrationsData?.map(r => r.id) || [];

      if (registrationIds.length === 0) {
        setPayments([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          registrations (
            participant_name,
            participant_email,
            payment_proof_url,
            events (
              title,
              registration_amount
            )
          )
        `)
        .in('registration_id', registrationIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      toast.error('Failed to load payments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;
      
      toast.success('Payment verified');
      fetchPayments();
    } catch (error: any) {
      toast.error('Failed to verify payment');
      console.error(error);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'rejected',
          verified_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;
      
      toast.success('Payment rejected');
      fetchPayments();
    } catch (error: any) {
      toast.error('Failed to reject payment');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      verified: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment History</h2>
        <p className="text-muted-foreground">Manage payment verifications for {chapter} events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No payments found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.registrations.participant_name}</div>
                        <div className="text-sm text-muted-foreground">{payment.registrations.participant_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.registrations.events.title}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
                    <TableCell>{format(new Date(payment.created_at), 'PP')}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                     <TableCell>
                      <div className="flex gap-2">
                        {payment.proof_url || payment.registrations.payment_proof_url ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Proof
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Payment Proof</DialogTitle>
                              </DialogHeader>
                              <img 
                                src={(payment.proof_url || payment.registrations.payment_proof_url || '').startsWith('http') 
                                  ? (payment.proof_url || payment.registrations.payment_proof_url!) 
                                  : supabase.storage.from('payment-proofs').getPublicUrl(payment.proof_url || payment.registrations.payment_proof_url!).data.publicUrl
                                } 
                                alt="Payment proof" 
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                  console.error('Failed to load image:', payment.proof_url || payment.registrations.payment_proof_url);
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        ) : null}
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleVerifyPayment(payment.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectPayment(payment.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Verified Amount</p>
              <p className="text-2xl font-bold">
                ₹{payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + Number(p.amount), 0)}
              </p>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">
                ₹{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
