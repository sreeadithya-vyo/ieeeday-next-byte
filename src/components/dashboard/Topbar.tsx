import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Topbar = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#00629B]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-[#D11A2A] rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <Avatar>
            <AvatarFallback className="bg-[#00629B] text-white">
              {user ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
