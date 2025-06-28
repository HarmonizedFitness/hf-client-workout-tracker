
import { usePersonalRecords } from '@/hooks/usePersonalRecords';
import { Client } from '@/types/exercise';

interface UseSessionPROperationsProps {
  client: Client;
}

export const useSessionPROperations = ({ client }: UseSessionPROperationsProps) => {
  const { personalRecords, checkAndSavePRs } = usePersonalRecords(client.id);

  const getCurrentPR = (exerciseId: string): number | undefined => {
    const maxWeightPR = personalRecords
      .filter(pr => pr.exercise_id === exerciseId && pr.pr_type === 'single_weight')
      .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);
    
    return maxWeightPR > 0 ? maxWeightPR : undefined;
  };

  const getTotalPotentialPRs = (exerciseEntries: Array<{ exerciseId: string; sets: Array<{ weight: string; reps: string }> }>) => {
    return exerciseEntries.reduce((total, entry) => {
      const currentPR = getCurrentPR(entry.exerciseId);
      return total + entry.sets.filter(set => {
        const weightInLbs = parseFloat(set.weight);
        return set.weight && (!currentPR || weightInLbs > currentPR);
      }).length;
    }, 0);
  };

  return {
    getCurrentPR,
    getTotalPotentialPRs,
    checkAndSavePRs,
  };
};
