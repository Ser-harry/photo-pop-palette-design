
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AdminAuthService, AdminUser } from '@/services/adminAuthService';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const adminData = await AdminAuthService.getAdminUser(session.user.id);
        if (adminData) {
          setAdminUser(adminData);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Admin auth state change:', event);
        
        if (session?.user) {
          setUser(session.user);
          const adminData = await AdminAuthService.getAdminUser(session.user.id);
          if (adminData) {
            setAdminUser(adminData);
            setIsAuthenticated(true);
          } else {
            setAdminUser(null);
            setIsAuthenticated(false);
            if (event === 'SIGNED_IN') {
              toast({
                title: "Access Denied",
                description: "You don't have admin privileges",
                variant: "destructive"
              });
            }
          }
        } else {
          setUser(null);
          setAdminUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await AdminAuthService.signIn(email, password);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.adminUser.email}`,
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
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
    signIn,
    signOut
  };
};
