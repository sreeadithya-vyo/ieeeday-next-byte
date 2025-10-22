import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'elite_master' | 'super_admin' | 'event_admin'>('event_admin');
  const [selectedChapter, setSelectedChapter] = useState<'APS' | 'CS' | 'PES' | 'PROCOM' | 'SPS'>('APS');

  // Redirect if already logged in based on role
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (data?.role === 'elite_master') {
          navigate('/admin/elite');
        } else if (data?.role === 'super_admin') {
          navigate('/admin/super');
        } else if (data?.role === 'event_admin') {
          navigate('/admin/chapter');
        } else {
          navigate('/');
        }
      }
    };
    
    checkRoleAndRedirect();
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast.error(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      toast.success('Successfully signed in!');
      
      // Get user session to fetch role
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        // Redirect based on role
        if (data?.role === 'elite_master') {
          navigate('/admin/elite');
        } else if (data?.role === 'super_admin') {
          navigate('/admin/super');
        } else if (data?.role === 'event_admin') {
          navigate('/admin/chapter');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
      
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!signupName || !signupEmail || !signupPassword) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error, user } = await signUp(signupEmail, signupPassword, signupName);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered');
      } else {
        toast.error(error.message || 'Failed to sign up');
      }
    } else if (user) {
      // Assign the selected role immediately
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: selectedRole,
          chapter: selectedRole === 'event_admin' ? selectedChapter : null
        });

      if (roleError) {
        console.error('Error assigning role:', roleError);
        toast.error('Account created but role assignment failed. Please contact admin.');
      } else {
        toast.success('Account created with ' + (selectedRole === 'elite_master' ? 'Elite Admin' : selectedRole === 'super_admin' ? 'Super Admin' : selectedChapter + ' Admin') + ' role!');
      }
      
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>IEEE Day 2025</CardTitle>
          <CardDescription>Sign in or create an account to register for events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="select-role">Select Your Admin Role</Label>
                  <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                    <SelectTrigger id="select-role" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="elite_master">Elite Admin (Full Access)</SelectItem>
                      <SelectItem value="super_admin">Super Admin (Global Admin)</SelectItem>
                      <SelectItem value="event_admin">Chapter Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === 'event_admin' && (
                  <div className="space-y-2">
                    <Label htmlFor="select-chapter">Select Your Chapter</Label>
                    <Select value={selectedChapter} onValueChange={(value: any) => setSelectedChapter(value)}>
                      <SelectTrigger id="select-chapter" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="APS">AP-S Chapter</SelectItem>
                        <SelectItem value="CS">CS Chapter</SelectItem>
                        <SelectItem value="PES">PES Chapter</SelectItem>
                        <SelectItem value="PROCOM">PROCOM Chapter</SelectItem>
                        <SelectItem value="SPS">SP-S Chapter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
