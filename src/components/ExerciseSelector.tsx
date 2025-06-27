
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExerciseSelectorProps {
  onExerciseAdd: (exerciseId: string) => void;
  existingExerciseIds: string[];
}

const ExerciseSelector = ({ onExerciseAdd, existingExerciseIds }: ExerciseSelectorProps) => {
  const [selectedExercise, setSelectedExercise] = useState('');

  const handleAddExercise = () => {
    if (!selectedExercise) {
      toast({
        title: "No Exercise Selected",
        description: "Please select an exercise first.",
        variant: "destructive",
      });
      return;
    }

    if (existingExerciseIds.includes(selectedExercise)) {
      toast({
        title: "Exercise Already Added",
        description: "This exercise is already in your current session.",
        variant: "destructive",
      });
      return;
    }

    onExerciseAdd(selectedExercise);
    setSelectedExercise('');

    const exercise = initialExercises.find(ex => ex.id === selectedExercise);
    toast({
      title: "Exercise Added",
      description: `${exercise?.name} has been added to your session.`,
    });
  };

  return (
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

        <Button onClick={handleAddExercise} className="w-full" disabled={!selectedExercise}>
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise to Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseSelector;
