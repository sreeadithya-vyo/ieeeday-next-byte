import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface PendingApprovalsProps {
  chapter: string | null;
}

export default function PendingApprovals({ chapter }: PendingApprovalsProps) {
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    if (chapter) {
      fetchApprovals();
    }
  }, [chapter]);

  const fetchApprovals = async () => {
    if (!chapter) return;

    const { data: chapterData } = await supabase
      .from('chapters')
      .select('id')
      .eq('code', chapter)
      .single();

    if (!chapterData) return;

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('chapter_id', chapterData.id);

    const eventIds = events?.map(e => e.id) || [];

    const { data } = await supabase
      .from('registrations')
      .select('*, events(title)')
      .in('event_id', eventIds)
      .eq('status', 'submitted')
      .order('created_at', { ascending: false })
      .limit(5);

    setApprovals(data || []);
  };

  const getApprovalType = (idx: number) => {
    return idx % 2 === 0 ? 'Registration' : 'Payment';
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          <CardTitle>Pending Approvals</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Review and approve pending registrations and payments</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {approvals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
        ) : (
          approvals.map((approval, idx) => (
            <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{approval.participant_name}</p>
                  <Badge variant="outline" className="text-xs">{getApprovalType(idx)}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{approval.events?.title || 'Event'}</span>
                  <span>{getTimeAgo(approval.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="h-8">
                  Approve
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  Review
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
