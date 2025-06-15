
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clerkPublishableKey = Deno.env.get('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');

    if (!clerkPublishableKey) {
      throw new Error('Clerk publishable key not configured');
    }

    console.log('Providing Clerk configuration');

    return new Response(JSON.stringify({ 
      publishableKey: clerkPublishableKey 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-clerk-config function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get Clerk configuration',
        details: error.message 
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
