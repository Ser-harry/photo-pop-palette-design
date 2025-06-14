
-- Create an enum for different admin roles
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table to store admin user information
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admin_users(id)
);

-- Create admin_sessions table to track active admin sessions
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_activity_logs table for audit trail
CREATE TABLE public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = is_admin_user.user_id 
    AND is_active = true
  );
$$;

-- Create security definer function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID)
RETURNS admin_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role 
  FROM public.admin_users 
  WHERE admin_users.user_id = get_admin_role.user_id 
  AND is_active = true;
$$;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view their own record"
  ON public.admin_users
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin_user(auth.uid()));

CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users
  FOR ALL
  USING (public.get_admin_role(auth.uid()) = 'super_admin');

-- RLS Policies for admin_sessions
CREATE POLICY "Admins can view their own sessions"
  ON public.admin_sessions
  FOR SELECT
  USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage their own sessions"
  ON public.admin_sessions
  FOR ALL
  USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for admin_activity_logs
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs
  FOR SELECT
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "System can insert activity logs"
  ON public.admin_activity_logs
  FOR INSERT
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_admin_updated_at();

-- Insert a default super admin (you'll need to create this user in Supabase Auth first)
-- Replace 'your-email@example.com' with your actual admin email
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('admin@kollegeapply.com', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;
