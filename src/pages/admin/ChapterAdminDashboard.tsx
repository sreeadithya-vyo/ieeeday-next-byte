import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ChapterAdminDashboard() {
  const { chapter } = useRole();
  const [stats, setStats] = useState([
    {
      title: "Total Events",
      value: "0",
      icon: Calendar,
      description: "Your chapter events",
    },
    {
      title: "Pending Payments",
      value: "0",
      icon: AlertCircle,
      description: "Awaiting verification",
    },
    {
      title: "Confirmed Participants",
      value: "0",
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Rejected",
      value: "0",
      icon: FileText,
      description: "Declined registrations",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chapter) {
      fetchStats();
    }
  }, [chapter]);

  const fetchStats = async () => {
    try {
      // Get chapter ID
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();

      if (!chapterData) {
        setLoading(false);
        return;
      }

      // Fetch total events for this chapter
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('chapter_id', chapterData.id);

      // Get event IDs for this chapter
      const { data: chapterEvents } = await supabase
        .from('events')
        .select('id')
        .eq('chapter_id', chapterData.id);

      const eventIds = chapterEvents?.map(e => e.id) || [];

      if (eventIds.length > 0) {
        // Fetch pending payments
        const { count: pendingCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .in('event_id', eventIds)
          .eq('payment_status', 'pending');

        // Fetch confirmed participants
        const { count: confirmedCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .in('event_id', eventIds)
          .eq('status', 'approved');

        // Fetch rejected registrations
        const { count: rejectedCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .in('event_id', eventIds)
          .eq('status', 'rejected');

        setStats([
          {
            title: "Total Events",
            value: String(eventsCount || 0),
            icon: Calendar,
            description: "Your chapter events",
          },
          {
            title: "Pending Payments",
            value: String(pendingCount || 0),
            icon: AlertCircle,
            description: "Awaiting verification",
          },
          {
            title: "Confirmed Participants",
            value: String(confirmedCount || 0),
            icon: Users,
            description: "Registered users",
          },
          {
            title: "Rejected",
            value: String(rejectedCount || 0),
            icon: FileText,
            description: "Declined registrations",
          },
        ]);
      } else {
        setStats([
          {
            title: "Total Events",
            value: "0",
            icon: Calendar,
            description: "Your chapter events",
          },
          {
            title: "Pending Payments",
            value: "0",
            icon: AlertCircle,
            description: "Awaiting verification",
          },
          {
            title: "Confirmed Participants",
            value: "0",
            icon: Users,
            description: "Registered users",
          },
          {
            title: "Rejected",
            value: "0",
            icon: FileText,
            description: "Declined registrations",
          },
        ]);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{chapter} Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your chapter events and participants</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Event management features coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Participant management features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
