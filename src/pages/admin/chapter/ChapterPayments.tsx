import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye, ZoomIn, ZoomOut } from "lucide-react";
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

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  payment_proof_url: string | null;
  transaction_id: string;
  status: string;
  created_at: string;
  is_ieee_member: boolean;
  events: {
    title: string;
    registration_amount: number;
  };
}

export default function ChapterPayments() {
  const { chapter } = useRole();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageZoom, setImageZoom] = useState<number>(100);

  useEffect(() => {
    if (chapter) {
      fetchPayments();
      fetchApprovedRegistrations();
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
        return;
      }

      const { data: registrationsData } = await supabase
        .from('registrations')
        .select('id')
        .in('event_id', eventIds);

      const registrationIds = registrationsData?.map(r => r.id) || [];

      if (registrationIds.length === 0) {
        setPayments([]);
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

  const fetchApprovedRegistrations = async () => {
    try {
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();

      if (!chapterData) return;

      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          events!inner (
            title,
            registration_amount,
            chapter_id
          )
        `)
        .eq('events.chapter_id', chapterData.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      console.error('Failed to load approved registrations:', error);
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
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No approved registrations found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>IEEE Member</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => {
                  const payment = payments.find(p => p.registrations.participant_email === registration.participant_email);
                  const eventAmount = Number(registration.events.registration_amount) || 200;
                  const finalAmount = registration.is_ieee_member ? Math.max(eventAmount - 50, 0) : eventAmount;
                  return (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{registration.participant_name}</div>
                        <div className="text-sm text-muted-foreground">{registration.participant_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{registration.events.title}</TableCell>
                    <TableCell>₹{finalAmount}</TableCell>
                    <TableCell className="font-mono text-sm">{registration.transaction_id || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(registration.created_at), 'PP')}</TableCell>
                    <TableCell>
                      {registration.is_ieee_member ? (
                        <Badge variant="outline">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                     <TableCell>
                      <div className="flex gap-2">
                        {registration.payment_proof_url ? (
                          <Dialog onOpenChange={(open) => !open && setImageZoom(100)}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Proof
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh]">
                              <DialogHeader className="flex-row items-center justify-between space-y-0">
                                <DialogTitle>Payment Proof</DialogTitle>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setImageZoom(prev => Math.max(50, prev - 25))}
                                  >
                                    <ZoomOut className="h-4 w-4" />
                                  </Button>
                                  <span className="text-sm font-medium min-w-[60px] text-center">{imageZoom}%</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setImageZoom(prev => Math.min(200, prev + 25))}
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </Button>
                                </div>
                              </DialogHeader>
                              <div className="overflow-auto max-h-[70vh]">
                                <img 
                                  src={registration.payment_proof_url.startsWith('http') 
                                    ? registration.payment_proof_url 
                                    : supabase.storage.from('payment-proofs').getPublicUrl(registration.payment_proof_url).data.publicUrl
                                  } 
                                  alt="Payment proof" 
                                  className="rounded-lg transition-all"
                                  style={{ width: `${imageZoom}%`, height: 'auto' }}
                                  onError={(e) => {
                                    console.error('Failed to load image:', registration.payment_proof_url);
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-sm text-muted-foreground">No proof uploaded</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                )}
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
              <p className="text-sm text-muted-foreground">Total Registrations</p>
              <p className="text-2xl font-bold">{registrations.length}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{registrations.reduce((sum, r) => {
                  const eventAmount = Number(r.events.registration_amount) || 200;
                  const finalAmount = r.is_ieee_member ? Math.max(eventAmount - 50, 0) : eventAmount;
                  return sum + finalAmount;
                }, 0)}
              </p>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">IEEE Members</p>
              <p className="text-2xl font-bold">
                {registrations.filter(r => r.is_ieee_member).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
