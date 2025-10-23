import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";

export default function ChapterReports() {
  const { chapter } = useRole();
  const [loading, setLoading] = useState<string | null>(null);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header]?.toString() || '';
        return `"${value.replace(/"/g, '""')}"`;
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

  const exportRegistrations = async () => {
    try {
      setLoading('registrations');
      
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

      const { data, error } = await supabase
        .from('registrations')
        .select(`
          participant_name,
          participant_email,
          participant_phone,
          participant_branch,
          participant_year,
          college_id,
          status,
          payment_status,
          created_at,
          events (title)
        `)
        .in('event_id', eventIds);

      if (error) throw error;

      const formattedData = data.map(reg => ({
        Name: reg.participant_name,
        Email: reg.participant_email,
        Phone: reg.participant_phone,
        Branch: reg.participant_branch,
        Year: reg.participant_year,
        CollegeID: reg.college_id,
        Event: reg.events.title,
        Status: reg.status,
        PaymentStatus: reg.payment_status,
        RegisteredAt: reg.created_at,
      }));

      exportToCSV(formattedData, `${chapter}_registrations`);
      toast.success('Registrations exported successfully');
    } catch (error: any) {
      toast.error('Failed to export registrations');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const exportPayments = async () => {
    try {
      setLoading('payments');
      
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

      const { data: registrationsData } = await supabase
        .from('registrations')
        .select('id')
        .in('event_id', eventIds);

      const registrationIds = registrationsData?.map(r => r.id) || [];

      const { data, error } = await supabase
        .from('payments')
        .select(`
          amount,
          transaction_id,
          status,
          created_at,
          registrations (
            participant_name,
            participant_email,
            events (title)
          )
        `)
        .in('registration_id', registrationIds);

      if (error) throw error;

      const formattedData = data.map(payment => ({
        Participant: payment.registrations.participant_name,
        Email: payment.registrations.participant_email,
        Event: payment.registrations.events.title,
        Amount: payment.amount,
        TransactionID: payment.transaction_id,
        Status: payment.status,
        Date: payment.created_at,
      }));

      exportToCSV(formattedData, `${chapter}_payments`);
      toast.success('Payments exported successfully');
    } catch (error: any) {
      toast.error('Failed to export payments');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const exportEvents = async () => {
    try {
      setLoading('events');
      
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();

      if (!chapterData) return;

      const { data, error } = await supabase
        .from('events')
        .select('title, date, venue, capacity, short_desc')
        .eq('chapter_id', chapterData.id);

      if (error) throw error;

      const formattedData = data.map(event => ({
        Title: event.title,
        Date: event.date,
        Venue: event.venue,
        Capacity: event.capacity,
        Description: event.short_desc,
      }));

      exportToCSV(formattedData, `${chapter}_events`);
      toast.success('Events exported successfully');
    } catch (error: any) {
      toast.error('Failed to export events');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports & Exports</h2>
        <p className="text-muted-foreground">Export data for {chapter} chapter</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Registrations Report
            </CardTitle>
            <CardDescription>
              Export all registration data with participant details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={exportRegistrations} 
              disabled={loading === 'registrations'}
              className="w-full"
            >
              {loading === 'registrations' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Registrations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payments Report
            </CardTitle>
            <CardDescription>
              Export payment history with transaction details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={exportPayments} 
              disabled={loading === 'payments'}
              className="w-full"
            >
              {loading === 'payments' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Payments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Events Report
            </CardTitle>
            <CardDescription>
              Export all event details and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={exportEvents} 
              disabled={loading === 'events'}
              className="w-full"
            >
              {loading === 'events' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
