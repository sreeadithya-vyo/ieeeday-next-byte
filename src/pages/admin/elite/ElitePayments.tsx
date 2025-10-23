import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    events: {
      title: string;
      chapters: {
        code: string;
      };
    };
  };
}

export default function ElitePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChapter, setFilterChapter] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          registrations (
            participant_name,
            participant_email,
            events (
              title,
              chapters (code)
            )
          )
        `)
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

  const filteredPayments = payments.filter(payment => {
    const matchesChapter = filterChapter === "all" || payment.registrations.events.chapters.code === filterChapter;
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    return matchesChapter && matchesStatus;
  });

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
        <h2 className="text-2xl font-bold">All Payments</h2>
        <p className="text-muted-foreground">Manage payments across all chapters</p>
      </div>

      <div className="flex gap-4">
        <Select value={filterChapter} onValueChange={setFilterChapter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by chapter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            <SelectItem value="APS">APS</SelectItem>
            <SelectItem value="SPS">SPS</SelectItem>
            <SelectItem value="PROCOM">ProComm</SelectItem>
            <SelectItem value="CS">CS</SelectItem>
            <SelectItem value="PES">PES</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No payments found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.registrations.participant_name}</div>
                        <div className="text-sm text-muted-foreground">{payment.registrations.participant_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.registrations.events.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.registrations.events.chapters.code}</Badge>
                    </TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
                    <TableCell>{format(new Date(payment.created_at), 'PP')}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payment.proof_url && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Payment Proof</DialogTitle>
                              </DialogHeader>
                              <img 
                                src={payment.proof_url} 
                                alt="Payment proof" 
                                className="w-full h-auto rounded-lg"
                              />
                            </DialogContent>
                          </Dialog>
                        )}
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
    </div>
  );
}
