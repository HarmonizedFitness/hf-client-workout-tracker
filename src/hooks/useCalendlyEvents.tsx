
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CalendlyEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  status: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface EventsResponse {
  events: CalendlyEvent[];
  count: number;
}

export const useCalendlyEvents = () => {
  return useQuery({
    queryKey: ['calendly-events'],
    queryFn: async (): Promise<EventsResponse> => {
      console.log('Fetching Calendly events...');
      
      const { data, error } = await supabase.functions.invoke('calendly-events');
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to fetch events');
      }
      
      if (!data) {
        throw new Error('No data received from Calendly API');
      }
      
      return data as EventsResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
