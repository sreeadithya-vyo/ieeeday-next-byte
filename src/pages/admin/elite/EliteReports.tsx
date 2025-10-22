import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";
import ReportsExport from "@/components/admin/elite/ReportsExport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EliteReports() {
  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
            <p className="text-muted-foreground">
              Generate and download data reports in CSV format
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Export Center</CardTitle>
              <CardDescription>
                Export registration data filtered by chapter, event, or status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsExport />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
