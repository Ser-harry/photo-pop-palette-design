
import { supabase } from "@/integrations/supabase/client";
import { DatabaseCollege, DatabaseBranch, DatabaseCutoffData } from "@/types/database";

export async function getColleges(): Promise<DatabaseCollege[]> {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .order('featured', { ascending: false })
    .order('name');

  if (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }

  return (data || []) as DatabaseCollege[];
}

export async function getFeaturedColleges(): Promise<DatabaseCollege[]> {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .eq('featured', true)
    .order('name');

  if (error) {
    console.error('Error fetching featured colleges:', error);
    throw error;
  }

  return (data || []) as DatabaseCollege[];
}

export async function getCollegeBySlug(slug: string): Promise<DatabaseCollege | null> {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching college by slug:', error);
    return null;
  }

  return data as DatabaseCollege;
}

export async function getBranches(): Promise<DatabaseBranch[]> {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }

  return data || [];
}

export async function getCutoffData(): Promise<DatabaseCutoffData[]> {
  const { data, error } = await supabase
    .from('cutoff_data')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching cutoff data:', error);
    throw error;
  }

  return data || [];
}

export async function getCutoffDataForCollege(collegeId: string): Promise<DatabaseCutoffData[]> {
  const { data, error } = await supabase
    .from('cutoff_data')
    .select('*')
    .eq('college_id', collegeId)
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching cutoff data for college:', error);
    throw error;
  }

  return data || [];
}
