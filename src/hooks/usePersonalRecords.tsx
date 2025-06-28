
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTrainer } from './useTrainer';
import { useExercises } from './useExercises';
import { toast } from '@/hooks/use-toast';
import { PersonalRecordWithExercise, PRCheckData } from '@/types/personalRecord';
import { fetchPersonalRecords, savePR } from '@/services/personalRecordService';
import { mapPersonalRecordsWithExercises, checkForNewPRs } from '@/utils/personalRecordUtils';

export const usePersonalRecords = (clientId?: string) => {
  const { trainer } = useTrainer();
  const { customExercises } = useExercises();
  const queryClient = useQueryClient();

  const { data: personalRecords = [], isLoading } = useQuery({
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

  return {
    personalRecords,
    isLoading,
    checkAndSavePRs,
    isSavingPR: savePRMutation.isPending,
  };
};
