import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import EventFormDialog from './EventFormDialog';

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
  const { isEliteMaster, isSuperAdmin, isEventAdmin } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDeleteEvent = async (eventId: string) => {
    setDeletingId(eventId);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = isEliteMaster || isSuperAdmin || isEventAdmin;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <EventFormDialog onSuccess={fetchData} />
      </div>
      
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Chapter</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assigned Admin</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/events/${event.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  
                  <Select
                    value={event.assigned_admin_id || ''}
                    onValueChange={(value) => handleAssignAdmin(event.id, value)}
                  >
                    <SelectTrigger className="w-[150px]">
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

                  {canDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={deletingId === event.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEvent(event.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
