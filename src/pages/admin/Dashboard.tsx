import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import EliteMasterDashboard from '@/components/admin/EliteMasterDashboard';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
import ChapterAdminDashboard from '@/components/admin/ChapterAdminDashboard';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { isEliteMaster, isSuperAdmin, isEventAdmin, loading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isEliteMaster && !isSuperAdmin && !isEventAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this dashboard.</p>
        </div>
      </div>
    );
  }

  if (isEliteMaster) {
    return <EliteMasterDashboard />;
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (isEventAdmin) {
    return <ChapterAdminDashboard />;
  }

  return null;
}
