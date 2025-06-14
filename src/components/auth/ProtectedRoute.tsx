
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'moderator';
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'admin', 
  redirectTo = '/admin/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, adminUser, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate(redirectTo);
        return;
      }

      // Check role permissions
      if (adminUser && requiredRole) {
        const roleHierarchy = {
          'moderator': 1,
          'admin': 2,
          'super_admin': 3
        };

        const userRoleLevel = roleHierarchy[adminUser.role];
        const requiredRoleLevel = roleHierarchy[requiredRole];

        if (userRoleLevel < requiredRoleLevel) {
          navigate('/admin/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, adminUser, loading, navigate, requiredRole, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
