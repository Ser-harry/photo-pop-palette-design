
import { supabase } from "@/integrations/supabase/client";

export interface CollegeDirectoryData {
  id: string;
  name: string;
  principalName?: string;
  address?: string;
  email?: string;
  website?: string;
  phone?: string;
}

export async function getCollegeDirectory(): Promise<CollegeDirectoryData[]> {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, name, principal_name, address, email, website, phone')
      .order('name');

    if (error) {
      console.error('Error fetching college directory:', error);
      throw new Error('Failed to fetch college directory');
    }

    return (data || []).map(college => ({
      id: college.id,
      name: college.name,
      principalName: college.principal_name || undefined,
      address: college.address || undefined,
      email: college.email || undefined,
      website: college.website || undefined,
      phone: college.phone || undefined,
    }));
  } catch (error) {
    console.error('Service error in getCollegeDirectory:', error);
    throw error;
  }
}
