
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { initialExercises } from '@/data/exerciseData';
import { WorkoutSet, WorkoutSession, Client, PersonalRecord } from '@/types/exercise';
import IndividualSetEntry from './IndividualSetEntry';
import ExerciseSelector from './ExerciseSelector';
import SessionSummary from './SessionSummary';
import SessionNotes from './SessionNotes';
import SessionEmptyState from './SessionEmptyState';
import { toast } from '@/hooks/use-toast';

interface SessionLoggerProps {
  client: Client;
}

interface IndividualSet {
  setNumber: number;
  reps: string;
  weight: string;
}

interface ExerciseEntry {
  exerciseId: string;
  sets: IndividualSet[];
  collapsed: boolean;
}

const SessionLogger = ({ client }: SessionLoggerProps) => {
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');

  const getCurrentPR = (exerciseId: string): number | undefined => {
    const pr = client.personalRecords.find(pr => pr.exerciseId === exerciseId);
    return pr?.weight;
  };

  const addExerciseToSession = (exerciseId: string) => {
    const newEntry: ExerciseEntry = {
      exerciseId,
      sets: [
        { setNumber: 1, reps: '', weight: '' },
        { setNumber: 2, reps: '', weight: '' },
        { setNumber: 3, reps: '', weight: '' }
      ],
      collapsed: false
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
    const exercise = initialExercises.find(ex => ex.id === exerciseId);
    toast({
      title: "Exercise Removed",
      description: `${exercise?.name} has been removed from your session.`,
    });
  };

  const checkForPR = (exerciseId: string, newWeight: number): boolean => {
    const existingPR = client.personalRecords.find(pr => pr.exerciseId === exerciseId);
    return !existingPR || newWeight > existingPR.weight;
  };

  const updatePersonalRecords = (sets: WorkoutSet[]) => {
    sets.forEach(set => {
      if (set.isPB) {
        const exercise = initialExercises.find(ex => ex.id === set.exerciseId);
        if (exercise) {
          const newPR: PersonalRecord = {
            exerciseId: set.exerciseId,
            exerciseName: exercise.name,
            weight: set.weight,
            date: set.date,
            setNumber: set.setNumber,
            reps: set.reps,
          };

          const existingIndex = client.personalRecords.findIndex(pr => pr.exerciseId === set.exerciseId);
          if (existingIndex >= 0) {
            client.personalRecords[existingIndex] = newPR;
          } else {
            client.personalRecords.push(newPR);
          }
        }
      }
    });
  };

  const saveSession = () => {
    const allSets: WorkoutSet[] = [];
    let totalPRs = 0;

    exerciseEntries.forEach(entry => {
      entry.sets.forEach(set => {
        if (set.reps && set.weight) {
          const weightNum = parseFloat(set.weight);
          const isPR = checkForPR(entry.exerciseId, weightNum);
          
          if (isPR) totalPRs++;

          const workoutSet: WorkoutSet = {
            id: `${Date.now()}-${entry.exerciseId}-${set.setNumber}`,
            exerciseId: entry.exerciseId,
            setNumber: set.setNumber,
            reps: parseInt(set.reps),
            weight: weightNum,
            date: new Date().toISOString().split('T')[0],
            isPB: isPR,
          };
          
          allSets.push(workoutSet);
        }
      });
    });

    if (allSets.length === 0) {
      toast({
        title: "No Sets to Save",
        description: "Complete at least one set before saving your session.",
        variant: "destructive",
      });
      return;
    }

    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      clientId: client.id,
      date: new Date().toISOString().split('T')[0],
      sets: allSets,
      notes: sessionNotes.trim() || undefined,
    };

    updatePersonalRecords(allSets);
    client.workoutHistory.push(newSession);

    toast({
      title: "Session Saved!",
      description: `Saved ${allSets.length} sets for ${client.name}${totalPRs > 0 ? ` with ${totalPRs} new PR${totalPRs > 1 ? 's' : ''}!` : '.'}`,
    });

    setExerciseEntries([]);
    setSessionNotes('');
  };

  const getExercise = (exerciseId: string) => {
    return initialExercises.find(ex => ex.id === exerciseId);
  };

  const getTotalCompletedSets = () => {
    return exerciseEntries.reduce((total, entry) => {
      return total + entry.sets.filter(set => set.reps && set.weight).length;
    }, 0);
  };

  const getTotalPotentialPRs = () => {
    return exerciseEntries.reduce((total, entry) => {
      const currentPR = getCurrentPR(entry.exerciseId);
      return total + entry.sets.filter(set => {
        const weight = parseFloat(set.weight);
        return set.weight && (!currentPR || weight > currentPR);
      }).length;
    }, 0);
  };

  const existingExerciseIds = exerciseEntries.map(entry => entry.exerciseId);

  return (
    <div className="space-y-6">
      <ExerciseSelector 
        onExerciseAdd={addExerciseToSession}
        existingExerciseIds={existingExerciseIds}
      />

      {exerciseEntries.length > 0 && (
        <SessionSummary 
          totalCompletedSets={getTotalCompletedSets()}
          totalPotentialPRs={getTotalPotentialPRs()}
          onSaveSession={saveSession}
        />
      )}

      <div className="space-y-4">
        {exerciseEntries.map((entry) => {
          const exercise = getExercise(entry.exerciseId);
          const currentPR = getCurrentPR(entry.exerciseId);
          
          return (
            <div key={entry.exerciseId} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExerciseFromSession(entry.exerciseId)}
                className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
              <IndividualSetEntry
                exerciseName={exercise?.name || 'Unknown Exercise'}
                currentPR={currentPR}
                onSetsChange={(sets) => updateExerciseSets(entry.exerciseId, sets)}
                isCollapsed={entry.collapsed}
                onToggleCollapse={() => toggleExerciseCollapse(entry.exerciseId)}
              />
            </div>
          );
        })}
      </div>

      {exerciseEntries.length > 0 && (
        <SessionNotes 
          notes={sessionNotes}
          onNotesChange={setSessionNotes}
        />
      )}

      {exerciseEntries.length === 0 && (
        <SessionEmptyState clientName={client.name} />
      )}
    </div>
  );
};

export default SessionLogger;
