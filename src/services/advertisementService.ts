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

export async function getAllAds(): Promise<DatabaseAdvertisement[]> {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all advertisements:', error);
    throw error;
  }

  return (data || []) as DatabaseAdvertisement[];
}

export async function createAd(adData: {
  title: string;
  image_url: string;
  target_url: string;
  cta_text: string;
  placement: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}): Promise<DatabaseAdvertisement> {
  console.log('Creating advertisement with data:', adData);
  
  // Validate data before sending
  if (!adData.title || !adData.image_url || !adData.target_url || !adData.cta_text) {
    throw new Error('Missing required fields');
  }
  
  if (!adData.start_date || !adData.end_date) {
    throw new Error('Start date and end date are required');
  }
  
  if (new Date(adData.start_date) > new Date(adData.end_date)) {
    throw new Error('Start date cannot be after end date');
  }

  const { data, error } = await supabase
    .from('advertisements')
    .insert([adData])
    .select()
    .single();

  if (error) {
    console.error('Error creating advertisement:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }

  console.log('Advertisement created successfully:', data);
  return data as DatabaseAdvertisement;
}

export async function updateAd(id: string, adData: Partial<{
  title: string;
  image_url: string;
  target_url: string;
  cta_text: string;
  placement: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}>): Promise<DatabaseAdvertisement> {
  const { data, error } = await supabase
    .from('advertisements')
    .update(adData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating advertisement:', error);
    throw error;
  }

  return data as DatabaseAdvertisement;
}

export async function deleteAd(id: string): Promise<void> {
  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting advertisement:', error);
    throw error;
  }
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
