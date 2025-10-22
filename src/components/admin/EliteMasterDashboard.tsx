import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
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

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gradient">Global Overview</h2>
              <p className="text-muted-foreground">IEEE Day 2025 - System-wide Statistics</p>
            </div>
            <EliteStatCards />
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">⚡ Approval Queue</CardTitle>
                <CardDescription>Pending registrations requiring verification</CardDescription>
              </CardHeader>
              <CardContent>
                <ApprovalQueue />
              </CardContent>
            </Card>
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
