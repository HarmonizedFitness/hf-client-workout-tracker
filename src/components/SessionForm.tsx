
import { Button } from "@/components/ui/button";
import { Client } from '@/types/exercise';
import ExerciseSelector from './ExerciseSelector';
import SessionSummary from './SessionSummary';
import SessionNotes from './SessionNotes';
import SessionEmptyState from './SessionEmptyState';
import ExerciseReorderContainer from './ExerciseReorderContainer';
import { useSessionState } from '@/hooks/useSessionState';
import { useSessionHandlers } from '@/hooks/useSessionHandlers';

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
    selectedExercises,
    setSelectedExercises,
    getNextPosition,
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
    getNextPosition,
  });

  const onSaveSession = async () => {
    const success = await handleSaveSession();
    if (success) {
      // Clear the form after successful save
      setExerciseEntries([]);
      setSessionNotes('');
      setSelectedExercises(new Set());
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

      {exerciseEntries.length > 0 ? (
        <ExerciseReorderContainer
          exerciseEntries={exerciseEntries}
          setExerciseEntries={setExerciseEntries}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
          onUpdateExerciseSets={updateExerciseSets}
          onToggleExerciseCollapse={toggleExerciseCollapse}
          onRemoveExercise={removeExerciseFromSession}
          getCurrentPR={getCurrentPR}
          getExercise={getExercise}
        />
      ) : !preSelectedExercises.length && (
        <SessionEmptyState clientName={client.name} />
      )}

      {exerciseEntries.length > 0 && (
        <SessionNotes 
          notes={sessionNotes}
          onNotesChange={setSessionNotes}
        />
      )}
    </div>
  );
};

export default SessionForm;
