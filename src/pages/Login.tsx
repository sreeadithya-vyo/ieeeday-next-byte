import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getRoleRoute = (role: string): string => {
    const routes: Record<string, string> = {
      elite_master: '/dashboard/elite',
      super_admin: '/dashboard/super',
      aps_admin: '/dashboard/aps',
      cs_admin: '/dashboard/cs',
      pes_admin: '/dashboard/pes',
      procomm_admin: '/dashboard/procomm',
      sps_admin: '/dashboard/sps',
      participant: '/user/home',
    };
    return routes[role] || '/';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    const success = login(email, password, rememberMe);
    
    if (success) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      toast({
        title: "Success",
        description: `Welcome back, ${user.name}!`,
      });
      navigate(getRoleRoute(user.role));
    } else {
      toast({
        title: "Error",
        description: "Incorrect credentials or inactive account",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00629B] to-[#004870] items-center justify-center p-12">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">IEEE DAY 2025</h1>
          <p className="text-xl opacity-90">Admin Portal</p>
          <div className="mt-8 text-6xl">🎓</div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Login to IEEE DAY 2025 Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your.email@ieee.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-[#00629B] hover:underline" disabled>
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="w-full bg-[#00629B] hover:bg-[#004870]">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#00629B] font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Demo Credentials:</p>
            <p className="text-xs">Elite: elite@ieee.org / elite123</p>
            <p className="text-xs">Super: super@ieee.org / super123</p>
            <p className="text-xs">APS: aps@ieee.org / aps123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
