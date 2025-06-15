
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

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user && mounted) {
          setUser(session.user);
          console.log('Initial session found for user:', session.user.id);
          
          try {
            const adminData = await AdminAuthService.getAdminUser(session.user.id);
            if (adminData && mounted) {
              setAdminUser(adminData);
              setIsAuthenticated(true);
              console.log('Admin user found:', adminData.role);
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Admin auth state change:', event);
        
        if (session?.user) {
          setUser(session.user);
          try {
            const adminData = await AdminAuthService.getAdminUser(session.user.id);
            if (adminData && mounted) {
              setAdminUser(adminData);
              setIsAuthenticated(true);
              setError(null);
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
          } catch (adminError) {
            if (mounted) {
              handleAuthError(adminError, 'auth state change');
            }
          }
        } else if (mounted) {
          resetAuthState();
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, resetAuthState, handleAuthError]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AdminAuthService.signIn(email, password);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.adminUser.email}`,
      });
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials";
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
