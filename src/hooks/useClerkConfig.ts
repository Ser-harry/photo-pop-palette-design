
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useClerkConfig = () => {
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClerkConfig = async () => {
      try {
        console.log('Fetching Clerk configuration...');
        
        const { data, error } = await supabase.functions.invoke('get-clerk-config');

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to get Clerk configuration');
        }

        const { publishableKey } = data;
        console.log('Clerk configuration loaded successfully');
        
        setPublishableKey(publishableKey);
      } catch (err: any) {
        console.error('Error fetching Clerk config:', err);
        setError(err.message || 'Failed to load authentication configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchClerkConfig();
  }, []);

  return { publishableKey, loading, error };
};
