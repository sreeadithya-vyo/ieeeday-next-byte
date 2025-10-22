import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useRole } from '@/hooks/useRole';

interface User {
  id: string;
  name: string;
  email: string;
  roles: Array<{ role: string; chapter: string | null }>;
}

interface Props {
  restrictToEventAdmins?: boolean;
}

export default function UsersManagement({ restrictToEventAdmins }: Props) {
  const { isEliteMaster } = useRole();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'event_admin',
    chapter: 'APS',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, user_roles(role, chapter)');

    setUsers(data?.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      roles: u.user_roles as any,
    })) || []);
  };

  const handleCreateUser = async () => {
    // In a real application, you would create the user via an admin edge function
    // For now, we'll just show a message
    toast.info('User creation requires admin edge function. Please set up authentication flow.');
    setOpen(false);
  };

  const roleOptions = restrictToEventAdmins
    ? [{ value: 'event_admin', label: 'Event Admin' }]
    : [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'event_admin', label: 'Event Admin' },
        { value: 'viewer', label: 'Viewer' },
      ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {(isEliteMaster || !restrictToEventAdmins) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new admin user to the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === 'event_admin' && (
                  <div>
                    <Label htmlFor="chapter">Chapter</Label>
                    <Select value={newUser.chapter} onValueChange={(value) => setNewUser({ ...newUser, chapter: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APS">APS</SelectItem>
                        <SelectItem value="SPS">SPS</SelectItem>
                        <SelectItem value="PROCOM">PROCOM</SelectItem>
                        <SelectItem value="CS">CS</SelectItem>
                        <SelectItem value="PES">PES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleCreateUser} className="w-full">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.roles?.map((r, i) => (
                      <Badge key={i} variant="outline">
                        {r.role} {r.chapter && `(${r.chapter})`}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
