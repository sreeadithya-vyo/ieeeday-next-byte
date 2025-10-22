import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Building 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalChapters: number;
  totalEvents: number;
  totalRegistrations: number;
  pendingApprovals: number;
  confirmedRegistrations: number;
  rejectedRegistrations: number;
  totalPaymentAmount: number;
}

export default function EliteKPICards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [chaptersRes, eventsRes, registrationsRes] = await Promise.all([
        supabase.from("chapters").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("registrations").select("status, payment_status"),
      ]);

      const registrations = registrationsRes.data || [];
      const pending = registrations.filter(r => r.status === "submitted").length;
      const confirmed = registrations.filter(r => r.status === "confirmed").length;
      const rejected = registrations.filter(r => r.status === "rejected").length;

      // Calculate total payment amount from confirmed registrations
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "verified");

      const totalAmount = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalChapters: chaptersRes.count || 0,
        totalEvents: eventsRes.count || 0,
        totalRegistrations: registrations.length,
        pendingApprovals: pending,
        confirmedRegistrations: confirmed,
        rejectedRegistrations: rejected,
        totalPaymentAmount: totalAmount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Chapters",
      value: stats?.totalChapters || 0,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Total Registrations",
      value: stats?.totalRegistrations || 0,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Confirmed Registrations",
      value: stats?.confirmedRegistrations || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Rejected Registrations",
      value: stats?.rejectedRegistrations || 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Total Payment Amount",
      value: `₹${stats?.totalPaymentAmount.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-950",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(7)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
