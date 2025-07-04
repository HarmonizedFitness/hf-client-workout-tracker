
import { toast } from '@/hooks/use-toast';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { Client } from '@/types/exercise';
import { ExerciseEntry } from './useSessionState';

interface UseSessionOperationsProps {
  client: Client;
  exerciseEntries: ExerciseEntry[];
  sessionNotes: string;
  setIsSaving: (saving: boolean) => void;
  checkAndSavePRs: (
    clientId: string,
    exerciseId: string,
    weight: number,
    reps: number,
    setNumber: number,
    date: string,
    sessionId?: string
  ) => Promise<boolean>;
}

export const useSessionOperations = ({
  client,
  exerciseEntries,
  sessionNotes,
  setIsSaving,
  checkAndSavePRs,
}: UseSessionOperationsProps) => {
  const { saveSession, isSavingSession } = useWorkoutSessions();

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
        position: number;
        circuitId?: string;
        exerciseNotes?: string;
      }> = [];

      const today = new Date().toISOString().split('T')[0];

      // Collect all completed sets with enhanced fields
      for (const entry of exerciseEntries) {
        for (const set of entry.sets) {
          if (set.reps && set.weight) {
            const reps = parseInt(set.reps);
            const weightInLbs = parseFloat(set.weight);
            
            completedSets.push({
              exerciseId: entry.exerciseId,
              setNumber: set.setNumber,
              reps,
              weight: weightInLbs,
              isPR: false, // We'll update this after checking PRs
              position: entry.position,
              circuitId: entry.circuitId,
              exerciseNotes: entry.exerciseNotes?.trim() || undefined,
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
        return false;
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
          set.weight,
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

      toast({
        title: "Session Saved!",
        description: `Saved ${completedSets.length} sets for ${client.name}${totalPRs > 0 ? ` with ${totalPRs} new PR${totalPRs > 1 ? 's' : ''}!` : '.'}`,
      });

      return true;

    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error Saving Session",
        description: "There was an error saving your workout session. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSaveSession,
    isSavingSession,
  };
};
