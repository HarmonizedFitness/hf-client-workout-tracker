
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useClient } from '@/context/ClientContext';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '@/types/exercise';
import { toast } from '@/hooks/use-toast';

interface CreateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExercises: Exercise[];
  onClearSelection: () => void;
}

const muscleGroups = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Push',
  'Pull',
  'Legs',
  'Back',
  'Chest',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio'
];

const CreateWorkoutDialog = ({ open, onOpenChange, selectedExercises, onClearSelection }: CreateWorkoutDialogProps) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const { createTemplate, isCreatingTemplate } = useWorkoutTemplates();
  const { activeClients } = useSupabaseClients();
  const { setSelectedClient } = useClient();
  const navigate = useNavigate();

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMuscleGroup) {
      toast({
        title: "Error", 
        description: "Please select a muscle group category.",
        variant: "destructive",
      });
      return;
    }

    const exerciseIds = selectedExercises.map(ex => ex.id);
    
    try {
      // Create the workout template
      await createTemplate({
        name: workoutName,
        description: workoutDescription.trim() || undefined,
        exercise_ids: exerciseIds,
        muscle_group: selectedMuscleGroup,
      });

      // If a client is selected, navigate to session with pre-populated exercises
      if (selectedClientId) {
        const client = activeClients.find(c => c.id === selectedClientId);
        if (client) {
          setSelectedClient(client);
          navigate(`/session?exercises=${exerciseIds.join(',')}`);
        }
      }

      // Clear form and close dialog
      setWorkoutName('');
      setWorkoutDescription('');
      setSelectedMuscleGroup('');
      setSelectedClientId('');
      onClearSelection();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating workout template:', error);
      toast({
        title: "Error",
        description: "Failed to create workout template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Workout</DialogTitle>
          <DialogDescription>
            Create a workout template with {selectedExercises.length} selected exercises
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name *</Label>
            <Input
              id="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name..."
            />
          </div>

          <div>
            <Label htmlFor="muscle-group">Primary Muscle Group *</Label>
            <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select muscle group category..." />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="workout-description">Description (Optional)</Label>
            <Textarea
              id="workout-description"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              placeholder="Describe this workout..."
              rows={3}
            />
          </div>

          <div>
            <Label>Selected Exercises ({selectedExercises.length})</Label>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {selectedExercises.map(exercise => (
                <Badge key={exercise.id} variant="secondary" className="text-xs">
                  {exercise.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="client-select">Start Session With Client (Optional)</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client to start session..." />
              </SelectTrigger>
              <SelectContent>
                {activeClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <span>{client.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {client.training_days_per_week}x/week
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateWorkout} 
            disabled={!workoutName.trim() || !selectedMuscleGroup || isCreatingTemplate}
          >
            {isCreatingTemplate ? "Creating..." : "Create Workout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkoutDialog;
