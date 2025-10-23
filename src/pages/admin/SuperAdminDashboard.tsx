import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, DollarSign } from "lucide-react";

export default function SuperAdminDashboard() {
  const stats = [
    {
      title: "Total Events",
      value: "12",
      icon: Calendar,
      description: "Across all chapters",
    },
    {
      title: "Total Registrations",
      value: "230",
      icon: Users,
      description: "Active participants",
    },
    {
      title: "Pending Payments",
      value: "8",
      icon: FileText,
      description: "Awaiting verification",
    },
    {
      title: "Revenue",
      value: "₹25,000",
      icon: DollarSign,
      description: "Total collected",
    },
  ];

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
