import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Building2,
  AlertCircle
} from 'lucide-react';

interface Stats {
  totalChapters: number;
  totalEvents: number;
  totalRegistrations: number;
  pendingApprovals: number;
  confirmedRegistrations: number;
  rejectedRegistrations: number;
  totalPaymentCollected: number;
}

export default function EliteStatCards() {
  const [stats, setStats] = useState<Stats>({
    totalChapters: 5, // APS, SPS, PROCOM, CS, PES
    totalEvents: 0,
    totalRegistrations: 0,
    pendingApprovals: 0,
    confirmedRegistrations: 0,
    rejectedRegistrations: 0,
    totalPaymentCollected: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: registrations } = await supabase
      .from('registrations')
      .select('*');

    const { data: events } = await supabase
      .from('events')
      .select('id');

    setStats({
      totalChapters: 5,
      totalEvents: events?.length || 0,
      totalRegistrations: registrations?.length || 0,
      pendingApprovals: registrations?.filter(r => r.status === 'submitted').length || 0,
      confirmedRegistrations: registrations?.filter(r => r.status === 'confirmed').length || 0,
      rejectedRegistrations: registrations?.filter(r => r.status === 'rejected').length || 0,
      totalPaymentCollected: registrations
        ?.filter(r => r.payment_status === 'verified')
        .length || 0, // In real scenario, sum up actual payment amounts
    });
  };

  const statCards = [
    {
      title: 'Total Chapters',
      value: stats.totalChapters,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedRegistrations,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected',
      value: stats.rejectedRegistrations,
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Payment Verified',
      value: stats.totalPaymentCollected,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Payment Pending',
      value: stats.totalRegistrations - stats.totalPaymentCollected,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}