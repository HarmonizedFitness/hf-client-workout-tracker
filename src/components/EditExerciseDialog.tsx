
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Exercise } from '@/types/exercise';
import { toast } from '@/hooks/use-toast';

interface EditExerciseDialogProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  muscleGroups: string[];
  forceTypes: string[];
}

const EditExerciseDialog = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onSave, 
  muscleGroups, 
  forceTypes 
}: EditExerciseDialogProps) => {
  const [editedExercise, setEditedExercise] = useState<{
    name: string;
    muscleGroup: Exercise['muscleGroup'] | '';
    forceType: Exercise['forceType'] | '';
    notes: string;
  }>({
    name: '',
    muscleGroup: '',
    forceType: '',
    notes: ''
  });

  useEffect(() => {
    if (exercise) {
      setEditedExercise({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        forceType: exercise.forceType,
        notes: exercise.notes || ''
      });
    }
  }, [exercise]);

  const handleSave = () => {
    if (!exercise || !editedExercise.name.trim() || !editedExercise.muscleGroup || !editedExercise.forceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in exercise name, muscle group, and force type.",
        variant: "destructive",
      });
      return;
    }

    const updatedExercise: Exercise = {
      ...exercise,
      name: editedExercise.name.trim(),
      muscleGroup: editedExercise.muscleGroup as Exercise['muscleGroup'],
      forceType: editedExercise.forceType as Exercise['forceType'],
      notes: editedExercise.notes.trim() || undefined
    };

    onSave(updatedExercise);
    onClose();
    
    toast({
      title: "Exercise Updated",
      description: `${updatedExercise.name} has been updated successfully.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-exercise-name">Exercise Name *</Label>
            <Input
              id="edit-exercise-name"
              value={editedExercise.name}
              onChange={(e) => setEditedExercise({...editedExercise, name: e.target.value})}
              placeholder="Enter exercise name..."
            />
          </div>

          <div>
            <Label htmlFor="edit-muscle-group">Muscle Group *</Label>
            <Select 
              value={editedExercise.muscleGroup} 
              onValueChange={(value) => setEditedExercise({...editedExercise, muscleGroup: value as Exercise['muscleGroup']})}
            >
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
            <Label htmlFor="edit-force-type">Force Type *</Label>
            <Select 
              value={editedExercise.forceType} 
              onValueChange={(value) => setEditedExercise({...editedExercise, forceType: value as Exercise['forceType']})}
            >
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
            <Label htmlFor="edit-exercise-notes">Notes (Optional)</Label>
            <Textarea
              id="edit-exercise-notes"
              value={editedExercise.notes}
              onChange={(e) => setEditedExercise({...editedExercise, notes: e.target.value})}
              placeholder="Add any notes about this exercise..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditExerciseDialog;
