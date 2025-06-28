
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTrainer } from './useTrainer';
import { toast } from '@/hooks/use-toast';

export interface WorkoutSession {
  id: string;
  client_id: string;
  trainer_id: string;
  date: string;
  notes?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  is_pr: boolean;
  created_at: string;
}

export interface SessionWithSets extends WorkoutSession {
  workout_sets: WorkoutSet[];
}

export const useWorkoutSessions = (clientId?: string) => {
  const { trainer } = useTrainer();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['workout-sessions', trainer?.id, clientId],
    queryFn: async () => {
      if (!trainer?.id) return [];
      
      let query = supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_sets (*)
        `)
        .eq('trainer_id', trainer.id)
        .order('date', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as SessionWithSets[];
    },
    enabled: !!trainer?.id,
  });

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: {
      clientId: string;
      date: string;
      sets: Array<{
        exerciseId: string;
        setNumber: number;
        reps: number;
        weight: number;
        isPR: boolean;
      }>;
      notes?: string;
      durationMinutes?: number;
    }) => {
      if (!trainer?.id) throw new Error('No trainer found');

      console.log('Saving workout session with data:', sessionData);

      // Create the workout session first
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          client_id: sessionData.clientId,
          trainer_id: trainer.id,
          date: sessionData.date,
          notes: sessionData.notes,
          duration_minutes: sessionData.durationMinutes,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw sessionError;
      }

      console.log('Session created successfully:', session);

      // Create all workout sets
      const setsToInsert = sessionData.sets.map(set => ({
        session_id: session.id,
        exercise_id: set.exerciseId,
        set_number: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        is_pr: set.isPR,
      }));

      console.log('Inserting workout sets:', setsToInsert);

      const { error: setsError } = await supabase
        .from('workout_sets')
        .insert(setsToInsert);

      if (setsError) {
        console.error('Error creating workout sets:', setsError);
        throw setsError;
      }

      console.log('Workout sets created successfully');

      return session;
    },
    onSuccess: (session) => {
      console.log('Session saved successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['personal-records'] });
      toast({
        title: "Session Saved!",
        description: "Workout session has been successfully recorded.",
      });
    },
    onError: (error) => {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: "Failed to save workout session. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    sessions,
    isLoading,
    saveSession: saveSessionMutation.mutateAsync, // Return mutateAsync to handle promises
    isSavingSession: saveSessionMutation.isPending,
  };
};
