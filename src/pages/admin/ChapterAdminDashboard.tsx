import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, AlertCircle } from "lucide-react";
import { useRole } from "@/hooks/useRole";

export default function ChapterAdminDashboard() {
  const { chapter } = useRole();

  const stats = [
    {
      title: "Total Events",
      value: "6",
      icon: Calendar,
      description: "Your chapter events",
    },
    {
      title: "Pending Payments",
      value: "12",
      icon: AlertCircle,
      description: "Awaiting verification",
    },
    {
      title: "Confirmed Participants",
      value: "65",
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Rejected",
      value: "2",
      icon: FileText,
      description: "Declined registrations",
    },
  ];

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
