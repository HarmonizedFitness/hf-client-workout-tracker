
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { WorkoutSet, WorkoutSession, Client, PersonalRecord } from '@/types/exercise';
import IndividualSetEntry from './IndividualSetEntry';
import { Plus, Save, Trophy, Clock, Target } from 'lucide-react';
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
}

const SessionLogger = ({ client }: SessionLoggerProps) => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');

  const getCurrentPR = (exerciseId: string): number | undefined => {
    const pr = client.personalRecords.find(pr => pr.exerciseId === exerciseId);
    return pr?.weight;
  };

  const addExerciseToSession = () => {
    if (!selectedExercise) {
      toast({
        title: "No Exercise Selected",
        description: "Please select an exercise first.",
        variant: "destructive",
      });
      return;
    }

    if (exerciseEntries.find(entry => entry.exerciseId === selectedExercise)) {
      toast({
        title: "Exercise Already Added",
        description: "This exercise is already in your current session.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: ExerciseEntry = {
      exerciseId: selectedExercise,
      sets: [
        { setNumber: 1, reps: '', weight: '' },
        { setNumber: 2, reps: '', weight: '' },
        { setNumber: 3, reps: '', weight: '' }
      ]
    };

    setExerciseEntries([...exerciseEntries, newEntry]);
    setSelectedExercise('');

    const exercise = initialExercises.find(ex => ex.id === selectedExercise);
    toast({
      title: "Exercise Added",
      description: `${exercise?.name} has been added to your session.`,
    });
  };

  const updateExerciseSets = (exerciseId: string, sets: IndividualSet[]) => {
    setExerciseEntries(exerciseEntries.map(entry => 
      entry.exerciseId === exerciseId ? { ...entry, sets } : entry
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
    // Convert exercise entries to workout sets
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

    // Reset form
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

  return (
    <div className="space-y-6">
      {/* Exercise Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Exercise to Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="exercise-select">Select Exercise</Label>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an exercise..." />
              </SelectTrigger>
              <SelectContent>
                {initialExercises.map(exercise => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    <div className="flex items-center gap-2">
                      <span>{exercise.name}</span>
                      <Badge className={`${getMuscleGroupColor(exercise.muscleGroup)} text-xs`}>
                        {exercise.muscleGroup}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addExerciseToSession} className="w-full" disabled={!selectedExercise}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise to Session
          </Button>
        </CardContent>
      </Card>

      {/* Current Session Overview */}
      {exerciseEntries.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Session
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {getTotalCompletedSets()} sets completed
                </div>
                {getTotalPotentialPRs() > 0 && (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    {getTotalPotentialPRs()} potential PR{getTotalPotentialPRs() > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={saveSession} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
          </CardHeader>
        </Card>
      )}

      {/* Exercise Entries */}
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
              />
            </div>
          );
        })}
      </div>

      {/* Session Notes */}
      {exerciseEntries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="session-notes">Session Notes (Optional)</Label>
              <Textarea
                id="session-notes"
                placeholder="Add any notes about this workout session..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {exerciseEntries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No exercises added to this session yet.</p>
            <p className="text-sm text-muted-foreground">Select an exercise above to start tracking {client.name}'s workout!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionLogger;
