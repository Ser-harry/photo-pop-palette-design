
import { supabase } from "@/integrations/supabase/client";
import { DatabaseSearchAnalytics, DatabasePageView } from "@/types/database";

export async function trackSearch(searchData: {
  marks: number;
  category: string;
  preferred_district?: string;
  college_types?: string[];
  branches?: string[];
  results_count: number;
  user_id?: string;
  session_id?: string;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('search_analytics')
      .insert([searchData]);

    if (error) {
      console.error('Error tracking search:', error);
    }
  } catch (error) {
    console.error('Error tracking search:', error);
  }
}

export async function trackPageView(pageData: {
  page_path: string;
  user_id?: string;
  session_id?: string;
  device_type?: string;
  referrer?: string;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('page_views')
      .insert([pageData]);

    if (error) {
      console.error('Error tracking page view:', error);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

export async function getSearchAnalytics(): Promise<DatabaseSearchAnalytics[]> {
  const { data, error } = await supabase
    .from('search_analytics')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching search analytics:', error);
    throw error;
  }

  return data || [];
}

export async function getPageViews(): Promise<DatabasePageView[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching page views:', error);
    throw error;
  }

  return data || [];
}
