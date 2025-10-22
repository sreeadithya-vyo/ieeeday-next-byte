import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, UserX, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SuperAdmin {
  id: string;
  user_id: string;
  role: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export default function SuperAdminManagement() {
  const [admins, setAdmins] = useState<SuperAdmin[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const fetchSuperAdmins = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        role
      `)
      .eq('role', 'super_admin');

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
      setAdmins(adminsWithProfiles as SuperAdmin[]);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail) {
      toast.error('Please enter an email');
      return;
    }

    setLoading(true);

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

    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: profiles.id,
        role: 'super_admin',
      });

    if (error) {
      toast.error('Failed to create super admin');
    } else {
      toast.success('Super admin created successfully');
      setCreateDialogOpen(false);
      setNewAdminEmail('');
      fetchSuperAdmins();
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
      fetchSuperAdmins();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Super Admin
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No super admins found
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
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Super Admin
                      </Badge>
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
            <DialogTitle>Create Super Admin</DialogTitle>
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
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin} disabled={loading}>
                Create Super Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}