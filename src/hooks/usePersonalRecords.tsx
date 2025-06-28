
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrainer } from './useTrainer';
import { useExercises } from './useExercises';
import { toast } from '@/hooks/use-toast';
import { PersonalRecordWithExercise, PRCheckData } from '@/types/personalRecord';
import { fetchPersonalRecords, savePR } from '@/services/personalRecordService';
import { mapPersonalRecordsWithExercises, checkForNewPRs } from '@/utils/personalRecordUtils';
import { clearAllPRsForClient, recalculatePRsFromWorkoutHistory } from '@/utils/prRecalculation';

export const usePersonalRecords = (clientId?: string) => {
  const { trainer } = useTrainer();
  const { customExercises } = useExercises();
  const queryClient = useQueryClient();

  const { data: personalRecords = [], isLoading, refetch } = useQuery({
    queryKey: ['personal-records', trainer?.id, clientId],
    queryFn: async () => {
      if (!trainer?.id) return [];
      
      const records = await fetchPersonalRecords(trainer.id, clientId);
      return mapPersonalRecordsWithExercises(records, customExercises);
    },
    enabled: !!trainer?.id,
  });

  const savePRMutation = useMutation({
    mutationFn: savePR,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-records'] });
    },
    onError: (error) => {
      console.error('Error upserting PR:', error);
    },
  });

  const recalculatePRsMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await clearAllPRsForClient(clientId);
      return await recalculatePRsFromWorkoutHistory(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-records'] });
      toast({
        title: "PRs Recalculated",
        description: "Personal records have been recalculated from workout history.",
      });
    },
    onError: (error) => {
      console.error('Error recalculating PRs:', error);
      toast({
        title: "Error",
        description: "Failed to recalculate personal records. Please try again.",
        variant: "destructive",
      });
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
  ): Promise<boolean> => {
    try {
      const checkData: PRCheckData = {
        clientId,
        exerciseId,
        weight,
        reps,
        setNumber,
        date,
        sessionId
      };

      const newPRs = checkForNewPRs(personalRecords, checkData);

      // Save new PRs (will upsert existing ones)
      for (const pr of newPRs) {
        await savePRMutation.mutateAsync(pr);
      }

      const hasPRs = newPRs.length > 0;
      if (hasPRs) {
        console.log(`Updated ${newPRs.length} PR(s)`);
        toast({
          title: "New Personal Record!",
          description: `Congratulations on ${newPRs.length} new PR${newPRs.length > 1 ? 's' : ''}!`,
        });
      }

      return hasPRs;
    } catch (error) {
      console.error('Error checking/saving PRs:', error);
      return false;
    }
  };

  const recalculatePRs = (clientId: string) => {
    recalculatePRsMutation.mutate(clientId);
  };

  return {
    personalRecords,
    isLoading,
    checkAndSavePRs,
    recalculatePRs,
    isRecalculating: recalculatePRsMutation.isPending,
    isSavingPR: savePRMutation.isPending,
    refetch,
  };
};
