import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Client } from '@/types/exercise';
import IndividualSetEntry from './IndividualSetEntry';
import ExerciseSelector from './ExerciseSelector';
import SessionSummary from './SessionSummary';
import SessionNotes from './SessionNotes';
import SessionEmptyState from './SessionEmptyState';
import { toast } from '@/hooks/use-toast';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { usePersonalRecords } from '@/hooks/usePersonalRecords';
import { lbsToKg, kgToLbs } from '@/utils/weightConversions';

interface SessionLoggerProps {
  client: Client;
  preSelectedExercises?: string[];
  workoutTemplateId?: string | null;
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

const SessionLogger = ({ client, preSelectedExercises = [], workoutTemplateId }: SessionLoggerProps) => {
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { allExercises } = useExercises();
  const { saveSession, isSavingSession } = useWorkoutSessions();
  const { personalRecords, checkAndSavePRs } = usePersonalRecords(client.id);

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

  const getCurrentPR = (exerciseId: string): number | undefined => {
    const maxWeightPR = personalRecords
      .filter(pr => pr.exercise_id === exerciseId && pr.pr_type === 'single_weight')
      .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);
    
    return maxWeightPR > 0 ? maxWeightPR : undefined;
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
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    toast({
      title: "Exercise Removed",
      description: `${exercise?.name} has been removed from your session.`,
    });
  };

  const handleSaveSession = async () => {
    try {
      setIsSaving(true);
      console.log('Starting session save process...');

      const completedSets: Array<{
        exerciseId: string;
        setNumber: number;
        reps: number;
        weight: number;
        isPR: boolean;
      }> = [];

      const today = new Date().toISOString().split('T')[0];

      // First, collect all completed sets and convert weights from LBS to KG
      for (const entry of exerciseEntries) {
        for (const set of entry.sets) {
          if (set.reps && set.weight) {
            const reps = parseInt(set.reps);
            const weightInLbs = parseFloat(set.weight);
            const weightInKg = lbsToKg(weightInLbs); // Convert to KG for database storage
            
            completedSets.push({
              exerciseId: entry.exerciseId,
              setNumber: set.setNumber,
              reps,
              weight: weightInKg, // Store in KG
              isPR: false, // We'll update this after checking PRs
            });
          }
        }
      }

      if (completedSets.length === 0) {
        toast({
          title: "No Sets to Save",
          description: "Complete at least one set before saving your session.",
          variant: "destructive",
        });
        return;
      }

      console.log('Completed sets collected:', completedSets);

      // Save the session first (without PR flags)
      const session = await saveSession({
        clientId: client.id,
        date: today,
        sets: completedSets,
        notes: sessionNotes.trim() || undefined,
      });

      console.log('Session saved, now checking PRs...');

      // Now check and save PRs with the session ID
      let totalPRs = 0;
      const updatedSets = [...completedSets];

      for (let i = 0; i < completedSets.length; i++) {
        const set = completedSets[i];
        const hasPR = await checkAndSavePRs(
          client.id,
          set.exerciseId,
          set.weight, // Already in KG
          set.reps,
          set.setNumber,
          today,
          session.id
        );
        
        if (hasPR) {
          totalPRs++;
          updatedSets[i].isPR = true;
        }
      }

      console.log('PR checking complete, total PRs:', totalPRs);

      // Clear the form after successful save
      setExerciseEntries([]);
      setSessionNotes('');

      toast({
        title: "Session Saved!",
        description: `Saved ${completedSets.length} sets for ${client.name}${totalPRs > 0 ? ` with ${totalPRs} new PR${totalPRs > 1 ? 's' : ''}!` : '.'}`,
      });

    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error Saving Session",
        description: "There was an error saving your workout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getExercise = (exerciseId: string) => {
    return allExercises.find(ex => ex.id === exerciseId);
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
        const weightInLbs = parseFloat(set.weight);
        return set.weight && (!currentPR || weightInLbs > kgToLbs(currentPR));
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
          onSaveSession={handleSaveSession}
          isLoading={isSaving || isSavingSession}
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

      {exerciseEntries.length === 0 && !preSelectedExercises.length && (
        <SessionEmptyState clientName={client.name} />
      )}
    </div>
  );
};

export default SessionLogger;
