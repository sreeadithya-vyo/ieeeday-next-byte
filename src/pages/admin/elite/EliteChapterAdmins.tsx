import EliteSidebar from "@/components/admin/elite/EliteSidebar";
import EliteTopNav from "@/components/admin/elite/EliteTopNav";
import ChapterAdminManagement from "@/components/admin/elite/ChapterAdminManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EliteChapterAdmins() {
  return (
    <div className="min-h-screen bg-background">
      <EliteSidebar />
      
      <div className="ml-64">
        <EliteTopNav />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chapter Admins</h1>
            <p className="text-muted-foreground">
              Manage chapter administrator accounts and permissions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chapter Admin Management</CardTitle>
              <CardDescription>
                Create, assign, and manage chapter administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChapterAdminManagement />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
