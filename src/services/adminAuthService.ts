
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export class AdminAuthService {
  // Sign in admin user
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is an admin
      const adminUser = await this.getAdminUser(data.user?.id);
      if (!adminUser) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: User is not an admin');
      }

      // Update last login
      await this.updateLastLogin(adminUser.id);
      
      // Log admin activity
      await this.logActivity(adminUser.id, 'login', 'auth', null, {
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

      return { user: data.user, adminUser };
    } catch (error) {
      console.error('Admin sign in error:', error);
      throw error;
    }
  }

  // Sign out admin user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get admin user data
  static async getAdminUser(userId: string | undefined): Promise<AdminUser | null> {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching admin user:', error);
      return null;
    }

    return data;
  }

  // Check if current user is admin
  static async isCurrentUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const adminUser = await this.getAdminUser(user.id);
    return !!adminUser;
  }

  // Get current admin user
  static async getCurrentAdminUser(): Promise<AdminUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return this.getAdminUser(user.id);
  }

  // Update last login timestamp
  static async updateLastLogin(adminUserId: string) {
    const { error } = await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUserId);

    if (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Log admin activity
  static async logActivity(
    adminUserId: string, 
    action: string, 
    resourceType?: string, 
    resourceId?: string,
    details?: any
  ) {
    const { error } = await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: adminUserId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        ip_address: details?.ip_address,
        user_agent: details?.user_agent
      });

    if (error) {
      console.error('Error logging admin activity:', error);
    }
  }

  // Get client IP (simplified)
  static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  // Create admin session
  static async createAdminSession(adminUserId: string): Promise<string> {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

    const { error } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: adminUserId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Error creating admin session:', error);
      throw error;
    }

    return sessionToken;
  }

  // Validate admin session
  static async validateAdminSession(sessionToken: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('expires_at, admin_user_id')
      .eq('session_token', sessionToken)
      .single();

    if (error || !data) return false;

    const expiresAt = new Date(data.expires_at);
    return expiresAt > new Date();
  }
}
