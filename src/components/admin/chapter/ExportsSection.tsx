import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useRole';
import { exportPaymentProofsToPDF } from '@/lib/exportPaymentProofs';

interface ExportsSectionProps {
  chapter: Chapter;
}

export default function ExportsSection({ chapter }: ExportsSectionProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const exportData = async (type: 'all' | 'pending' | 'verified') => {
    setLoading(type);

    try {
      // First get the chapter_id
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();
      
      if (!chapterData) {
        toast.error('Chapter not found');
        setLoading(null);
        return;
      }

      const { data: events } = await supabase
        .from('events')
        .select('id, title, registration_amount')
        .eq('chapter_id', chapterData.id);

      const eventIds = events?.map(e => e.id) || [];

      let query = supabase
        .from('registrations')
        .select('*, events(title, chapters(code), registration_amount)')
        .in('event_id', eventIds);

      if (type === 'pending') {
        query = query.eq('payment_status', 'pending');
      } else if (type === 'verified') {
        query = query.eq('payment_status', 'verified');
      }

      const { data: registrations, error } = await query.order('created_at', { ascending: false });

      if (error || !registrations) {
        toast.error('Failed to export data');
        setLoading(null);
        return;
      }

      // Export CSV
      const csv = [
        ['Name', 'Email', 'Phone', 'Branch', 'Year', 'Event', 'Payment Status', 'Date'],
        ...registrations.map((r: any) => [
          r.participant_name,
          r.participant_email,
          r.participant_phone || '',
          r.participant_branch || '',
          r.participant_year || '',
          r.events?.title || 'N/A',
          r.payment_status || 'pending',
          new Date(r.created_at).toLocaleDateString(),
        ]),
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chapter}-${type}-participants-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      toast.success(`${registrations.length} records exported to CSV`);

      // Export payment proofs PDF
      const proofsToExport = registrations
        .filter((r: any) => r.payment_proof_url)
        .map((r: any) => ({
          participant_name: r.participant_name,
          participant_email: r.participant_email,
          event_title: r.events?.title || 'N/A',
          amount: r.is_ieee_member 
            ? Math.max(Number(r.events?.registration_amount || 200) - 50, 0) 
            : Number(r.events?.registration_amount || 200),
          transaction_id: r.transaction_id || 'N/A',
          proof_url: r.payment_proof_url,
          created_at: r.created_at,
        }));

      if (proofsToExport.length > 0) {
        toast.info('Generating payment proofs PDF...');
        await exportPaymentProofsToPDF(
          proofsToExport,
          `${chapter}-${type}-payment-proofs-${new Date().toISOString().split('T')[0]}.pdf`
        );
        toast.success(`Exported ${proofsToExport.length} payment proofs to PDF`);
      } else {
        toast.info('No payment proofs found for this selection');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to complete export');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Exports & Reports</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>All Participants</CardTitle>
            <CardDescription>Export complete list of all registrations for {chapter}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => exportData('all')}
              disabled={loading !== null}
            >
              <Download className="mr-2 h-4 w-4" />
              {loading === 'all' ? 'Exporting...' : 'Export All'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Export only registrations with pending payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => exportData('pending')}
              disabled={loading !== null}
            >
              <Download className="mr-2 h-4 w-4" />
              {loading === 'pending' ? 'Exporting...' : 'Export Pending'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Verified</CardTitle>
            <CardDescription>Export confirmed registrations with verified payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => exportData('verified')}
              disabled={loading !== null}
            >
              <Download className="mr-2 h-4 w-4" />
              {loading === 'verified' ? 'Exporting...' : 'Export Verified'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
