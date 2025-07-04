
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
    position: number;
    circuit_id: string | null;
    exercise_notes: string | null;
  }[];
}

interface SaveSessionData {
  clientId: string;
  date: string;
  sets: Array<{
    exerciseId: string;
    setNumber: number;
    reps: number;
    weight: number;
    isPR: boolean;
    position: number;
    circuitId?: string;
    exerciseNotes?: string;
  }>;
  notes?: string;
}

export const useWorkoutSessions = (clientId?: string) => {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['workout-sessions', clientId],
    queryFn: async (): Promise<WorkoutSession[]> => {
      if (!clientId) return [];
      
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
            is_pr,
            position,
            circuit_id,
            exercise_notes
          )
        `)
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId,
  });

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: SaveSessionData): Promise<WorkoutSession> => {
      // Get trainer ID from current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: trainer } = await supabase
        .from('trainers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!trainer) throw new Error('Trainer not found');

      // Create the workout session
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          client_id: sessionData.clientId,
          trainer_id: trainer.id,
          date: sessionData.date,
          notes: sessionData.notes,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Insert workout sets with enhanced fields
      const setsToInsert = sessionData.sets.map(set => ({
        session_id: session.id,
        exercise_id: set.exerciseId,
        set_number: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        is_pr: set.isPR,
        position: set.position,
        circuit_id: set.circuitId || null,
        exercise_notes: set.exerciseNotes || null,
      }));

      const { error: setsError } = await supabase
        .from('workout_sets')
        .insert(setsToInsert);

      if (setsError) throw setsError;

      // Return the session with sets
      const { data: sessionWithSets, error: fetchError } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_sets (
            id,
            exercise_id,
            weight,
            reps,
            set_number,
            is_pr,
            position,
            circuit_id,
            exercise_notes
          )
        `)
        .eq('id', session.id)
        .single();

      if (fetchError) throw fetchError;
      return sessionWithSets;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
    },
    onError: (error) => {
      console.error('Error saving session:', error);
      toast({
        title: "Error Saving Session",
        description: "There was an error saving your workout session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
      toast({
        title: "Session Deleted",
        description: "The workout session has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
      toast({
        title: "Error Deleting Session",
        description: "There was an error deleting the workout session. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    ...queryResult,
    sessions: queryResult.data,
    saveSession: saveSessionMutation.mutateAsync,
    isSavingSession: saveSessionMutation.isPending,
    deleteSession: deleteSessionMutation.mutateAsync,
    isDeletingSession: deleteSessionMutation.isPending,
    refetch: queryResult.refetch,
  };
};
