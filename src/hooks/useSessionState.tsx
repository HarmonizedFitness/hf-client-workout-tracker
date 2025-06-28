
import { useState, useEffect } from 'react';

export interface IndividualSet {
  setNumber: number;
  reps: string;
  weight: string;
}

export interface ExerciseEntry {
  exerciseId: string;
  sets: IndividualSet[];
  collapsed: boolean;
}

interface UseSessionStateProps {
  preSelectedExercises?: string[];
}

export const useSessionState = ({ preSelectedExercises = [] }: UseSessionStateProps) => {
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with pre-selected exercises
  useEffect(() => {
    if (preSelectedExercises.length > 0) {
      const initialEntries = preSelectedExercises.map(exerciseId => ({
        exerciseId,
        sets: [
          { setNumber: 1, reps: '', weight: '' },
          { setNumber: 2, reps: '', weight: '' },
          { setNumber: 3, reps: '', weight: '' }
        ],
        collapsed: false
      }));
      setExerciseEntries(initialEntries);
    }
  }, [preSelectedExercises]);

  return {
    exerciseEntries,
    setExerciseEntries,
    sessionNotes,
    setSessionNotes,
    isSaving,
    setIsSaving,
  };
};
