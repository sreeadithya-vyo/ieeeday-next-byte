import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, FileText, Users, Shield, ScrollText, BarChart3, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[];
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { icon: Home, label: 'Dashboard', path: `/dashboard/${user?.role?.replace('_admin', '').replace('_master', '')}` },
    ];

    if (user?.role === 'elite_master') {
      return [
        ...baseItems,
        { icon: Calendar, label: 'Events', path: '/dashboard/elite/events' },
        { icon: FileText, label: 'Registrations', path: '/dashboard/elite/registrations' },
        { icon: Users, label: 'Chapter Admins', path: '/dashboard/elite/chapter-admins' },
        { icon: Shield, label: 'Super Admins', path: '/dashboard/elite/super-admins' },
        { icon: UserCog, label: 'Role Management', path: '/dashboard/elite/roles' },
        { icon: ScrollText, label: 'Audit Logs', path: '/dashboard/elite/audit' },
        { icon: BarChart3, label: 'Reports', path: '/dashboard/elite/reports' },
      ];
    }

    if (user?.role === 'super_admin') {
      return [
        ...baseItems,
        { icon: Calendar, label: 'Events', path: '/dashboard/super/events' },
        { icon: FileText, label: 'Registrations', path: '/dashboard/super/registrations' },
        { icon: Users, label: 'Chapter Admins', path: '/dashboard/super/admins' },
        { icon: BarChart3, label: 'Reports', path: '/dashboard/super/reports' },
      ];
    }

    // Chapter admin menu
    return [
      ...baseItems,
      { icon: Calendar, label: 'My Events', path: `${location.pathname.split('/').slice(0, 3).join('/')}/events` },
      { icon: Users, label: 'Participants', path: `${location.pathname.split('/').slice(0, 3).join('/')}/participants` },
      { icon: BarChart3, label: 'Exports', path: `${location.pathname.split('/').slice(0, 3).join('/')}/exports` },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-screen w-64 bg-[#00629B] text-white fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-2xl font-bold">IEEE DAY</h1>
        <p className="text-sm opacity-90 mt-1">{user?.name}</p>
        <p className="text-xs opacity-75">{user?.role?.replace('_', ' ').toUpperCase()}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                isActive 
                  ? "bg-white text-[#00629B] font-medium shadow-lg" 
                  : "hover:bg-white/10"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
