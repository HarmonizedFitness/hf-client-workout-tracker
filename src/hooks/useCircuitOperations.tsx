
import { ExerciseEntry } from './useSessionState';
import { toast } from '@/hooks/use-toast';

interface UseCircuitOperationsProps {
  exerciseEntries: ExerciseEntry[];
  setExerciseEntries: (entries: ExerciseEntry[]) => void;
  selectedExercises: Set<string>;
  setSelectedExercises: (selected: Set<string>) => void;
}

export const useCircuitOperations = ({
  exerciseEntries,
  setExerciseEntries,
  selectedExercises,
  setSelectedExercises,
}: UseCircuitOperationsProps) => {
  
  const generateCircuitId = () => {
    const existingCircuits = new Set(
      exerciseEntries
        .filter(e => e.circuitId)
        .map(e => e.circuitId)
    );
    
    let circuitNumber = 1;
    let circuitId = `Circuit ${String.fromCharCode(64 + circuitNumber)}`;
    
    while (existingCircuits.has(circuitId)) {
      circuitNumber++;
      circuitId = `Circuit ${String.fromCharCode(64 + circuitNumber)}`;
    }
    
    return circuitId;
  };

  const createCircuit = () => {
    if (selectedExercises.size < 2) {
      toast({
        title: "Invalid Selection",
        description: "Select at least 2 exercises to create a circuit.",
        variant: "destructive",
      });
      return;
    }

    const circuitId = generateCircuitId();
    const updatedEntries = exerciseEntries.map(entry => {
      if (selectedExercises.has(entry.exerciseId)) {
        return { ...entry, circuitId };
      }
      return entry;
    });

    setExerciseEntries(updatedEntries);
    setSelectedExercises(new Set());
    
    toast({
      title: "Circuit Created",
      description: `${circuitId} created with ${selectedExercises.size} exercises.`,
    });
  };

  const removeFromCircuit = (exerciseId: string) => {
    const updatedEntries = exerciseEntries.map(entry => {
      if (entry.exerciseId === exerciseId) {
        return { ...entry, circuitId: undefined };
      }
      return entry;
    });

    setExerciseEntries(updatedEntries);
    
    toast({
      title: "Exercise Removed",
      description: "Exercise removed from circuit.",
    });
  };

  const deleteCircuit = (circuitId: string) => {
    const updatedEntries = exerciseEntries.map(entry => {
      if (entry.circuitId === circuitId) {
        return { ...entry, circuitId: undefined };
      }
      return entry;
    });

    setExerciseEntries(updatedEntries);
    
    toast({
      title: "Circuit Deleted",
      description: `${circuitId} has been deleted.`,
    });
  };

  const renameCircuit = (oldCircuitId: string, newCircuitId: string) => {
    const updatedEntries = exerciseEntries.map(entry => {
      if (entry.circuitId === oldCircuitId) {
        return { ...entry, circuitId: newCircuitId };
      }
      return entry;
    });

    setExerciseEntries(updatedEntries);
  };

  const getCircuitExercises = (circuitId: string) => {
    return exerciseEntries
      .filter(entry => entry.circuitId === circuitId)
      .sort((a, b) => a.position - b.position);
  };

  const getExerciseGroups = () => {
    const circuits: { [key: string]: ExerciseEntry[] } = {};
    const standalone: ExerciseEntry[] = [];

    exerciseEntries
      .sort((a, b) => a.position - b.position)
      .forEach(entry => {
        if (entry.circuitId) {
          if (!circuits[entry.circuitId]) {
            circuits[entry.circuitId] = [];
          }
          circuits[entry.circuitId].push(entry);
        } else {
          standalone.push(entry);
        }
      });

    return { circuits, standalone };
  };

  return {
    createCircuit,
    removeFromCircuit,
    deleteCircuit,
    renameCircuit,
    getCircuitExercises,
    getExerciseGroups,
  };
};
