
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "@/services/collegeService";
import { supabase } from "@/integrations/supabase/client";

export const useSearchData = () => {
  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, status')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-contacts-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('id, name, email')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['admin-leads-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_leads')
        .select(`
          id, 
          status, 
          priority,
          contact:crm_contacts(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return { colleges, articles, contacts, leads };
};
