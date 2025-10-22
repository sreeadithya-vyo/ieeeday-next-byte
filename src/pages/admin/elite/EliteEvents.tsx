import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";
import EventsManagement from "@/components/admin/EventsManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EliteEvents() {
  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
            <p className="text-muted-foreground">
              Manage all events across chapters
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>
                View, create, edit, and assign events to chapter admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsManagement />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
