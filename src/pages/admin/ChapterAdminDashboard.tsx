import { useState } from "react";
import { LayoutDashboard, Calendar, FileText, CreditCard, FileBarChart, Shield } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChapterEvents from "./chapter/ChapterEvents";
import ChapterRegistrations from "./chapter/ChapterRegistrations";
import ChapterPayments from "./chapter/ChapterPayments";
import ChapterAuditLog from "./chapter/ChapterAuditLog";
import ChapterReports from "./chapter/ChapterReports";
import ChapterDashboardStats from "@/components/admin/chapter/ChapterDashboardStats";

export default function ChapterAdminDashboard() {
  const { chapter } = useRole();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'registrations', label: 'Registrations', icon: FileText },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'audit', label: 'Audit Log', icon: Shield },
    { id: 'reports', label: 'Reports & Exports', icon: FileBarChart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{chapter} Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your chapter events and participants</p>
            </div>
            <ChapterDashboardStats chapter={chapter || ''} />
          </div>
        );
      case 'events':
        return <ChapterEvents />;
      case 'registrations':
        return <ChapterRegistrations />;
      case 'payments':
        return <ChapterPayments />;
      case 'audit':
        return <ChapterAuditLog />;
      case 'reports':
        return <ChapterReports />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r min-h-screen flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-primary">{chapter} Chapter</h2>
          <p className="text-xs text-muted-foreground">Event Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                activeTab === item.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
}
