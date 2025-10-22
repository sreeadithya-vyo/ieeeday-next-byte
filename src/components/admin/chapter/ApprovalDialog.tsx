import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  participantName: string;
  action: 'verify' | 'reject';
  onSuccess: () => void;
}

export default function ApprovalDialog({
  open,
  onOpenChange,
  registrationId,
  participantName,
  action,
  onSuccess,
}: ApprovalDialogProps) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.functions.invoke('approve-registration', {
      body: { 
        registration_id: registrationId, 
        action,
        note: action === 'reject' ? note : undefined
      },
    });

    if (error) {
      toast.error(`Failed to ${action} registration`);
    } else {
      toast.success(
        action === 'verify' 
          ? `Registration approved! Email sent to ${participantName}` 
          : `Registration rejected. Email sent to ${participantName}`
      );
      onSuccess();
      onOpenChange(false);
      setNote('');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'verify' ? 'Approve Registration' : 'Reject Registration'}
          </DialogTitle>
          <DialogDescription>
            {action === 'verify'
              ? `Are you sure you want to approve ${participantName}'s registration? They will receive a confirmation email.`
              : `Please provide a reason for rejecting ${participantName}'s registration. They will receive this in an email.`}
          </DialogDescription>
        </DialogHeader>

        {action === 'reject' && (
          <div className="space-y-2">
            <Label htmlFor="note">Rejection Reason *</Label>
            <Textarea
              id="note"
              placeholder="Please provide a clear reason for rejection..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              required
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={action === 'verify' ? 'default' : 'destructive'}
            onClick={handleSubmit}
            disabled={loading || (action === 'reject' && !note.trim())}
          >
            {loading ? 'Processing...' : action === 'verify' ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
