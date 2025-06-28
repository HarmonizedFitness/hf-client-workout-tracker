
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTrainer } from './useTrainer';
import { toast } from '@/hooks/use-toast';

export interface PersonalRecord {
  id: string;
  client_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  set_number: number;
  date: string;
  session_id?: string;
  total_volume?: number;
  pr_type: 'single_weight' | 'volume';
  created_at: string;
}

export interface PersonalRecordWithExercise extends PersonalRecord {
  exercise_name: string;
}

export const usePersonalRecords = (clientId?: string) => {
  const { trainer } = useTrainer();
  const queryClient = useQueryClient();

  const { data: personalRecords = [], isLoading } = useQuery({
    queryKey: ['personal-records', trainer?.id, clientId],
    queryFn: async () => {
      if (!trainer?.id) return [];
      
      let query = supabase
        .from('personal_records')
        .select(`
          *,
          exercises (name)
        `)
        .order('date', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      } else {
        // If no specific client, get records for all trainer's clients
        const { data: clients } = await supabase
          .from('clients')
          .select('id')
          .eq('trainer_id', trainer.id);
        
        if (clients && clients.length > 0) {
          const clientIds = clients.map(c => c.id);
          query = query.in('client_id', clientIds);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(record => ({
        ...record,
        exercise_name: record.exercises?.name || 'Unknown Exercise'
      })) as PersonalRecordWithExercise[];
    },
    enabled: !!trainer?.id,
  });

  const savePRMutation = useMutation({
    mutationFn: async (prData: {
      clientId: string;
      exerciseId: string;
      weight: number;
      reps: number;
      setNumber: number;
      date: string;
      sessionId?: string;
      prType: 'single_weight' | 'volume';
      totalVolume?: number;
    }) => {
      const { data, error } = await supabase
        .from('personal_records')
        .insert({
          client_id: prData.clientId,
          exercise_id: prData.exerciseId,
          weight: prData.weight,
          reps: prData.reps,
          set_number: prData.setNumber,
          date: prData.date,
          session_id: prData.sessionId,
          pr_type: prData.prType,
          total_volume: prData.totalVolume,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-records'] });
      toast({
        title: "New Personal Record!",
        description: "Congratulations on the new PR!",
      });
    },
    onError: (error) => {
      console.error('Error saving PR:', error);
    },
  });

  const checkAndSavePRs = async (
    clientId: string,
    exerciseId: string,
    weight: number,
    reps: number,
    setNumber: number,
    date: string,
    sessionId?: string
  ) => {
    // Get current PRs for this exercise
    const existingPRs = personalRecords.filter(
      pr => pr.client_id === clientId && pr.exercise_id === exerciseId
    );

    const totalVolume = weight * reps;
    let newPRs: Array<{
      clientId: string;
      exerciseId: string;
      weight: number;
      reps: number;
      setNumber: number;
      date: string;
      sessionId?: string;
      prType: 'single_weight' | 'volume';
      totalVolume?: number;
    }> = [];

    // Check for single weight PR (1RM equivalent)
    const maxWeightPR = existingPRs
      .filter(pr => pr.pr_type === 'single_weight')
      .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);

    if (weight > maxWeightPR) {
      newPRs.push({
        clientId,
        exerciseId,
        weight,
        reps,
        setNumber,
        date,
        sessionId,
        prType: 'single_weight',
      });
    }

    // Check for volume PR
    const maxVolumePR = existingPRs
      .filter(pr => pr.pr_type === 'volume')
      .reduce((max, pr) => (pr.total_volume || 0) > max ? (pr.total_volume || 0) : max, 0);

    if (totalVolume > maxVolumePR) {
      newPRs.push({
        clientId,
        exerciseId,
        weight,
        reps,
        setNumber,
        date,
        sessionId,
        prType: 'volume',
        totalVolume,
      });
    }

    // Save new PRs
    for (const pr of newPRs) {
      await savePRMutation.mutateAsync(pr);
    }

    return newPRs.length > 0;
  };

  return {
    personalRecords,
    isLoading,
    checkAndSavePRs,
    isSavingPR: savePRMutation.isPending,
  };
};
