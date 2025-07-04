
import { toast } from '@/hooks/use-toast';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseEntry, IndividualSet } from './useSessionState';

interface UseSessionExerciseManagementProps {
  exerciseEntries: ExerciseEntry[];
  setExerciseEntries: (entries: ExerciseEntry[]) => void;
  getNextPosition: () => number;
}

export const useSessionExerciseManagement = ({
  exerciseEntries,
  setExerciseEntries,
  getNextPosition,
}: UseSessionExerciseManagementProps) => {
  const { allExercises } = useExercises();

  const addExerciseToSession = (exerciseId: string) => {
    const newEntry: ExerciseEntry = {
      exerciseId,
      sets: [
        { setNumber: 1, reps: '', weight: '' },
        { setNumber: 2, reps: '', weight: '' },
        { setNumber: 3, reps: '', weight: '' }
      ],
      collapsed: false,
      position: getNextPosition(),
      exerciseNotes: '',
    };

    setExerciseEntries([...exerciseEntries, newEntry]);
  };

  const updateExerciseSets = (exerciseId: string, sets: IndividualSet[]) => {
    setExerciseEntries(exerciseEntries.map(entry => 
      entry.exerciseId === exerciseId ? { ...entry, sets } : entry
    ));
  };

  const toggleExerciseCollapse = (exerciseId: string) => {
    setExerciseEntries(exerciseEntries.map(entry => 
      entry.exerciseId === exerciseId ? { ...entry, collapsed: !entry.collapsed } : entry
    ));
  };

  const removeExerciseFromSession = (exerciseId: string) => {
    setExerciseEntries(exerciseEntries.filter(entry => entry.exerciseId !== exerciseId));
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    toast({
      title: "Exercise Removed",
      description: `${exercise?.name} has been removed from your session.`,
    });
  };

  const getExercise = (exerciseId: string) => {
    return allExercises.find(ex => ex.id === exerciseId);
  };

  return {
    addExerciseToSession,
    updateExerciseSets,
    toggleExerciseCollapse,
    removeExerciseFromSession,
    getExercise,
  };
};
