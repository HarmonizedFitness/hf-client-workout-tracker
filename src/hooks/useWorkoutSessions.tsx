
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WorkoutSession {
  id: string;
  client_id: string;
  trainer_id: string;
  date: string;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  workout_sets: {
    id: string;
    exercise_id: string;
    weight: number;
    reps: number;
    set_number: number;
    is_pr: boolean;
  }[];
}

export const useWorkoutSessions = (clientId: string) => {
  const queryResult = useQuery({
    queryKey: ['workout-sessions', clientId],
    queryFn: async (): Promise<WorkoutSession[]> => {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_sets (
            id,
            exercise_id,
            weight,
            reps,
            set_number,
            is_pr
          )
        `)
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId,
  });

  return {
    ...queryResult,
    sessions: queryResult.data,
  };
};
