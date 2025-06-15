
-- Create CRM tables for contact and lead management
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  contact_type TEXT NOT NULL DEFAULT 'student', -- student, parent, college_rep, counselor
  source TEXT, -- website, referral, advertisement, etc.
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, converted
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admin_users(id)
);

-- Create leads table for tracking prospective students
CREATE TABLE public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  lead_source TEXT, -- search, advertisement, referral, etc.
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, qualified, converted, lost
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high
  interested_colleges TEXT[], -- array of college names or IDs
  preferred_branches TEXT[], -- array of branch preferences
  tnea_marks INTEGER,
  category TEXT,
  preferred_district TEXT,
  expected_admission_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  notes TEXT,
  assigned_to UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_contacted TIMESTAMP WITH TIME ZONE
);

-- Create interactions table for tracking communications
CREATE TABLE public.crm_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- call, email, meeting, note, sms
  subject TEXT,
  description TEXT,
  outcome TEXT, -- positive, neutral, negative, follow_up_needed
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics aggregation tables for better performance
CREATE TABLE public.analytics_daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_searches INTEGER DEFAULT 0,
  ad_clicks INTEGER DEFAULT 0,
  ad_impressions INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_crm_contacts_type ON public.crm_contacts(contact_type);
CREATE INDEX idx_crm_contacts_status ON public.crm_contacts(status);
CREATE INDEX idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX idx_crm_leads_assigned ON public.crm_leads(assigned_to);
CREATE INDEX idx_crm_interactions_contact ON public.crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_lead ON public.crm_interactions(lead_id);
CREATE INDEX idx_analytics_daily_date ON public.analytics_daily_stats(date);

-- Enable RLS on new tables
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CRM tables (admin access only)
CREATE POLICY "Admins can manage CRM contacts" 
  ON public.crm_contacts 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage CRM leads" 
  ON public.crm_leads 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage CRM interactions" 
  ON public.crm_interactions 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can view analytics stats" 
  ON public.analytics_daily_stats 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin_user(auth.uid()));

-- Create trigger for updating updated_at columns
CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_daily_updated_at
  BEFORE UPDATE ON public.analytics_daily_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to aggregate daily analytics
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.analytics_daily_stats (
    date,
    total_page_views,
    unique_visitors,
    total_searches,
    ad_clicks,
    ad_impressions
  )
  SELECT 
    target_date,
    COALESCE(pv.total_views, 0),
    COALESCE(pv.unique_users, 0),
    COALESCE(sa.total_searches, 0),
    COALESCE(ad.total_clicks, 0),
    COALESCE(ad.total_impressions, 0)
  FROM (
    SELECT 
      COUNT(*) as total_views,
      COUNT(DISTINCT user_id) as unique_users
    FROM public.page_views 
    WHERE DATE(created_at) = target_date
  ) pv
  CROSS JOIN (
    SELECT COUNT(*) as total_searches
    FROM public.search_analytics 
    WHERE DATE(created_at) = target_date
  ) sa
  CROSS JOIN (
    SELECT 
      SUM(clicks) as total_clicks,
      SUM(impressions) as total_impressions
    FROM public.advertisements
  ) ad
  ON CONFLICT (date) 
  DO UPDATE SET
    total_page_views = EXCLUDED.total_page_views,
    unique_visitors = EXCLUDED.unique_visitors,
    total_searches = EXCLUDED.total_searches,
    ad_clicks = EXCLUDED.ad_clicks,
    ad_impressions = EXCLUDED.ad_impressions,
    updated_at = now();
END;
$$;
