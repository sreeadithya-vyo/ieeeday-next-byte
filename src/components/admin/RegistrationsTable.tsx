import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useRole';

interface Registration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  status: string;
  payment_status: string;
  transaction_id: string;
  payment_proof_url: string;
  created_at: string;
  events: {
    title: string;
    chapter: string;
  };
}

interface Props {
  chapterFilter?: Chapter | null;
}

export default function RegistrationsTable({ chapterFilter }: Props) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, [chapterFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    let query = supabase
      .from('registrations')
      .select('*, events(title, chapter)');

    if (chapterFilter) {
      query = query.eq('events.chapter', chapterFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch registrations');
    } else {
      setRegistrations(data as any);
    }
    setLoading(false);
  };

  const handleApproval = async (id: string, action: 'verify' | 'reject') => {
    const { error } = await supabase.functions.invoke('approve-registration', {
      body: { registration_id: id, action },
    });

    if (error) {
      toast.error(`Failed to ${action} registration`);
    } else {
      toast.success(`Registration ${action === 'verify' ? 'approved' : 'rejected'} successfully`);
      fetchRegistrations();
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Event', 'Status', 'Payment Status', 'Transaction ID', 'Date'],
      ...registrations.map(r => [
        r.participant_name,
        r.participant_email,
        r.participant_phone,
        r.events.title,
        r.status,
        r.payment_status,
        r.transaction_id || '',
        new Date(r.created_at).toLocaleDateString(),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${chapterFilter || 'all'}-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{reg.participant_name}</TableCell>
                <TableCell>{reg.participant_email}</TableCell>
                <TableCell>{reg.events.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{reg.events.chapter}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={reg.status === 'confirmed' ? 'default' : reg.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {reg.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={reg.payment_status === 'verified' ? 'default' : reg.payment_status === 'rejected' ? 'destructive' : 'secondary'}>
                    {reg.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>{reg.transaction_id || '-'}</TableCell>
                <TableCell>
                  {reg.payment_proof_url && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {reg.payment_status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApproval(reg.id, 'verify')}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleApproval(reg.id, 'reject')}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
