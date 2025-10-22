import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
  Eye,
  LogOut,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

interface Stats {
  chapterEvents: number;
  pendingPayments: number;
  confirmedRegistrations: number;
  rejectedRegistrations: number;
}

interface RecentEvent {
  id: string;
  title: string;
  date: string;
  day: number;
  registrationsCount: number;
  status: string;
}

export default function ChapterAdminDashboard() {
  const { signOut } = useAuth();
  const { chapter } = useRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    chapterEvents: 0,
    pendingPayments: 0,
    confirmedRegistrations: 0,
    rejectedRegistrations: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);

  useEffect(() => {
    if (chapter) {
      fetchDashboardData();
    }
  }, [chapter]);

  const fetchDashboardData = async () => {
    if (!chapter) return;

    // Get chapter_id
    const { data: chapterData } = await supabase
      .from('chapters')
      .select('id')
      .eq('code', chapter)
      .single();

    if (!chapterData) return;

    // Fetch chapter events
    const { data: events } = await supabase
      .from('events')
      .select('id, title, date, day')
      .eq('chapter_id', chapterData.id)
      .order('date', { ascending: false })
      .limit(3);

    const eventIds = events?.map(e => e.id) || [];

    // Fetch registrations
    const { data: registrations } = await supabase
      .from('registrations')
      .select('*')
      .in('event_id', eventIds);

    // Get event statistics
    const eventsWithStats = await Promise.all(
      (events || []).map(async (event) => {
        const { data: eventRegs } = await supabase
          .from('registrations')
          .select('id')
          .eq('event_id', event.id);

        const eventDate = new Date(event.date);
        const today = new Date();
        const status = eventDate > today ? 'Upcoming' : eventDate.toDateString() === today.toDateString() ? 'Ongoing' : 'Completed';

        return {
          ...event,
          registrationsCount: eventRegs?.length || 0,
          status,
        };
      })
    );

    setStats({
      chapterEvents: events?.length || 0,
      pendingPayments: registrations?.filter(r => r.payment_status === 'pending').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      rejectedRegistrations: registrations?.filter(r => r.status === 'rejected').length || 0,
    });

    setRecentEvents(eventsWithStats);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">College Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{chapter} Chapter</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-purple-500 text-white border-0">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-6 w-6" />
              <CardTitle className="text-2xl">UNI Guild - College Admin Control Center</CardTitle>
            </div>
            <CardDescription className="text-white/90 text-base">
              Complete 360° overview: Manage events, participants, evaluators, organisers, and track analytics.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.chapterEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">+4 this month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.confirmedRegistrations}</div>
              <p className="text-xs text-muted-foreground mt-1">+16% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(stats.confirmedRegistrations * 100).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">+25% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Events
                  </CardTitle>
                  <CardDescription>Monitor your latest events and their performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No events found for your chapter.</p>
                </div>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Day {event.day} • {new Date(event.date).toLocaleDateString()}</span>
                        <span>{event.registrationsCount} registrations</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={event.status === 'Upcoming' ? 'default' : event.status === 'Ongoing' ? 'secondary' : 'outline'}>
                        {event.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/events/${event.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/events')}>
                View All Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>Review and approve pending registrations and payments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Pending Payments</p>
                      <p className="text-xs text-muted-foreground">Awaiting verification</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Confirmed</p>
                      <p className="text-xs text-muted-foreground">Payment verified</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stats.confirmedRegistrations}</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">Rejected</p>
                      <p className="text-xs text-muted-foreground">Registration declined</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stats.rejectedRegistrations}</div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate('/admin/participants')}>
                Manage Registrations
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="default" className="h-auto py-6 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>Create New Event</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/participants')}>
                <Users className="h-6 w-6" />
                <span>Manage Registrations</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>Process Payments</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
