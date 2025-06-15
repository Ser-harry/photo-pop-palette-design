
import { supabase } from "@/integrations/supabase/client";
import { DatabaseCollege, DatabaseBranch, DatabaseCutoffData } from "@/types/database";
import { sanitizeInput, isValidSlug } from "@/utils/security";

export async function getColleges(): Promise<DatabaseCollege[]> {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('featured', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching colleges:', error);
      throw new Error('Failed to fetch colleges');
    }

    return (data || []) as DatabaseCollege[];
  } catch (error) {
    console.error('Service error in getColleges:', error);
    throw error;
  }
}

export async function getFeaturedColleges(): Promise<DatabaseCollege[]> {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('featured', true)
      .order('display_order')
      .order('name');

    if (error) {
      console.error('Error fetching featured colleges:', error);
      throw new Error('Failed to fetch featured colleges');
    }

    return (data || []) as DatabaseCollege[];
  } catch (error) {
    console.error('Service error in getFeaturedColleges:', error);
    throw error;
  }
}

export async function getHomepageFeaturedColleges(): Promise<DatabaseCollege[]> {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('homepage_featured', true)
      .order('display_order')
      .order('name');

    if (error) {
      console.error('Error fetching homepage featured colleges:', error);
      throw new Error('Failed to fetch homepage featured colleges');
    }

    return (data || []) as DatabaseCollege[];
  } catch (error) {
    console.error('Service error in getHomepageFeaturedColleges:', error);
    throw error;
  }
}

export async function getCollegeBySlug(slug: string): Promise<DatabaseCollege | null> {
  try {
    // Validate and sanitize the slug input
    if (!isValidSlug(slug)) {
      console.error('Invalid slug format:', slug);
      return null;
    }

    const sanitizedSlug = sanitizeInput(slug);
    
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('slug', sanitizedSlug)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data

    if (error) {
      console.error('Error fetching college by slug:', error);
      throw new Error('Failed to fetch college');
    }

    if (!data) {
      console.log('No college found for slug:', sanitizedSlug);
      return null;
    }

    return data as DatabaseCollege;
  } catch (error) {
    console.error('Service error in getCollegeBySlug:', error);
    return null;
  }
}

export async function getBranches(): Promise<DatabaseBranch[]> {
  try {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching branches:', error);
      throw new Error('Failed to fetch branches');
    }

    return data || [];
  } catch (error) {
    console.error('Service error in getBranches:', error);
    throw error;
  }
}

export async function getCutoffData(): Promise<DatabaseCutoffData[]> {
  try {
    const { data, error } = await supabase
      .from('cutoff_data')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching cutoff data:', error);
      throw new Error('Failed to fetch cutoff data');
    }

    return data || [];
  } catch (error) {
    console.error('Service error in getCutoffData:', error);
    throw error;
  }
}

export async function getCutoffDataForCollege(collegeId: string): Promise<DatabaseCutoffData[]> {
  try {
    // Validate collegeId format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(collegeId)) {
      console.error('Invalid college ID format:', collegeId);
      return [];
    }

    const { data, error } = await supabase
      .from('cutoff_data')
      .select('*')
      .eq('college_id', collegeId)
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching cutoff data for college:', error);
      throw new Error('Failed to fetch cutoff data for college');
    }

    return data || [];
  } catch (error) {
    console.error('Service error in getCutoffDataForCollege:', error);
    return [];
  }
}
