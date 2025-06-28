
import { usePersonalRecords } from '@/hooks/usePersonalRecords';
import { Client } from '@/types/exercise';

interface UseSessionPROperationsProps {
  client: Client;
}

export const useSessionPROperations = ({ client }: UseSessionPROperationsProps) => {
  const { personalRecords, checkAndSavePRs } = usePersonalRecords(client.id);

  const getCurrentPR = (exerciseId: string): number | undefined => {
    // Find the absolute maximum weight lifted for this exercise
    const maxWeightPR = personalRecords
      .filter(pr => pr.exercise_id === exerciseId && pr.pr_type === 'single_weight')
      .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);
    
    return maxWeightPR > 0 ? maxWeightPR : undefined;
  };

  const getTotalPotentialPRs = (exerciseEntries: Array<{ exerciseId: string; sets: Array<{ weight: string; reps: string }> }>) => {
    return exerciseEntries.reduce((total, entry) => {
      const currentMaxWeight = getCurrentPR(entry.exerciseId) || 0;
      const currentMaxVolume = personalRecords
        .filter(pr => pr.exercise_id === entry.exerciseId && pr.pr_type === 'volume')
        .reduce((max, pr) => (pr.total_volume || 0) > max ? (pr.total_volume || 0) : max, 0);

      return total + entry.sets.filter(set => {
        if (!set.weight || !set.reps) return false;
        
        const weightInLbs = parseFloat(set.weight);
        const reps = parseInt(set.reps);
        const singleSetVolume = weightInLbs * reps;
        
        // Check if this set would be either a weight PR or volume PR
        const isWeightPR = weightInLbs > currentMaxWeight;
        const isVolumePR = singleSetVolume > currentMaxVolume;
        
        return isWeightPR || isVolumePR;
      }).length;
    }, 0);
  };

  return {
    getCurrentPR,
    getTotalPotentialPRs,
    checkAndSavePRs,
  };
};
