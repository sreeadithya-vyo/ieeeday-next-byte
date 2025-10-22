import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'elite_master' | 'super_admin' | 'event_admin' | 'viewer' | 'user';
export type Chapter = 'APS' | 'SPS' | 'PROCOM' | 'CS' | 'PES';

interface UserRole {
  role: AppRole;
  chapter: Chapter | null;
}

export function useRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, chapter')
        .eq('user_id', user.id);

      if (!error && data) {
        setRoles(data as UserRole[]);
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const hasRole = (role: AppRole) => {
    return roles.some(r => r.role === role);
  };

  const isEliteMaster = hasRole('elite_master');
  const isSuperAdmin = hasRole('super_admin');
  const isEventAdmin = hasRole('event_admin');
  const isViewer = hasRole('viewer');
  const isAdmin = isEliteMaster || isSuperAdmin || isEventAdmin;

  const getChapter = () => {
    const eventAdminRole = roles.find(r => r.role === 'event_admin');
    return eventAdminRole?.chapter || null;
  };

  return {
    roles,
    loading,
    hasRole,
    isEliteMaster,
    isSuperAdmin,
    isEventAdmin,
    isViewer,
    isAdmin,
    chapter: getChapter(),
  };
}
