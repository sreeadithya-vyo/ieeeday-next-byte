import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCog, UserX, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ChapterAdmin {
  id: string;
  user_id: string;
  chapter: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export default function ChapterAdminManagement() {
  const [admins, setAdmins] = useState<ChapterAdmin[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminChapter, setNewAdminChapter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChapterAdmins();
  }, []);

  const fetchChapterAdmins = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        chapter,
        role
      `)
      .eq('role', 'event_admin');

    if (!error && data) {
      // Fetch profile data separately
      const adminsWithProfiles = await Promise.all(
        data.map(async (admin) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', admin.user_id)
            .single();
          
          return {
            ...admin,
            profiles: profile || { name: 'N/A', email: 'N/A' }
          };
        })
      );
      setAdmins(adminsWithProfiles as ChapterAdmin[]);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminChapter) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    // Find user by email
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', newAdminEmail)
      .single();

    if (profileError || !profiles) {
      toast.error('User not found. They must sign up first.');
      setLoading(false);
      return;
    }

    // Assign role
    const { error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: profiles.id,
        role: 'event_admin',
        chapter: newAdminChapter as any,
      }]);

    if (error) {
      toast.error('Failed to create chapter admin');
    } else {
      toast.success('Chapter admin created successfully');
      setCreateDialogOpen(false);
      setNewAdminEmail('');
      setNewAdminChapter('');
      fetchChapterAdmins();
    }
    setLoading(false);
  };

  const handleDeactivate = async (roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      toast.error('Failed to deactivate admin');
    } else {
      toast.success('Admin deactivated successfully');
      fetchChapterAdmins();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Chapter Admin
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No chapter admins found
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.profiles?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{admin.profiles?.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge>{admin.chapter}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeactivate(admin.id)}
                      >
                        <UserX className="h-3 w-3 mr-1" />
                        Deactivate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Chapter Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User Email</Label>
              <Input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label>Chapter</Label>
              <Select value={newAdminChapter} onValueChange={setNewAdminChapter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="APS">APS</SelectItem>
                  <SelectItem value="SPS">SPS</SelectItem>
                  <SelectItem value="PROCOM">PROCOM</SelectItem>
                  <SelectItem value="CS">CS</SelectItem>
                  <SelectItem value="PES">PES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin} disabled={loading}>
                Create Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}