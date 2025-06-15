
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AdminAuthService, AdminUser } from '@/services/adminAuthService';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetAuthState = useCallback(() => {
    setUser(null);
    setAdminUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const handleAuthError = useCallback((error: any, context: string) => {
    console.error(`Admin auth error in ${context}:`, error);
    setError(error?.message || 'Authentication error occurred');
    resetAuthState();
  }, [resetAuthState]);

  // Enhanced session management with retry logic
  const checkAdminUser = useCallback(async (userId: string, retryCount = 0): Promise<AdminUser | null> => {
    try {
      const adminData = await AdminAuthService.getAdminUser(userId);
      if (adminData) {
        console.log('Admin user verified:', adminData.role);
        return adminData;
      } else if (retryCount < 2) {
        // Retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkAdminUser(userId, retryCount + 1);
      }
      return null;
    } catch (error) {
      console.error('Error checking admin user:', error);
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return checkAdminUser(userId, retryCount + 1);
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session with enhanced error handling
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (session?.user && mounted) {
          setUser(session.user);
          console.log('Initial session found for user:', session.user.id);
          
          try {
            const adminData = await checkAdminUser(session.user.id);
            if (adminData && mounted) {
              setAdminUser(adminData);
              setIsAuthenticated(true);
              setError(null);
              console.log('Admin authentication successful:', adminData.role);
            } else if (mounted) {
              console.log('No admin privileges found for user');
              resetAuthState();
            }
          } catch (adminError) {
            console.error('Error fetching admin user:', adminError);
            if (mounted) {
              handleAuthError(adminError, 'initial admin fetch');
            }
          }
        } else if (mounted) {
          console.log('No initial session found');
          resetAuthState();
        }
      } catch (error) {
        if (mounted) {
          handleAuthError(error, 'initial session');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with enhanced handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Admin auth state change:', event, session?.user?.id);
        
        try {
          if (session?.user) {
            setUser(session.user);
            setLoading(true);
            
            const adminData = await checkAdminUser(session.user.id);
            if (adminData && mounted) {
              setAdminUser(adminData);
              setIsAuthenticated(true);
              setError(null);
              console.log('Auth state change - admin verified:', adminData.role);
            } else if (mounted) {
              resetAuthState();
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Access Denied",
                  description: "You don't have admin privileges",
                  variant: "destructive"
                });
              }
            }
          } else if (mounted) {
            console.log('Auth state change - no user');
            resetAuthState();
          }
        } catch (adminError) {
          if (mounted) {
            handleAuthError(adminError, 'auth state change');
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, resetAuthState, handleAuthError, checkAdminUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting admin sign in for:', email);
      
      const result = await AdminAuthService.signIn(email, password);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.adminUser.email}`,
      });
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials";
      console.error('Sign in error:', error);
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      if (adminUser) {
        await AdminAuthService.logActivity(
          adminUser.id, 
          'logout', 
          'auth', 
          null, 
          { ip_address: await AdminAuthService.getClientIP() }
        );
      }
      
      await AdminAuthService.signOut();
      resetAuthState();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    adminUser,
    loading,
    isAuthenticated,
    error,
    signIn,
    signOut
  };
};
