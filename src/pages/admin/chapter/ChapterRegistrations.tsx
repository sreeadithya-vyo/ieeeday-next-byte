import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_branch: string;
  participant_year: string;
  status: string;
  payment_status: string;
  payment_proof_url: string | null;
  transaction_id: string | null;
  college_id: string;
  created_at: string;
  is_ieee_member: boolean;
  ieee_member_id: string | null;
  events: {
    title: string;
  };
}

export default function ChapterRegistrations() {
  const { chapter } = useRole();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionNote, setRejectionNote] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    if (chapter) {
      fetchRegistrations();
    }
  }, [chapter]);

  const fetchRegistrations = async () => {
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
        setRegistrations([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          events (title)
        `)
        .in('event_id', eventIds)
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
        <h2 className="text-2xl font-bold">Registrations</h2>
        <p className="text-muted-foreground">Manage participant registrations for {chapter} events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registrations found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
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
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reg.participant_name}</div>
                        <div className="text-sm text-muted-foreground">{reg.participant_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{reg.events.title}</TableCell>
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
                      {reg.payment_proof_url && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProof(reg.payment_proof_url)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Proof
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Payment Proof</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center">
                              <img 
                                src={reg.payment_proof_url} 
                                alt="Payment Proof" 
                                className="max-w-full h-auto rounded-lg"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
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
    </div>
  );
}
