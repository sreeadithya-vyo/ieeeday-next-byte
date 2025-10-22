import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, Calendar, CheckCircle, Clock, TrendingUp, Shield, ChevronRight, UserCog, ClipboardList, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import RegistrationsTable from './RegistrationsTable';
import EventsManagement from './EventsManagement';
import UsersManagement from './UsersManagement';

export default function SuperAdminDashboard() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingPayments: 0,
    confirmedRegistrations: 0,
    totalEvents: 0,
  });
  const [pendingActions, setPendingActions] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchPendingActions();
  }, []);

  const fetchStats = async () => {
    const { data: registrations } = await supabase
      .from('registrations')
      .select('*');

    const { data: events } = await supabase
      .from('events')
      .select('id');

    setStats({
      totalRegistrations: registrations?.length || 0,
      pendingPayments: registrations?.filter(r => r.status === 'submitted').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      totalEvents: events?.length || 0,
    });
  };

  const fetchPendingActions = async () => {
    const { data } = await supabase
      .from('registrations')
      .select('*, events(title)')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(4);
    
    setPendingActions(data || []);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Hero Banner */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">Super Admin Control Center</h1>
                </div>
                <p className="text-blue-100">Complete system oversight and administrative control over UNI Guild platform.</p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +8% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.9%</div>
                  <p className="text-xs text-muted-foreground mt-1">Status: Healthy</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45.2K</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +25% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Pending Actions ({pendingActions.length})
                    </CardTitle>
                    <CardDescription>Items requiring your immediate attention</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('registrations')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingActions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No pending actions</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {pendingActions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-sm">Review Registration</p>
                          <p className="text-xs text-muted-foreground">{action.events?.title || 'Event'} • Priority: Medium</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{idx + 3}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500 to-purple-700 text-white border-none" onClick={() => setActiveTab('users')}>
                  <CardContent className="pt-6">
                    <UserCog className="h-8 w-8 mb-3" />
                    <h4 className="font-semibold mb-1">Manage Users</h4>
                    <p className="text-sm text-purple-100">Add, edit, or remove users</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('events')}>
                  <CardContent className="pt-6">
                    <Calendar className="h-8 w-8 mb-3 text-primary" />
                    <h4 className="font-semibold mb-1">Event Oversight</h4>
                    <p className="text-sm text-muted-foreground">Monitor and manage events</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('registrations')}>
                  <CardContent className="pt-6">
                    <ClipboardList className="h-8 w-8 mb-3 text-primary" />
                    <h4 className="font-semibold mb-1">Process Registrations</h4>
                    <p className="text-sm text-muted-foreground">Review pending registrations</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <FileText className="h-8 w-8 mb-3 text-primary" />
                    <h4 className="font-semibold mb-1">View Reports</h4>
                    <p className="text-sm text-muted-foreground">Analytics and insights</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      
      case 'registrations':
        return (
          <Card>
            <CardHeader>
              <CardTitle>All Registrations</CardTitle>
              <CardDescription>Manage registrations across all chapters</CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrationsTable />
            </CardContent>
          </Card>
        );
      
      case 'events':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Manage all events and assign to chapter chairs</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsManagement />
            </CardContent>
          </Card>
        );
      
      case 'users':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Chapter Admins Management</CardTitle>
              <CardDescription>Create and manage chapter administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersManagement restrictToEventAdmins />
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Super Admin Dashboard</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="flex gap-2 border-b">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'registrations', label: 'Registrations' },
            { id: 'events', label: 'Events' },
            { id: 'users', label: 'Chapter Admins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
