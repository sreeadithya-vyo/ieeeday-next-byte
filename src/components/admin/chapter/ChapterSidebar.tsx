import { LayoutDashboard, Calendar, Users, FileDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChapterSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  chapter: string;
}

export default function ChapterSidebar({ activeTab, onTabChange, onSignOut, chapter }: ChapterSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'exports', label: 'Exports', icon: FileDown },
  ];

  return (
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
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
