
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

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
  const { isAuthenticated, adminUser, loading, error } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute check:', { isAuthenticated, adminUser: adminUser?.role, loading, error });
      
      if (error) {
        console.error('Auth error in ProtectedRoute:', error);
        navigate('/admin/login');
        return;
      }
      
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
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
          console.log('Insufficient role level, redirecting to unauthorized');
          navigate('/admin/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, adminUser, loading, error, navigate, requiredRole, redirectTo]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Authentication Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminErrorBoundary>
      {children}
    </AdminErrorBoundary>
  );
};

export default ProtectedRoute;
