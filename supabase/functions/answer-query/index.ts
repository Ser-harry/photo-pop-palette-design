
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { query, sessionId, userId, userFirstName } = await req.json();

    if (!query) {
      throw new Error('Query is required');
    }

    console.log(`Processing query for session ${sessionId}, user ${userId || 'anonymous'}: ${query}`);

    // Create personalized system message
    const systemMessage = userId && userFirstName
      ? `You are a helpful college assistant chatbot for ${userFirstName}. You help students with:
        - College admissions information
        - Course and program details
        - General academic guidance
        - TNEA (Tamil Nadu Engineering Admissions) related queries
        - College comparisons and recommendations
        
        Address the user by their first name (${userFirstName}) when appropriate. Keep your responses helpful, concise, and student-friendly. If you don't know specific information about a college or program, suggest the user contact the institution directly or check their official website.`
      : `You are a helpful college assistant chatbot. You help students with:
        - College admissions information
        - Course and program details
        - General academic guidance
        - TNEA (Tamil Nadu Engineering Admissions) related queries
        - College comparisons and recommendations
        
        Keep your responses helpful, concise, and student-friendly. If you don't know specific information about a college or program, suggest the user contact the institution directly or check their official website. Consider suggesting the user sign in for a more personalized experience.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.";

    console.log(`Generated response for session ${sessionId}: ${answer.substring(0, 100)}...`);

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in answer-query function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process your query. Please try again later.',
        details: error.message 
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
