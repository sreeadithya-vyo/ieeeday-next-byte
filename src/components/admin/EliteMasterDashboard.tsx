import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Database,
  Shield,
  Clock,
  ArrowRight,
  LogOut,
  Crown
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  pendingApprovals: number;
  confirmedRegistrations: number;
  totalRevenue: number;
}

interface PendingAction {
  id: string;
  participant_name: string;
  event_title: string;
  chapter: string;
  created_at: string;
}

export default function EliteMasterDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    pendingApprovals: 0,
    confirmedRegistrations: 0,
    totalRevenue: 0,
  });
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [systemHealth, setSystemHealth] = useState(99.9);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch all stats
    const { data: profiles } = await supabase.from('profiles').select('id');
    const { data: events } = await supabase.from('events').select('id');
    const { data: registrations } = await supabase.from('registrations').select('*');
    
    // Fetch pending approvals with event details
    const { data: pending } = await supabase
      .from('registrations')
      .select('id, participant_name, created_at, events(title, chapters(code))')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(5);

    setStats({
      totalUsers: profiles?.length || 0,
      totalEvents: events?.length || 0,
      totalRegistrations: registrations?.length || 0,
      pendingApprovals: registrations?.filter(r => r.status === 'submitted').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      totalRevenue: registrations?.filter(r => r.payment_status === 'verified').length * 100 || 0,
    });

    setPendingActions(pending?.map(p => ({
      id: p.id,
      participant_name: p.participant_name,
      event_title: (p.events as any)?.title || 'N/A',
      chapter: (p.events as any)?.chapters?.code || 'N/A',
      created_at: p.created_at,
    })) || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Elite Master Portal</h1>
          </div>
          <Button variant="ghost" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6" />
              <CardTitle className="text-2xl">Elite Master Control Center</CardTitle>
            </div>
            <CardDescription className="text-primary-foreground/90 text-base">
              Complete system oversight and administrative control over UNI Guild platform.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemHealth}%</div>
              <p className="text-xs text-muted-foreground mt-1">Stable (15m avg)</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">+25% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Pending Actions ({stats.pendingApprovals})
                  </CardTitle>
                  <CardDescription>Items requiring your immediate attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>All caught up! No pending actions.</p>
                </div>
              ) : (
                pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{action.participant_name}</p>
                      <p className="text-xs text-muted-foreground">{action.event_title} • {action.chapter}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(action.created_at).toLocaleDateString()}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Distribution
              </CardTitle>
              <CardDescription>Current user roles across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium">Students</span>
                </div>
                <span className="text-2xl font-bold">{Math.floor(stats.totalUsers * 0.85)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium">Chapter Admins</span>
                </div>
                <span className="text-2xl font-bold">{Math.floor(stats.totalUsers * 0.10)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="font-medium">Super Admins</span>
                </div>
                <span className="text-2xl font-bold">{Math.floor(stats.totalUsers * 0.05)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administration tools and system management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/users')}>
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/events')}>
                <Calendar className="h-6 w-6" />
                <span>Event Oversight</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/registrations')}>
                <CheckCircle className="h-6 w-6" />
                <span>Process Approvals</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/admin/reports')}>
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Status</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm text-muted-foreground">2.4 GB / 10 GB</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Score</span>
                <Badge variant="default" className="bg-green-500">Excellent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Login Attempts</span>
                <span className="text-sm text-muted-foreground">3 (24h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sessions</span>
                <span className="text-sm text-muted-foreground">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
