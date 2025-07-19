
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
  };
  event_memberships: Array<{
    user_email: string;
    user_name: string;
  }>;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CalendlyResponse {
  collection: CalendlyEvent[];
  pagination: {
    count: number;
    next_page?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('CALENDLY_PAT');
    
    if (!accessToken) {
      console.error('CALENDLY_PAT environment variable not found');
      return new Response(
        JSON.stringify({ error: 'Calendly configuration missing' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get current time for filtering upcoming events
    const now = new Date().toISOString();
    
    console.log('Fetching Calendly user info...');
    
    // Fetch user info first to get the user URI
    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch Calendly user info:', userResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Calendly' }),
        { 
          status: userResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const userInfo = await userResponse.json();
    const userUri = userInfo.resource.uri;

    console.log('Fetching Calendly events for user:', userUri);

    // Fetch scheduled events
    const eventsResponse = await fetch(
      `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${encodeURIComponent(now)}&sort=start_time:asc&count=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!eventsResponse.ok) {
      console.error('Failed to fetch Calendly events:', eventsResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch scheduled events' }),
        { 
          status: eventsResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const eventsData: CalendlyResponse = await eventsResponse.json();

    console.log(`Found ${eventsData.collection.length} events`);

    // Format events for frontend consumption
    const formattedEvents = eventsData.collection.map((event: CalendlyEvent) => {
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // duration in minutes

      return {
        id: event.uri.split('/').pop(),
        title: event.name,
        startTime: event.start_time,
        endTime: event.end_time,
        duration,
        location: event.location?.location || event.location?.type || 'Not specified',
        status: event.status,
        attendees: event.event_memberships?.map(member => ({
          name: member.user_name,
          email: member.user_email,
        })) || [],
        createdAt: event.created_at,
        updatedAt: event.updated_at,
      };
    });

    return new Response(
      JSON.stringify({
        events: formattedEvents,
        count: eventsData.pagination.count,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching Calendly events:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch scheduled events' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
