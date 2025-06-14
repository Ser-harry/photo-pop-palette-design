
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
