import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState([
    {
      title: "Total Events",
      value: "0",
      icon: Calendar,
      description: "Across all chapters",
    },
    {
      title: "Total Registrations",
      value: "0",
      icon: Users,
      description: "Active participants",
    },
    {
      title: "Pending Payments",
      value: "0",
      icon: FileText,
      description: "Awaiting verification",
    },
    {
      title: "Revenue",
      value: "₹0",
      icon: DollarSign,
      description: "Total collected",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total events
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Fetch total registrations
      const { count: registrationsCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

      // Fetch pending payments
      const { count: pendingCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'pending');

      // Fetch revenue (count verified payments)
      const { count: verifiedCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'verified');

      setStats([
        {
          title: "Total Events",
          value: String(eventsCount || 0),
          icon: Calendar,
          description: "Across all chapters",
        },
        {
          title: "Total Registrations",
          value: String(registrationsCount || 0),
          icon: Users,
          description: "Active participants",
        },
        {
          title: "Pending Payments",
          value: String(pendingCount || 0),
          icon: FileText,
          description: "Awaiting verification",
        },
        {
          title: "Revenue",
          value: `₹${(verifiedCount || 0) * 100}`,
          icon: DollarSign,
          description: "Total collected",
        },
      ]);
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
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage events and registrations across all chapters</p>
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Super admin features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
