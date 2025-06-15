
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface RouteValidatorProps {
  children: React.ReactNode;
}

const RouteValidator = ({ children }: RouteValidatorProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Validate route patterns
    const path = location.pathname;
    
    // Check for invalid characters or patterns
    if (path.includes('..') || path.includes('%') || path.includes('<') || path.includes('>')) {
      console.error('Invalid route pattern detected:', path);
      navigate('/404', { replace: true });
      return;
    }

    // Validate college slug format
    const collegeMatch = path.match(/^\/college\/([^\/]+)$/);
    if (collegeMatch) {
      const slug = collegeMatch[1];
      if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 100) {
        console.error('Invalid college slug format:', slug);
        navigate('/404', { replace: true });
        return;
      }
    }

    // Fix: Updated admin routes validation to allow /admin and /admin/dashboard
    if (path.startsWith('/admin')) {
      const validAdminRoutes = [
        '/admin',
        '/admin/login',
        '/admin/unauthorized',
        '/admin/dashboard'
      ];
      
      if (!validAdminRoutes.includes(path)) {
        console.error('Invalid admin route:', path);
        navigate('/admin/unauthorized', { replace: true });
        return;
      }
    }

    // Log route access for security monitoring
    console.log('Route accessed:', path);
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default RouteValidator;
