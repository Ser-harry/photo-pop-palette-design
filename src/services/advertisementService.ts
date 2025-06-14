
import { supabase } from "@/integrations/supabase/client";
import { DatabaseAdvertisement } from "@/types/database";

export async function getActiveAds(placement?: string): Promise<DatabaseAdvertisement[]> {
  let query = supabase
    .from('advertisements')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString().split('T')[0])
    .gte('end_date', new Date().toISOString().split('T')[0]);

  if (placement) {
    query = query.eq('placement', placement);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }

  return data || [];
}

export async function trackAdImpression(adId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_ad_impressions', { ad_id: adId });
    
    if (error) {
      console.error('Error tracking ad impression:', error);
    }
  } catch (error) {
    console.error('Error tracking ad impression:', error);
  }
}

export async function trackAdClick(adId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    
    if (error) {
      console.error('Error tracking ad click:', error);
    }
  } catch (error) {
    console.error('Error tracking ad click:', error);
  }
}
