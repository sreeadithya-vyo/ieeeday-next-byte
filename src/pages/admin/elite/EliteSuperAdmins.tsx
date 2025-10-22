import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";
import SuperAdminManagement from "@/components/admin/elite/SuperAdminManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EliteSuperAdmins() {
  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Super Admins</h1>
            <p className="text-muted-foreground">
              Manage super administrator accounts
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Super Admin Management</CardTitle>
              <CardDescription>
                Create and manage super admin accounts with elevated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuperAdminManagement />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
