import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    setLogs(data as any || []);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Resource ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{log.profiles.name}</div>
                  <div className="text-sm text-muted-foreground">{log.profiles.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge>{log.action}</Badge>
              </TableCell>
              <TableCell>{log.resource_type}</TableCell>
              <TableCell className="font-mono text-sm">{log.resource_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
