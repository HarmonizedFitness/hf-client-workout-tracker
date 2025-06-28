
import { ExerciseEntry } from '@/hooks/useSessionState';

export const getTotalCompletedSets = (exerciseEntries: ExerciseEntry[]): number => {
  return exerciseEntries.reduce((total, entry) => {
    return total + entry.sets.filter(set => set.reps && set.weight).length;
  }, 0);
};
