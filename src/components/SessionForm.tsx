
import { Button } from "@/components/ui/button";
import { Client } from '@/types/exercise';
import IndividualSetEntry from './IndividualSetEntry';
import ExerciseSelector from './ExerciseSelector';
import SessionSummary from './SessionSummary';
import SessionNotes from './SessionNotes';
import SessionEmptyState from './SessionEmptyState';
import { useSessionState } from '@/hooks/useSessionState';
import { useSessionHandlers } from '@/hooks/useSessionHandlers';
import { X } from 'lucide-react';

interface SessionFormProps {
  client: Client;
  preSelectedExercises?: string[];
  workoutTemplateId?: string | null;
}

const SessionForm = ({ client, preSelectedExercises = [], workoutTemplateId }: SessionFormProps) => {
  const {
    exerciseEntries,
    setExerciseEntries,
    sessionNotes,
    setSessionNotes,
    isSaving,
    setIsSaving,
  } = useSessionState({ preSelectedExercises });

  const {
    getCurrentPR,
    addExerciseToSession,
    updateExerciseSets,
    toggleExerciseCollapse,
    removeExerciseFromSession,
    handleSaveSession,
    getExercise,
    getTotalCompletedSets,
    getTotalPotentialPRs,
    isSavingSession,
  } = useSessionHandlers({
    client,
    exerciseEntries,
    setExerciseEntries,
    sessionNotes,
    setIsSaving,
  });

  const onSaveSession = async () => {
    const success = await handleSaveSession();
    if (success) {
      // Clear the form after successful save
      setExerciseEntries([]);
      setSessionNotes('');
    }
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
          onSaveSession={onSaveSession}
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
                className="absolute top-3 right-3 z-10 text-red-600 hover:text-red-700 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
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

export default SessionForm;
