import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye, CheckCircle, XCircle, ZoomIn, ZoomOut, Download } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { exportPaymentProofsToPDF } from "@/lib/exportPaymentProofs";

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
  const [imageZoom, setImageZoom] = useState<number>(100);

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
            payment_proof_url,
            events (
              title,
              registration_amount,
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

  const handleExportPaymentProofs = async () => {
    try {
      setLoading(true);
      
      const proofsToExport = filteredPayments
        .filter(p => p.proof_url || p.registrations.payment_proof_url)
        .map(p => ({
          participant_name: p.registrations.participant_name,
          participant_email: p.registrations.participant_email,
          event_title: p.registrations.events.title,
          amount: Number(p.amount),
          transaction_id: p.transaction_id || 'N/A',
          proof_url: (p.proof_url || p.registrations.payment_proof_url)!,
          created_at: p.created_at,
        }));

      if (proofsToExport.length === 0) {
        toast.error('No payment proofs available to export');
        setLoading(false);
        return;
      }

      toast.info('Generating PDF... This may take a moment');
      const chapterSuffix = filterChapter !== 'all' ? `-${filterChapter}` : '';
      await exportPaymentProofsToPDF(
        proofsToExport,
        `payment-proofs${chapterSuffix}-${new Date().toISOString().split('T')[0]}.pdf`
      );
      toast.success(`Exported ${proofsToExport.length} payment proofs to PDF`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export payment proofs');
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">All Payments</h2>
          <p className="text-muted-foreground">Manage payments across all chapters</p>
        </div>
        <Button 
          onClick={handleExportPaymentProofs}
          disabled={loading}
        >
          <Download className="mr-2 h-4 w-4" />
          {loading ? 'Exporting...' : 'Export Payment Proofs PDF'}
        </Button>
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
                        {payment.proof_url || payment.registrations.payment_proof_url ? (
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
                                  src={(payment.proof_url || payment.registrations.payment_proof_url || '').startsWith('http') 
                                    ? (payment.proof_url || payment.registrations.payment_proof_url!) 
                                    : supabase.storage.from('payment-proofs').getPublicUrl(payment.proof_url || payment.registrations.payment_proof_url!).data.publicUrl
                                  } 
                                  alt="Payment proof" 
                                  className="rounded-lg transition-all"
                                  style={{ width: `${imageZoom}%`, height: 'auto' }}
                                  onError={(e) => {
                                    console.error('Failed to load image:', payment.proof_url || payment.registrations.payment_proof_url);
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              </div>
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
              <p className="text-2xl font-bold">{filteredPayments.length}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Verified Amount</p>
              <p className="text-2xl font-bold">
                ₹{filteredPayments.filter(p => p.status === 'verified').reduce((sum, p) => sum + Number(p.amount), 0)}
              </p>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">
                ₹{filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
