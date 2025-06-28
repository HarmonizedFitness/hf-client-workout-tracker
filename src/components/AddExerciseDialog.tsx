
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const muscleGroups = ['Back', 'Chest', 'Quads', 'Hamstrings', 'Glutes', 'Shoulders', 'Arms (Biceps)', 'Arms (Triceps)', 'Calves', 'Core', 'Abdominals', 'Hip Abductors', 'Hips'];
const forceTypes = ['Pull', 'Push', 'Squat', 'Raise', 'Static', 'Squeeze', 'Rotate', 'Twist', 'Stretch', 'Hold'];

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExercise: (exercise: {
    name: string;
    forceType: string;
    muscleGroup: string;
    notes?: string;
  }) => void;
  isLoading: boolean;
}

const AddExerciseDialog = ({ open, onOpenChange, onAddExercise, isLoading }: AddExerciseDialogProps) => {
  const [exerciseName, setExerciseName] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedForceType, setSelectedForceType] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!exerciseName.trim() || !selectedMuscleGroup || !selectedForceType) return;

    onAddExercise({
      name: exerciseName.trim(),
      forceType: selectedForceType,
      muscleGroup: selectedMuscleGroup,
      notes: notes.trim() || undefined,
    });

    // Clear form
    setExerciseName('');
    setSelectedMuscleGroup('');
    setSelectedForceType('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription>
            Create a custom exercise for your library
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Enter exercise name..."
            />
          </div>
          
          <div>
            <Label htmlFor="muscle-group">Muscle Group</Label>
            <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select muscle group..." />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="force-type">Force Type</Label>
            <Select value={selectedForceType} onValueChange={setSelectedForceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select force type..." />
              </SelectTrigger>
              <SelectContent>
                {forceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this exercise..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!exerciseName.trim() || !selectedMuscleGroup || !selectedForceType || isLoading}
          >
            {isLoading ? "Adding..." : "Add Exercise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseDialog;
