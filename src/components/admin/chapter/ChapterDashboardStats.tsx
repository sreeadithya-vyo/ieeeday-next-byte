import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChapterDashboardStatsProps {
  chapter: string;
}

export default function ChapterDashboardStats({ chapter }: ChapterDashboardStatsProps) {
  const [stats, setStats] = useState({
    chapterEvents: 0,
    pendingPayments: 0,
    confirmedRegistrations: 0,
    rejectedRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chapter) {
      fetchStats();
    }
  }, [chapter]);

  const fetchStats = async () => {
    try {
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();

      if (!chapterData) {
        setLoading(false);
        return;
      }

      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('chapter_id', chapterData.id);

      const { data: chapterEvents } = await supabase
        .from('events')
        .select('id')
        .eq('chapter_id', chapterData.id);

      const eventIds = chapterEvents?.map(e => e.id) || [];

      if (eventIds.length > 0) {
        const { count: pendingCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .in('event_id', eventIds)
          .eq('payment_status', 'pending');

        const { count: confirmedCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .in('event_id', eventIds)
          .eq('status', 'approved');

        const { count: rejectedCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .in('event_id', eventIds)
          .eq('status', 'rejected');

        setStats({
          chapterEvents: eventsCount || 0,
          pendingPayments: pendingCount || 0,
          confirmedRegistrations: confirmedCount || 0,
          rejectedRegistrations: rejectedCount || 0,
        });
      } else {
        setStats({
          chapterEvents: 0,
          pendingPayments: 0,
          confirmedRegistrations: 0,
          rejectedRegistrations: 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Chapter Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.chapterEvents}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingPayments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed Participants</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.confirmedRegistrations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected Registrations</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rejectedRegistrations}</div>
        </CardContent>
      </Card>
    </div>
  );
}
