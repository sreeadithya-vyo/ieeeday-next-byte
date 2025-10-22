import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useRole';

interface Event {
  id: string;
  title: string;
  date: string;
  day: number;
  venue: string;
  chapter: string;
  registrationsCount: number;
  pendingCount: number;
}

interface MyEventsProps {
  chapter: Chapter;
  onViewRegistrations: (eventId: string) => void;
}

export default function MyEvents({ chapter, onViewRegistrations }: MyEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [chapter]);

  const fetchEvents = async () => {
    setLoading(true);
    
    // First get the chapter_id
    const { data: chapterData } = await supabase
      .from('chapters')
      .select('id')
      .eq('code', chapter)
      .single();
    
    if (!chapterData) {
      setLoading(false);
      return;
    }
    
    const { data: eventsData, error } = await supabase
      .from('events')
      .select('id, title, date, day, venue, chapters(code)')
      .eq('chapter_id', chapterData.id)
      .order('day', { ascending: true });

    if (error) {
      toast.error('Failed to fetch events');
      setLoading(false);
      return;
    }

    const eventsWithStats = await Promise.all(
      (eventsData || []).map(async (event) => {
        const { data: registrations } = await supabase
          .from('registrations')
          .select('id, payment_status')
          .eq('event_id', event.id);

        return {
          id: event.id,
          title: event.title,
          date: event.date,
          day: event.day,
          venue: event.venue,
          chapter: (event.chapters as any)?.code || '',
          registrationsCount: registrations?.length || 0,
          pendingCount: registrations?.filter(r => r.payment_status === 'pending').length || 0,
        };
      })
    );

    setEvents(eventsWithStats);
    setLoading(false);
  };

  const exportEventData = async (eventId: string, eventTitle: string) => {
    const { data: registrations } = await supabase
      .from('registrations')
      .select('participant_name, participant_email, participant_phone, participant_branch, participant_year, status, payment_status, created_at')
      .eq('event_id', eventId);

    if (!registrations) {
      toast.error('No data to export');
      return;
    }

    const csv = [
      ['Name', 'Email', 'Phone', 'Branch', 'Year', 'Status', 'Payment', 'Date'],
      ...registrations.map(r => [
        r.participant_name,
        r.participant_email,
        r.participant_phone || '',
        r.participant_branch || '',
        r.participant_year || '',
        r.status,
        r.payment_status || 'pending',
        new Date(r.created_at).toLocaleDateString(),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle}-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Event data exported successfully');
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Events</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3" />
                  Day {event.day} | {event.date}
                </div>
                <div className="text-xs mt-1">{event.venue}</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{event.registrationsCount} Registrations</span>
                </div>
                {event.pendingCount > 0 && (
                  <Badge variant="secondary">{event.pendingCount} Pending</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => onViewRegistrations(event.id)}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportEventData(event.id, event.title)}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {events.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          No events found for your chapter.
        </div>
      )}
    </div>
  );
}
