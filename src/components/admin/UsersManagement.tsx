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
import { Plus, UserCog } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';

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
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState('event_admin');
  const [selectedChapter, setSelectedChapter] = useState('APS');
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

  const handleAssignRole = async () => {
    if (!selectedUser) return;

    try {
      const roleData: any = {
        user_id: selectedUser.id,
        role: selectedRole,
        created_by: currentUser?.id,
      };

      if (selectedRole === 'event_admin') {
        roleData.chapter = selectedChapter;
      }

      const { error } = await supabase.from('user_roles').insert(roleData);

      if (error) throw error;

      toast.success('Role assigned successfully');
      setRoleDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign role');
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole('event_admin');
    setSelectedChapter('APS');
    setRoleDialogOpen(true);
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
            <DialogContent className="bg-background">
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
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
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
                      <SelectTrigger className="bg-background">
                        <SelectValue />
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
                )}
                <Button onClick={handleCreateUser} className="w-full">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Role Assignment Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assign-role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="assign-role" className="bg-background">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {roleOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedRole === 'event_admin' && (
              <div>
                <Label htmlFor="assign-chapter">Chapter</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger id="assign-chapter" className="bg-background">
                    <SelectValue placeholder="Select a chapter" />
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
            )}
            
            <Button onClick={handleAssignRole} className="w-full">
              Assign Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {user.roles?.length > 0 ? (
                      user.roles.map((r, i) => (
                        <Badge key={i} variant="outline">
                          {r.role.replace('_', ' ')} {r.chapter && `(${r.chapter})`}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">No roles assigned</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openRoleDialog(user)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Assign Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
