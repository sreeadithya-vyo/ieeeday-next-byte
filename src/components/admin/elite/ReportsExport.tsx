import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsExport() {
  const [exportType, setExportType] = useState('');
  const [filterChapter, setFilterChapter] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!exportType) {
      toast.error('Please select export type');
      return;
    }

    setLoading(true);

    try {
      if (exportType === 'all_registrations') {
        let query = supabase
          .from('registrations')
          .select(`
            *,
            events(title, chapters(code))
          `);

        if (filterStatus) {
          query = query.eq('status', filterStatus as any);
        }

        const { data, error } = await query;

        if (error) throw error;

        let filtered = data;
        if (filterChapter) {
          filtered = data.filter(reg => (reg.events as any)?.chapters?.code === filterChapter);
        }

        const formatted = filtered.map(reg => ({
          'Registration ID': reg.id,
          'Participant Name': reg.participant_name,
          'Email': reg.participant_email,
          'Phone': reg.participant_phone,
          'Branch': reg.participant_branch,
          'Year': reg.participant_year,
          'Event': (reg.events as any)?.title || 'N/A',
          'Chapter': (reg.events as any)?.chapters?.code || 'N/A',
          'Status': reg.status,
          'Payment Status': reg.payment_status,
          'Created At': new Date(reg.created_at).toLocaleString(),
        }));

        exportToCSV(formatted, 'registrations');
        toast.success('Export successful');
      }

      if (exportType === 'by_chapter') {
        if (!filterChapter) {
          toast.error('Please select a chapter');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('registrations')
          .select(`
            *,
            events(title, chapters!inner(code))
          `);

        if (error) throw error;

        const filtered = data.filter(reg => (reg.events as any)?.chapters?.code === filterChapter);

        const formatted = filtered.map(reg => ({
          'Registration ID': reg.id,
          'Participant Name': reg.participant_name,
          'Email': reg.participant_email,
          'Event': (reg.events as any)?.title || 'N/A',
          'Status': reg.status,
          'Payment Status': reg.payment_status,
        }));

        exportToCSV(formatted, `${filterChapter}_registrations`);
        toast.success('Export successful');
      }

      if (exportType === 'by_event') {
        const { data, error } = await supabase
          .from('registrations')
          .select(`
            *,
            events(title, chapters(code))
          `);

        if (error) throw error;

        const formatted = data.map(reg => ({
          'Event': (reg.events as any)?.title || 'N/A',
          'Chapter': (reg.events as any)?.chapters?.code || 'N/A',
          'Participant': reg.participant_name,
          'Email': reg.participant_email,
          'Status': reg.status,
        }));

        exportToCSV(formatted, 'events_registrations');
        toast.success('Export successful');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }

    setLoading(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>Select export type and filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Export Type</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all_registrations">All Registrations</SelectItem>
                <SelectItem value="by_chapter">By Chapter</SelectItem>
                <SelectItem value="by_event">By Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(exportType === 'all_registrations' || exportType === 'by_chapter') && (
            <div>
              <Label>Filter by Chapter (Optional)</Label>
              <Select value={filterChapter} onValueChange={setFilterChapter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All chapters" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="">All Chapters</SelectItem>
                  <SelectItem value="APS">APS</SelectItem>
                  <SelectItem value="SPS">SPS</SelectItem>
                  <SelectItem value="PROCOM">PROCOM</SelectItem>
                  <SelectItem value="CS">CS</SelectItem>
                  <SelectItem value="PES">PES</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {exportType === 'all_registrations' && (
            <div>
              <Label>Filter by Status (Optional)</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleExport} disabled={loading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Exporting...' : 'Export to CSV'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>Pre-configured export templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => {
            setExportType('all_registrations');
            setFilterStatus('confirmed');
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Confirmed Registrations Report
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => {
            setExportType('all_registrations');
            setFilterStatus('submitted');
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Pending Approvals Report
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => {
            setExportType('by_event');
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Event-wise Breakdown
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}