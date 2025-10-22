import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth", { replace: true });
      } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        navigate("/", { replace: true });
      }
    }
  }, [user, userRole, loading, navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (allowedRoles && userRole && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
