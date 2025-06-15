
-- Drop the existing public policy first
DROP POLICY IF EXISTS "Public can view active advertisements" ON public.advertisements;

-- Remove the dangerous "Anyone can..." policies from advertisements table
DROP POLICY IF EXISTS "Anyone can view active advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Anyone can view all advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Anyone can create advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Anyone can update advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Anyone can delete advertisements" ON public.advertisements;

-- Create secure admin-only policies for advertisements table
CREATE POLICY "Admin users can view all advertisements" 
ON public.advertisements 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin users can create advertisements" 
ON public.advertisements 
FOR INSERT 
WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin users can update advertisements" 
ON public.advertisements 
FOR UPDATE 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin users can delete advertisements" 
ON public.advertisements 
FOR DELETE 
USING (public.is_admin_user(auth.uid()));

-- Allow public viewing of active advertisements only
CREATE POLICY "Public can view active advertisements" 
ON public.advertisements 
FOR SELECT 
USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Create admin-only policies for other sensitive tables
CREATE POLICY "Admin users can manage analytics" 
ON public.analytics_daily_stats 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin users can manage search analytics" 
ON public.search_analytics 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin users can manage page views" 
ON public.page_views 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Add rate limiting function for admin login attempts
CREATE OR REPLACE FUNCTION public.check_admin_login_rate_limit(email_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_count INTEGER;
  window_start TIMESTAMP;
BEGIN
  window_start := NOW() - INTERVAL '15 minutes';
  
  SELECT COUNT(*) INTO attempt_count
  FROM public.admin_activity_logs
  WHERE details->>'ip_address' = (
    SELECT details->>'ip_address' 
    FROM public.admin_activity_logs 
    WHERE action = 'login_attempt' 
    AND details->>'email' = email_input 
    ORDER BY created_at DESC 
    LIMIT 1
  )
  AND action = 'login_attempt'
  AND created_at > window_start;
  
  RETURN attempt_count < 5; -- Max 5 attempts per 15 minutes
END;
$$;
