import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  chapter: string;
  day: number;
  date: string;
  assigned_admin_id: string | null;
}

interface Admin {
  id: string;
  name: string;
  chapter: string;
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: eventsData } = await supabase
      .from('events')
      .select('*, chapters(code)')
      .order('date', { ascending: true });

    const { data: adminsData } = await supabase
      .from('user_roles')
      .select('user_id, chapter, profiles(name)')
      .eq('role', 'event_admin');

    setEvents(eventsData?.map(e => ({
      id: e.id,
      title: e.title,
      chapter: (e.chapters as any)?.code || '',
      day: e.day,
      date: e.date,
      assigned_admin_id: e.assigned_admin_id,
    })) || []);
    setAdmins(adminsData?.map(a => ({
      id: a.user_id,
      name: (a.profiles as any)?.name || 'Unknown',
      chapter: a.chapter || '',
    })) || []);

    setLoading(false);
  };

  const handleAssignAdmin = async (eventId: string, adminId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ assigned_admin_id: adminId })
      .eq('id', eventId);

    if (error) {
      toast.error('Failed to assign admin');
    } else {
      toast.success('Admin assigned successfully');
      fetchData();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Chapter</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assigned Admin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{event.chapter}</Badge>
              </TableCell>
              <TableCell>Day {event.day}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>
                {event.assigned_admin_id
                  ? admins.find(a => a.id === event.assigned_admin_id)?.name || 'Unknown'
                  : 'Not assigned'}
              </TableCell>
              <TableCell>
                <Select
                  value={event.assigned_admin_id || ''}
                  onValueChange={(value) => handleAssignAdmin(event.id, value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Assign admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins
                      .filter(a => a.chapter === event.chapter)
                      .map(admin => (
                        <SelectItem key={admin.id} value={admin.id}>
                          {admin.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
