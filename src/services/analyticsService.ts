
import { supabase } from "@/integrations/supabase/client";
import { DatabaseSearchAnalytics, DatabasePageView, DatabaseAnalyticsDailyStats } from "@/types/database";

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

export async function getDailyAnalytics(days: number = 30): Promise<DatabaseAnalyticsDailyStats[]> {
  const { data, error } = await supabase
    .from('analytics_daily_stats')
    .select('*')
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching daily analytics:', error);
    throw error;
  }

  return data || [];
}

export async function aggregateDailyAnalytics(date?: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('aggregate_daily_analytics', {
      target_date: date || new Date().toISOString().split('T')[0]
    });

    if (error) {
      console.error('Error aggregating analytics:', error);
    }
  } catch (error) {
    console.error('Error aggregating analytics:', error);
  }
}

export async function getRealtimeAnalytics() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get today's stats
  const [
    { data: todayPageViews },
    { data: todaySearches },
    { data: monthlyStats },
    { data: adStats }
  ] = await Promise.all([
    supabase
      .from('page_views')
      .select('*')
      .gte('created_at', today),
    
    supabase
      .from('search_analytics')
      .select('*')
      .gte('created_at', today),
    
    supabase
      .from('analytics_daily_stats')
      .select('*')
      .gte('date', thirtyDaysAgo)
      .order('date'),
    
    supabase
      .from('advertisements')
      .select('clicks, impressions')
  ]);

  const totalAdClicks = adStats?.reduce((sum, ad) => sum + ad.clicks, 0) || 0;
  const totalAdImpressions = adStats?.reduce((sum, ad) => sum + ad.impressions, 0) || 0;

  return {
    todayPageViews: todayPageViews?.length || 0,
    todayUniqueVisitors: new Set(todayPageViews?.map(pv => pv.user_id).filter(Boolean)).size,
    todaySearches: todaySearches?.length || 0,
    totalAdClicks,
    totalAdImpressions,
    conversionRate: totalAdImpressions > 0 ? ((totalAdClicks / totalAdImpressions) * 100).toFixed(2) : '0.00',
    monthlyTrends: monthlyStats || []
  };
}
