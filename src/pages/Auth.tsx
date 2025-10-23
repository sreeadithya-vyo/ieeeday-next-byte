import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>IEEE Day 2025</CardTitle>
          <CardDescription>Sign in to access admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
