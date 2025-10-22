import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useRole';
import ApprovalDialog from './ApprovalDialog';

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_branch: string;
  participant_year: string;
  status: string;
  payment_status: string;
  transaction_id: string;
  payment_proof_url: string;
  created_at: string;
  events: {
    id: string;
    title: string;
    chapter: string;
  };
}

interface ParticipantsTableProps {
  chapter: Chapter;
  eventFilter?: string | null;
}

export default function ParticipantsTable({ chapter, eventFilter }: ParticipantsTableProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<{ id: string; name: string; action: 'verify' | 'reject' } | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, [chapter, eventFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('chapter', chapter);

    const eventIds = events?.map(e => e.id) || [];

    let query = supabase
      .from('registrations')
      .select('*, events(id, title, chapter)')
      .in('event_id', eventIds);

    if (eventFilter) {
      query = query.eq('event_id', eventFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch participants');
    } else {
      setRegistrations(data as any);
    }
    setLoading(false);
  };

  const handleApprovalClick = (id: string, name: string, action: 'verify' | 'reject') => {
    setSelectedRegistration({ id, name, action });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading participants...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RegID</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-mono text-xs">{reg.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{reg.participant_name}</div>
                    <div className="text-xs text-muted-foreground">{reg.participant_email}</div>
                  </div>
                </TableCell>
                <TableCell>{reg.participant_branch} - Year {reg.participant_year}</TableCell>
                <TableCell>{reg.participant_phone}</TableCell>
                <TableCell>{reg.events.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      reg.payment_status === 'verified'
                        ? 'default'
                        : reg.payment_status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {reg.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {reg.payment_proof_url ? (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">No proof</span>
                  )}
                </TableCell>
                <TableCell>
                  {reg.payment_status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprovalClick(reg.id, reg.participant_name, 'verify')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApprovalClick(reg.id, reg.participant_name, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {reg.payment_status !== 'pending' && (
                    <Badge variant="outline">{reg.status}</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {registrations.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          No participants found.
        </div>
      )}

      {selectedRegistration && (
        <ApprovalDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          registrationId={selectedRegistration.id}
          participantName={selectedRegistration.name}
          action={selectedRegistration.action}
          onSuccess={fetchRegistrations}
        />
      )}
    </div>
  );
}
