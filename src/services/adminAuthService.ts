import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SecurityUtils } from "@/utils/securityUtils";

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
  // Sign in admin user with enhanced security
  static async signIn(email: string, password: string) {
    try {
      // Validate input
      if (!SecurityUtils.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Check rate limiting
      const rateLimitKey = `admin_login_${email}`;
      if (!SecurityUtils.checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Log login attempt
      const loginAttemptData = {
        email: SecurityUtils.sanitizeText(email),
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      SecurityUtils.secureLog('Admin login attempt', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: SecurityUtils.sanitizeText(email),
        password,
      });

      if (error) {
        // Log failed attempt
        await this.logLoginAttempt(email, false, error.message);
        throw error;
      }

      // Check if user is an admin
      const adminUser = await this.getAdminUser(data.user?.id);
      if (!adminUser) {
        await supabase.auth.signOut();
        await this.logLoginAttempt(email, false, 'User is not an admin');
        throw new Error('Unauthorized: User is not an admin');
      }

      // Update last login
      await this.updateLastLogin(adminUser.id);
      
      // Log successful login
      await this.logActivity(adminUser.id, 'login', 'auth', null, loginAttemptData);
      await this.logLoginAttempt(email, true, 'Success');

      SecurityUtils.secureLog('Admin login successful', { role: adminUser.role });

      return { user: data.user, adminUser };
    } catch (error) {
      SecurityUtils.secureLog('Admin sign in error', error);
      throw error;
    }
  }

  // Enhanced admin user validation
  static async getAdminUser(userId: string | undefined): Promise<AdminUser | null> {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        SecurityUtils.secureLog('Error fetching admin user', error);
        return null;
      }

      // Validate role
      if (!SecurityUtils.isValidAdminRole(data.role)) {
        SecurityUtils.secureLog('Invalid admin role detected', { role: data.role });
        return null;
      }

      return data;
    } catch (error) {
      SecurityUtils.secureLog('Admin user fetch error', error);
      return null;
    }
  }

  // Log login attempts for security monitoring
  static async logLoginAttempt(email: string, success: boolean, details: string) {
    try {
      // Direct insert to admin_activity_logs since we don't have the RPC function
      const { error } = await supabase
        .from('admin_activity_logs')
        .insert({
          admin_user_id: '00000000-0000-0000-0000-000000000000', // Placeholder for login attempts
          action: 'login_attempt',
          details: {
            email: SecurityUtils.sanitizeText(email),
            success: success,
            details: details,
            ip_address: await this.getClientIP(),
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        SecurityUtils.secureLog('Failed to log login attempt', error);
      }
    } catch (error) {
      SecurityUtils.secureLog('Login attempt logging error', error);
    }
  }

  // Sign out admin user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
      SecurityUtils.secureLog('Error updating last login', error);
    }
  }

  // Enhanced activity logging
  static async logActivity(
    adminUserId: string, 
    action: string, 
    resourceType?: string, 
    resourceId?: string,
    details?: any
  ) {
    try {
      const sanitizedDetails = details ? {
        ...details,
        // Remove sensitive data
        password: details?.password ? '[REDACTED]' : undefined,
        token: details?.token ? '[REDACTED]' : undefined,
        // Keep only necessary fields
        action: SecurityUtils.sanitizeText(action),
        timestamp: details?.timestamp || new Date().toISOString()
      } : null;

      const { error } = await supabase
        .from('admin_activity_logs')
        .insert({
          admin_user_id: adminUserId,
          action: SecurityUtils.sanitizeText(action),
          resource_type: resourceType ? SecurityUtils.sanitizeText(resourceType) : null,
          resource_id: resourceId ? SecurityUtils.sanitizeText(resourceId) : null,
          details: sanitizedDetails,
          ip_address: sanitizedDetails?.ip_address,
          user_agent: sanitizedDetails?.user_agent
        });

      if (error) {
        SecurityUtils.secureLog('Error logging admin activity', error);
      }
    } catch (error) {
      SecurityUtils.secureLog('Admin activity logging error', error);
    }
  }

  // Get client IP (enhanced)
  static async getClientIP(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // Enhanced session management
  static async createAdminSession(adminUserId: string): Promise<string> {
    const sessionToken = SecurityUtils.generateSecureToken();
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
      SecurityUtils.secureLog('Error creating admin session', error);
      throw error;
    }

    return sessionToken;
  }

  // Validate admin session with enhanced security
  static async validateAdminSession(sessionToken: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('expires_at, admin_user_id')
        .eq('session_token', sessionToken)
        .single();

      if (error || !data) return false;

      const expiresAt = new Date(data.expires_at);
      const isValid = expiresAt > new Date();

      if (!isValid) {
        // Clean up expired session
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }

      return isValid;
    } catch (error) {
      SecurityUtils.secureLog('Session validation error', error);
      return false;
    }
  }
}
