
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
  position: number;
  circuitId?: string;
  exerciseNotes?: string;
}

interface UseSessionStateProps {
  preSelectedExercises?: string[];
}

export const useSessionState = ({ preSelectedExercises = [] }: UseSessionStateProps) => {
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());

  // Initialize with pre-selected exercises
  useEffect(() => {
    if (preSelectedExercises.length > 0) {
      const initialEntries = preSelectedExercises.map((exerciseId, index) => ({
        exerciseId,
        sets: [
          { setNumber: 1, reps: '', weight: '' },
          { setNumber: 2, reps: '', weight: '' },
          { setNumber: 3, reps: '', weight: '' }
        ],
        collapsed: false,
        position: index + 1,
        exerciseNotes: '',
      }));
      setExerciseEntries(initialEntries);
    }
  }, [preSelectedExercises]);

  const getNextPosition = () => {
    return Math.max(...exerciseEntries.map(e => e.position), 0) + 1;
  };

  return {
    exerciseEntries,
    setExerciseEntries,
    sessionNotes,
    setSessionNotes,
    isSaving,
    setIsSaving,
    selectedExercises,
    setSelectedExercises,
    getNextPosition,
  };
};
