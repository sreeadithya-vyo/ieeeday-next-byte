import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";
import RegistrationsTable from "@/components/admin/RegistrationsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EliteRegistrations() {
  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
            <p className="text-muted-foreground">
              All participant registrations across events
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Registrations</CardTitle>
              <CardDescription>
                View and manage participant registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrationsTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
