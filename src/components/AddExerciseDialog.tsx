
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const muscleGroups = [
  'Back', 'Chest', 'Quads', 'Hamstrings', 'Glutes', 'Shoulders', 
  'Arms (Biceps)', 'Arms (Triceps)', 'Biceps', 'Triceps', 'Calves', 
  'Core', 'Abdominals', 'Hip Abductors', 'Hips', 'Forearms', 'Traps', 
  'Lats', 'Other'
];

const forceTypes = [
  'Pull', 'Push', 'Squat', 'Raise', 'Static', 'Squeeze', 
  'Rotate', 'Twist', 'Stretch', 'Hold', 'Other'
];

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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!exerciseName.trim()) {
      newErrors.name = 'Exercise name is required';
    }
    if (!selectedMuscleGroup) {
      newErrors.muscleGroup = 'Muscle group is required';
    }
    if (!selectedForceType) {
      newErrors.forceType = 'Force type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log('Submitting exercise with data:', {
      name: exerciseName.trim(),
      forceType: selectedForceType,
      muscleGroup: selectedMuscleGroup,
      notes: notes.trim() || undefined,
    });

    // Call the mutation function
    onAddExercise({
      name: exerciseName.trim(),
      forceType: selectedForceType,
      muscleGroup: selectedMuscleGroup,
      notes: notes.trim() || undefined,
    });

    // Reset form after submission attempt
    resetForm();
  };

  const resetForm = () => {
    setExerciseName('');
    setSelectedMuscleGroup('');
    setSelectedForceType('');
    setNotes('');
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const isFormValid = exerciseName.trim() && selectedMuscleGroup && selectedForceType;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Custom Exercise</DialogTitle>
          <DialogDescription>
            Create a custom exercise for your personal library
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="exercise-name" className="text-base">
              Exercise Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="exercise-name"
              value={exerciseName}
              onChange={(e) => {
                setExerciseName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
              placeholder="Enter exercise name..."
              className={`h-12 mt-2 ${errors.name ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="muscle-group" className="text-base">
              Muscle Group <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedMuscleGroup} 
              onValueChange={(value) => {
                setSelectedMuscleGroup(value);
                if (errors.muscleGroup) {
                  setErrors(prev => ({ ...prev, muscleGroup: '' }));
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className={`h-12 mt-2 ${errors.muscleGroup ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select muscle group..." />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map(group => (
                  <SelectItem key={group} value={group} className="py-3">
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.muscleGroup && (
              <p className="text-red-500 text-sm mt-1">{errors.muscleGroup}</p>
            )}
          </div>

          <div>
            <Label htmlFor="force-type" className="text-base">
              Force Type <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedForceType} 
              onValueChange={(value) => {
                setSelectedForceType(value);
                if (errors.forceType) {
                  setErrors(prev => ({ ...prev, forceType: '' }));
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className={`h-12 mt-2 ${errors.forceType ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select force type..." />
              </SelectTrigger>
              <SelectContent>
                {forceTypes.map(type => (
                  <SelectItem key={type} value={type} className="py-3">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.forceType && (
              <p className="text-red-500 text-sm mt-1">{errors.forceType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes" className="text-base">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this exercise..."
              rows={3}
              className="mt-2"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)} 
            className="h-12"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !isFormValid}
            className="h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Exercise"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseDialog;
