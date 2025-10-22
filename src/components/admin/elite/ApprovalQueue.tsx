import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  event_id: string;
  payment_status: string;
  status: string;
  payment_proof_url: string | null;
  events?: {
    title: string;
    chapter: string;
  };
}

export default function ApprovalQueue() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events(title, chapter)
      `)
      .eq('status', 'submitted')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRegistrations(data as Registration[]);
    }
  };

  const handleVerify = async (regId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('registrations')
      .update({ 
        status: 'confirmed',
        payment_status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .eq('id', regId);

    if (error) {
      toast.error('Failed to verify registration');
    } else {
      toast.success('Registration verified successfully');
      fetchPendingRegistrations();
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!selectedReg) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('registrations')
      .update({ 
        status: 'rejected',
        rejection_note: rejectionNote,
      })
      .eq('id', selectedReg.id);

    if (error) {
      toast.error('Failed to reject registration');
    } else {
      toast.success('Registration rejected');
      setRejectDialogOpen(false);
      setRejectionNote('');
      fetchPendingRegistrations();
    }
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No pending approvals
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-mono text-xs">
                    {reg.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reg.participant_name}</div>
                      <div className="text-sm text-muted-foreground">{reg.participant_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{reg.events?.title || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{reg.events?.chapter || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reg.payment_status === 'pending' ? 'secondary' : 'default'}>
                      {reg.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerify(reg.id)}
                        disabled={loading}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedReg(reg);
                          setRejectDialogOpen(true);
                        }}
                        disabled={loading}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      {reg.payment_proof_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(reg.payment_proof_url!, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Proof
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rejection Reason</Label>
              <Textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={loading}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}