import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import ChapterSidebar from './chapter/ChapterSidebar';
import ChapterStatsCards from './chapter/ChapterStatsCards';
import MyEvents from './chapter/MyEvents';
import ParticipantsTable from './chapter/ParticipantsTable';
import ExportsSection from './chapter/ExportsSection';

export default function ChapterAdminDashboard() {
  const { signOut } = useAuth();
  const { chapter } = useRole();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string | null>(null);
  const [stats, setStats] = useState({
    chapterEvents: 0,
    pendingPayments: 0,
    confirmedRegistrations: 0,
    rejectedRegistrations: 0,
  });

  useEffect(() => {
    if (chapter) {
      fetchChapterStats();
    }
  }, [chapter]);

  const fetchChapterStats = async () => {
    if (!chapter) return;

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('chapter', chapter);

    const eventIds = events?.map(e => e.id) || [];

    const { data: registrations } = await supabase
      .from('registrations')
      .select('*')
      .in('event_id', eventIds);

    setStats({
      chapterEvents: events?.length || 0,
      pendingPayments: registrations?.filter(r => r.payment_status === 'pending').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      rejectedRegistrations: registrations?.filter(r => r.status === 'rejected').length || 0,
    });
  };

  const handleViewRegistrations = (eventId: string) => {
    setSelectedEventFilter(eventId);
    setActiveTab('participants');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{chapter} Chapter Dashboard</h1>
              <p className="text-muted-foreground">Manage your chapter's events and registrations</p>
            </div>
            <ChapterStatsCards stats={stats} />
          </div>
        );
      
      case 'events':
        return <MyEvents chapter={chapter} onViewRegistrations={handleViewRegistrations} />;
      
      case 'participants':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Registration Approvals</h2>
            <ParticipantsTable chapter={chapter} eventFilter={selectedEventFilter} />
          </div>
        );
      
      case 'exports':
        return <ExportsSection chapter={chapter} />;
      
      default:
        return null;
    }
  };

  if (!chapter) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ChapterSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={signOut}
        chapter={chapter}
      />
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
}
