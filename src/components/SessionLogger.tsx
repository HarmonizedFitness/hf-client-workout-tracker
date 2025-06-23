
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { WorkoutSet } from '@/types/exercise';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SessionLogger = () => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sessionSets, setSessionSets] = useState<WorkoutSet[]>([]);

  const exercise = initialExercises.find(ex => ex.id === selectedExercise);

  const addSet = () => {
    if (!selectedExercise || !sets || !reps || !weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before adding a set.",
        variant: "destructive",
      });
      return;
    }

    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      exerciseId: selectedExercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
      date: new Date().toISOString().split('T')[0],
    };

    setSessionSets([...sessionSets, newSet]);
    
    // Clear form
    setSets('');
    setReps('');
    setWeight('');

    toast({
      title: "Set Added!",
      description: `${exercise?.name}: ${sets} sets × ${reps} reps @ ${weight}kg`,
    });
  };

  const removeSet = (setId: string) => {
    setSessionSets(sessionSets.filter(set => set.id !== setId));
    toast({
      title: "Set Removed",
      description: "The set has been removed from your session.",
    });
  };

  const saveSession = () => {
    if (sessionSets.length === 0) {
      toast({
        title: "No Sets to Save",
        description: "Add at least one set before saving your session.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save to a database
    console.log('Saving session:', sessionSets);
    
    toast({
      title: "Session Saved!",
      description: `Saved ${sessionSets.length} sets from your workout session.`,
    });

    setSessionSets([]);
  };

  const getExerciseFromSet = (set: WorkoutSet) => {
    return initialExercises.find(ex => ex.id === set.exerciseId);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selection and Set Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Exercise Set
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

          {exercise && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getMuscleGroupColor(exercise.muscleGroup)}>
                  {exercise.muscleGroup}
                </Badge>
                <Badge variant="outline">{exercise.forceType}</Badge>
              </div>
              {exercise.notes && (
                <p className="text-sm text-muted-foreground">{exercise.notes}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                type="number"
                placeholder="3"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                placeholder="10"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.5"
                placeholder="50"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <Button onClick={addSet} className="w-full" disabled={!selectedExercise}>
            <Plus className="h-4 w-4 mr-2" />
            Add Set to Session
          </Button>
        </CardContent>
      </Card>

      {/* Current Session */}
      {sessionSets.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Session ({sessionSets.length} sets)</CardTitle>
            <Button onClick={saveSession} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionSets.map((set, index) => {
                const exercise = getExerciseFromSet(set);
                return (
                  <div key={set.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{exercise?.name}</span>
                        <Badge className={`${getMuscleGroupColor(exercise?.muscleGroup || '')} text-xs`}>
                          {exercise?.muscleGroup}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {set.sets} sets × {set.reps} reps @ {set.weight}kg
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSet(set.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {sessionSets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No sets logged yet for this session.</p>
            <p className="text-sm text-muted-foreground">Select an exercise above and start tracking your workout!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionLogger;
