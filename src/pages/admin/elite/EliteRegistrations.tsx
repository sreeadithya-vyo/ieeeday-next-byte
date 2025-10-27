import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_branch: string;
  participant_year: string;
  status: string;
  payment_status: string;
  created_at: string;
  is_ieee_member: boolean;
  ieee_member_id: string | null;
  payment_proof_url: string | null;
  events: {
    title: string;
    chapters: {
      code: string;
    };
  };
}

export default function EliteRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionNote, setRejectionNote] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [filterChapter, setFilterChapter] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          events (
            title,
            chapters (code)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      toast.error('Failed to load registrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          status: 'approved',
          verified_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;
      
      toast.success('Registration approved');
      fetchRegistrations();
    } catch (error: any) {
      toast.error('Failed to approve registration');
      console.error(error);
    }
  };

  const handleReject = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          status: 'rejected',
          rejection_note: rejectionNote,
          verified_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;
      
      toast.success('Registration rejected');
      setRejectionNote("");
      setSelectedRegistration(null);
      fetchRegistrations();
    } catch (error: any) {
      toast.error('Failed to reject registration');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      submitted: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesChapter = filterChapter === "all" || reg.events.chapters.code === filterChapter;
    const matchesStatus = filterStatus === "all" || reg.status === filterStatus;
    return matchesChapter && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Registrations</h1>
            <p className="text-muted-foreground">Manage registrations across all chapters</p>
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
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No registrations found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Chapter</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>IEEE Member</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Payment Proof</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reg.participant_name}</div>
                            <div className="text-sm text-muted-foreground">{reg.participant_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{reg.events.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{reg.events.chapters.code}</Badge>
                        </TableCell>
                        <TableCell>{reg.participant_branch}</TableCell>
                        <TableCell>{reg.participant_year}</TableCell>
                        <TableCell>
                          {reg.is_ieee_member ? (
                            <div className="text-sm">
                              <Badge variant="secondary" className="mb-1">IEEE Member</Badge>
                              <p className="text-muted-foreground">ID: {reg.ieee_member_id}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not IEEE Member</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell>
                          <Badge variant={reg.payment_status === 'verified' ? 'default' : 'secondary'}>
                            {reg.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reg.payment_proof_url ? (
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
                                  src={reg.payment_proof_url.startsWith('http') 
                                    ? reg.payment_proof_url 
                                    : supabase.storage.from('payment-proofs').getPublicUrl(reg.payment_proof_url).data.publicUrl
                                  } 
                                  alt="Payment proof" 
                                  className="w-full h-auto rounded-lg"
                                  onError={(e) => {
                                    console.error('Failed to load image:', reg.payment_proof_url);
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-muted-foreground text-sm">No proof</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {reg.status === 'submitted' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(reg.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setSelectedRegistration(reg.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Registration</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea
                                      placeholder="Enter rejection reason..."
                                      value={rejectionNote}
                                      onChange={(e) => setRejectionNote(e.target.value)}
                                    />
                                    <Button
                                      onClick={() => selectedRegistration && handleReject(selectedRegistration)}
                                      variant="destructive"
                                    >
                                      Confirm Rejection
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
