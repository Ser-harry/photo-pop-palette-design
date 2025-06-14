
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

  return (data || []) as DatabaseAdvertisement[];
}

export async function trackAdImpression(adId: string): Promise<void> {
  try {
    // First get current impressions count
    const { data: currentAd } = await supabase
      .from('advertisements')
      .select('impressions')
      .eq('id', adId)
      .single();

    if (currentAd) {
      const { error } = await supabase
        .from('advertisements')
        .update({ impressions: currentAd.impressions + 1 })
        .eq('id', adId);
      
      if (error) {
        console.error('Error tracking ad impression:', error);
      }
    }
  } catch (error) {
    console.error('Error tracking ad impression:', error);
  }
}

export async function trackAdClick(adId: string): Promise<void> {
  try {
    // First get current clicks count
    const { data: currentAd } = await supabase
      .from('advertisements')
      .select('clicks')
      .eq('id', adId)
      .single();

    if (currentAd) {
      const { error } = await supabase
        .from('advertisements')
        .update({ clicks: currentAd.clicks + 1 })
        .eq('id', adId);
      
      if (error) {
        console.error('Error tracking ad click:', error);
      }
    }
  } catch (error) {
    console.error('Error tracking ad click:', error);
  }
}
