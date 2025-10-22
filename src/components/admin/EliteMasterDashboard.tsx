import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Shield, 
  UserCog, 
  FileText, 
  ClipboardList,
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  Activity,
  Database,
  Lock,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import EliteStatCards from './elite/EliteStatCards';
import ApprovalQueue from './elite/ApprovalQueue';
import EventsManagement from './EventsManagement';
import ChapterAdminManagement from './elite/ChapterAdminManagement';
import SuperAdminManagement from './elite/SuperAdminManagement';
import UsersManagement from './UsersManagement';
import AuditLogs from './AuditLogs';
import ReportsExport from './elite/ReportsExport';
import RegistrationsTable from './RegistrationsTable';

type NavItem = 'dashboard' | 'events' | 'registrations' | 'chapter_admins' | 'super_admins' | 'role_management' | 'audit_logs' | 'reports';

export default function EliteMasterDashboard() {
  const { signOut } = useAuth();
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events' as NavItem, label: 'Events', icon: Calendar },
    { id: 'registrations' as NavItem, label: 'Registrations', icon: ClipboardList },
    { id: 'chapter_admins' as NavItem, label: 'Chapter Admins', icon: UserCog },
    { id: 'super_admins' as NavItem, label: 'Super Admins', icon: Shield },
    { id: 'role_management' as NavItem, label: 'Role Management', icon: Users },
    { id: 'audit_logs' as NavItem, label: 'Audit Logs', icon: FileText },
    { id: 'reports' as NavItem, label: 'Reports & Exports', icon: FileText },
  ];

  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const [systemActivity, setSystemActivity] = useState<any[]>([]);

  useEffect(() => {
    if (activeNav === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeNav]);

  const fetchDashboardData = async () => {
    const { data: registrations } = await supabase
      .from('registrations')
      .select('*, events(title)')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(5);
    
    setPendingActions(registrations || []);

    // Mock system activity - in production, fetch from audit logs
    setSystemActivity([
      { type: 'user', message: 'New user registered', time: '2 minutes ago', status: 'info' },
      { type: 'security', message: 'Security scan completed', time: '15 minutes ago', status: 'success' },
      { type: 'event', message: 'Event approval pending', time: '1 hour ago', status: 'warning' },
    ]);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Hero Banner */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">Elite Master Control Center</h1>
                </div>
                <p className="text-blue-100">Complete system oversight and administrative control over UNI Guild platform.</p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <EliteStatCards />

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pending Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <CardTitle>Pending Actions ({pendingActions.length})</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <CardDescription>Items requiring your immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingActions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No pending actions</p>
                  ) : (
                    pendingActions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-sm">Review Registration</p>
                          <p className="text-xs text-muted-foreground">{action.events?.title || 'Event'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pending</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* System Activity */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>System Activity</CardTitle>
                  </div>
                  <CardDescription>Recent infrastructure and system events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500 to-purple-700 text-white border-none">
                  <CardContent className="pt-6">
                    <UserCog className="h-8 w-8 mb-3" />
                    <h4 className="font-semibold mb-1">Manage Users</h4>
                    <p className="text-sm text-purple-100">Add, edit, or remove system users</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Calendar className="h-8 w-8 mb-3 text-primary" />
                    <h4 className="font-semibold mb-1">Event Oversight</h4>
                    <p className="text-sm text-muted-foreground">Monitor and manage all events</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
                    <p className="text-sm text-muted-foreground">Analytics and performance insights</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Database & Security Overview */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>Database Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection Status</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm text-muted-foreground">2.5 GB / 10 GB</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <CardTitle>Security Overview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security Score</span>
                    <Badge className="bg-green-500">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failed Login Attempts</span>
                    <span className="text-sm text-muted-foreground">3 (24h)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Sessions</span>
                    <span className="text-sm text-muted-foreground">24</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'events':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Create, edit, and assign events to chapter admins</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsManagement />
            </CardContent>
          </Card>
        );
      
      case 'registrations':
        return (
          <Card>
            <CardHeader>
              <CardTitle>All Registrations</CardTitle>
              <CardDescription>Complete registration database across all chapters</CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrationsTable />
            </CardContent>
          </Card>
        );
      
      case 'chapter_admins':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Chapter Admin Management</CardTitle>
              <CardDescription>Manage chapter-specific event administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <ChapterAdminManagement />
            </CardContent>
          </Card>
        );
      
      case 'super_admins':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Super Admin Management</CardTitle>
              <CardDescription>Manage system-wide administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <SuperAdminManagement />
            </CardContent>
          </Card>
        );
      
      case 'role_management':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Assign and modify user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersManagement />
            </CardContent>
          </Card>
        );
      
      case 'audit_logs':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Complete system activity and admin action tracker</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogs />
            </CardContent>
          </Card>
        );
      
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Reports & CSV Exports</h2>
              <p className="text-muted-foreground">Generate and download registration reports</p>
            </div>
            <ReportsExport />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-secondary/5">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">ELITE MASTER</h1>
                <p className="text-xs opacity-90">IEEE Day 2025</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-primary-foreground hover:bg-primary-glow lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
