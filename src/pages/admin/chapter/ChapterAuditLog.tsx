import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  actor_id: string;
  created_at: string;
  metadata: any;
  profiles: {
    name: string;
    email: string;
  };
}

export default function ChapterAuditLog() {
  const { chapter } = useRole();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chapter) {
      fetchAuditLogs();
    }
  }, [chapter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('id')
        .eq('code', chapter)
        .single();

      if (!chapterData) return;

      const { data: eventsData } = await supabase
        .from('events')
        .select('id')
        .eq('chapter_id', chapterData.id);

      const eventIds = eventsData?.map(e => e.id) || [];

      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:actor_id (name, email)
        `)
        .eq('resource_type', 'event')
        .in('resource_id', eventIds.map(id => id.toString()))
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast.error('Failed to load audit logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      create: "default",
      update: "secondary",
      delete: "destructive",
    };
    return <Badge variant={variants[action.toLowerCase()] || "secondary"}>{action}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <p className="text-muted-foreground">Track all activities for {chapter} events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No audit logs found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource Type</TableHead>
                  <TableHead>Resource ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.created_at), 'PPpp')}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.profiles?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{log.profiles?.email || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>{log.resource_type}</TableCell>
                    <TableCell className="font-mono text-sm">{log.resource_id?.substring(0, 8)}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
