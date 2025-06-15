export interface DatabaseCollege {
  id: string;
  name: string;
  slug: string;
  location: string;
  district: string;
  type: string; // Changed from union type to string for database compatibility
  naac_grade?: string;
  established: number;
  website?: string;
  facilities: string[];
  featured: boolean;
  homepage_featured: boolean;
  display_order: number;
  image_url?: string;
  principal_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBranch {
  id: string;
  name: string;
  code: string;
  duration: string;
  created_at: string;
}

export interface DatabaseCutoffData {
  id: string;
  college_id: string;
  branch_id: string;
  year: number;
  category: string;
  cutoff_mark: number;
  opening_rank?: number;
  closing_rank?: number;
  created_at: string;
}

export interface DatabaseAdvertisement {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  cta_text: string;
  placement: string; // Changed from union type to string for database compatibility
  start_date: string;
  end_date: string;
  is_active: boolean;
  clicks: number;
  impressions: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserBookmark {
  id: string;
  user_id: string;
  college_id: string;
  branch_id: string;
  created_at: string;
}

export interface DatabaseUserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  preferred_district?: string;
  tnea_marks?: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSearchAnalytics {
  id: string;
  user_id?: string;
  marks: number;
  category: string;
  preferred_district?: string;
  college_types?: string[];
  branches?: string[];
  results_count: number;
  session_id?: string;
  created_at: string;
}

export interface DatabasePageView {
  id: string;
  page_path: string;
  user_id?: string;
  session_id?: string;
  device_type?: string;
  referrer?: string;
  created_at: string;
}

export interface DatabaseAdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  created_by: string | null;
}

export interface DatabaseAdminSession {
  id: string;
  admin_user_id: string;
  session_token: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DatabaseAdminActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DatabaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id?: string;
  tags?: string[];
  status: string;
  featured: boolean;
  featured_image?: string;
  meta_description?: string;
  article_label?: string;
  author_id: string;
  views: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseHomepageContent {
  id: string;
  section_name: string;
  title: string;
  content: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseHomepageArticle {
  id: string;
  article_id: string;
  position: number;
  section: string;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseCrmContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contact_type: string;
  source?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface DatabaseCrmLead {
  id: string;
  contact_id?: string;
  lead_source?: string;
  status: string;
  priority: string;
  interested_colleges?: string[];
  preferred_branches?: string[];
  tnea_marks?: number;
  category?: string;
  preferred_district?: string;
  expected_admission_year?: number;
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  last_contacted?: string;
}

export interface DatabaseCrmInteraction {
  id: string;
  contact_id?: string;
  lead_id?: string;
  interaction_type: string;
  subject?: string;
  description?: string;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
  created_by?: string;
  created_at: string;
}

export interface DatabaseAnalyticsDailyStats {
  id: string;
  date: string;
  total_page_views: number;
  unique_visitors: number;
  total_searches: number;
  ad_clicks: number;
  ad_impressions: number;
  bounce_rate: number;
  avg_session_duration: number;
  created_at: string;
  updated_at: string;
}
