import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import RegistrationsTable from './RegistrationsTable';

export default function ChapterAdminDashboard() {
  const { signOut } = useAuth();
  const { chapter } = useRole();
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingPayments: 0,
    confirmedRegistrations: 0,
    chapterEvents: 0,
  });

  useEffect(() => {
    if (chapter) {
      fetchChapterStats();
    }
  }, [chapter]);

  const fetchChapterStats = async () => {
    if (!chapter) return;

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('chapter', chapter);

    const eventIds = events?.map(e => e.id) || [];

    const { data: registrations } = await supabase
      .from('registrations')
      .select('*')
      .in('event_id', eventIds);

    setStats({
      totalRegistrations: registrations?.length || 0,
      pendingPayments: registrations?.filter(r => r.payment_status === 'pending').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      chapterEvents: events?.length || 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{chapter} Chapter Dashboard</h1>
            <p className="text-muted-foreground">Manage your chapter's events and registrations</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmedRegistrations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chapter Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chapterEvents}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{chapter} Registrations</CardTitle>
            <CardDescription>Manage payment approvals for your chapter</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationsTable chapterFilter={chapter} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
