import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";
import AuditLogs from "@/components/admin/AuditLogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EliteAuditLogs() {
  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track all system activities and admin actions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Audit Trail</CardTitle>
              <CardDescription>
                View detailed logs of all administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogs />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
