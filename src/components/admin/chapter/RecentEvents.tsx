import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface RecentEventsProps {
  chapter: string | null;
  onViewRegistrations: (eventId: string) => void;
}

export default function RecentEvents({ chapter, onViewRegistrations }: RecentEventsProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (chapter) {
      fetchEvents();
    }
  }, [chapter]);

  const fetchEvents = async () => {
    if (!chapter) return;

    const { data: chapterData } = await supabase
      .from('chapters')
      .select('id')
      .eq('code', chapter)
      .single();

    if (!chapterData) return;

    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .eq('chapter_id', chapterData.id)
      .order('date', { ascending: false })
      .limit(3);

    if (eventsData) {
      const eventsWithCounts = await Promise.all(
        eventsData.map(async (event) => {
          const { count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);
          
          return { ...event, registrations: [{ count: count || 0 }] };
        })
      );
      setEvents(eventsWithCounts);
    }
  };

  const getEventStatus = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    
    if (eventDate > today) return { label: 'Active', variant: 'default' as const };
    if (eventDate.toDateString() === today.toDateString()) return { label: 'Open', variant: 'secondary' as const };
    return { label: 'Ongoing', variant: 'outline' as const };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Recent Events</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Monitor your latest events and their performance</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No events found</p>
        ) : (
          events.map((event) => {
            const status = getEventStatus(event.date);
            return (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{event.registrations?.[0]?.count || 0} registrations</span>
                    <span>Deadline: {format(new Date(event.date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewRegistrations(event.id)}
                >
                  Manage
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
