
import { Client } from '@/types/exercise';
import { ExerciseEntry } from './useSessionState';
import { useSessionPROperations } from './useSessionPROperations';
import { useSessionOperations } from './useSessionOperations';
import { useSessionExerciseManagement } from './useSessionExerciseManagement';
import { getTotalCompletedSets } from '@/utils/sessionCalculations';

interface UseSessionHandlersProps {
  client: Client;
  exerciseEntries: ExerciseEntry[];
  setExerciseEntries: (entries: ExerciseEntry[]) => void;
  sessionNotes: string;
  setIsSaving: (saving: boolean) => void;
}

export const useSessionHandlers = ({
  client,
  exerciseEntries,
  setExerciseEntries,
  sessionNotes,
  setIsSaving,
}: UseSessionHandlersProps) => {
  const { getCurrentPR, getTotalPotentialPRs, checkAndSavePRs } = useSessionPROperations({ client });
  
  const { handleSaveSession, isSavingSession } = useSessionOperations({
    client,
    exerciseEntries,
    sessionNotes,
    setIsSaving,
    checkAndSavePRs,
  });

  const {
    addExerciseToSession,
    updateExerciseSets,
    toggleExerciseCollapse,
    removeExerciseFromSession,
    getExercise,
  } = useSessionExerciseManagement({
    exerciseEntries,
    setExerciseEntries,
  });

  const getTotalCompletedSetsCount = () => getTotalCompletedSets(exerciseEntries);
  const getTotalPotentialPRsCount = () => getTotalPotentialPRs(exerciseEntries);

  return {
    getCurrentPR,
    addExerciseToSession,
    updateExerciseSets,
    toggleExerciseCollapse,
    removeExerciseFromSession,
    handleSaveSession,
    getExercise,
    getTotalCompletedSets: getTotalCompletedSetsCount,
    getTotalPotentialPRs: getTotalPotentialPRsCount,
    isSavingSession,
  };
};
