import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import {
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  Shield,
  Activity,
  FileText
} from 'lucide-react';

interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  pendingApprovals: number;
  confirmedRegistrations: number;
  chapterEvents: number;
}

interface PendingAction {
  id: string;
  participant_name: string;
  event_title: string;
  chapter: string;
  created_at: string;
}

export default function SuperAdminDashboard() {
  const { signOut } = useAuth();
  const { chapter } = useRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalRegistrations: 0,
    pendingApprovals: 0,
    confirmedRegistrations: 0,
    chapterEvents: 0,
  });
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  useEffect(() => {
    fetchDashboardData();
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

    // Fetch chapter-specific events
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('chapter_id', chapterData.id);

    const eventIds = events?.map(e => e.id) || [];

    // Fetch registrations for chapter events
    const { data: registrations } = await supabase
      .from('registrations')
      .select('*')
      .in('event_id', eventIds);

    // Fetch pending approvals with details
    const { data: pending } = await supabase
      .from('registrations')
      .select('id, participant_name, created_at, events(title, chapters(code))')
      .in('event_id', eventIds)
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(5);

    setStats({
      totalEvents: events?.length || 0,
      totalRegistrations: registrations?.length || 0,
      pendingApprovals: registrations?.filter(r => r.status === 'submitted').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      chapterEvents: events?.length || 0,
    });

    setPendingActions(pending?.map(p => ({
      id: p.id,
      participant_name: p.participant_name,
      event_title: (p.events as any)?.title || 'N/A',
      chapter: (p.events as any)?.chapters?.code || chapter,
      created_at: p.created_at,
    })) || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Super Admin Portal</h1>
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
        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6" />
              <CardTitle className="text-2xl">Super Admin Control Center</CardTitle>
            </div>
            <CardDescription className="text-white/90 text-base">
              Complete system oversight and administrative control over {chapter} chapter events.
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
              <div className="text-3xl font-bold">{stats.totalRegistrations}</div>
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
              <CardTitle className="text-sm font-medium">Chapter Health</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Excellent status</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Pending Approvals ({stats.pendingApprovals})
                  </CardTitle>
                  <CardDescription>Review and approve pending registrations and payments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>All caught up! No pending approvals.</p>
                </div>
              ) : (
                pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{action.participant_name}</p>
                      <p className="text-xs text-muted-foreground">{action.event_title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Registration</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
              {pendingActions.length > 0 && (
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/participants')}>
                  View All Approvals
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Events
              </CardTitle>
              <CardDescription>Monitor your latest events and their performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.totalEvents === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No events found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Chapter Events</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{stats.totalRegistrations} registrations</span>
                      <Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigate('/admin/events')}>
                        Manage <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
              <Button variant="default" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/events')}>
                <Calendar className="h-6 w-6" />
                <span>Manage Events</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/participants')}>
                <CheckCircle className="h-6 w-6" />
                <span>Manage Registrations</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/payments')}>
                <Clock className="h-6 w-6" />
                <span>Process Payments</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/exports')}>
                <FileText className="h-6 w-6" />
                <span>Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
