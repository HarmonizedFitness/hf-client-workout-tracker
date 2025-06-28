
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
import { useTrainer } from '@/hooks/useTrainer';
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
  const { trainer } = useTrainer();
  const navigate = useNavigate();

  const handleCreateWorkout = async () => {
    console.log('=== CREATE WORKOUT DIALOG DEBUG ===');
    console.log('1. Form data:', {
      name: workoutName,
      description: workoutDescription,
      muscle_group: selectedMuscleGroup,
      exercise_count: selectedExercises.length,
      client_id: selectedClientId,
      trainer: trainer
    });

    console.log('2. Selected exercises:', selectedExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      idType: typeof ex.id,
      idLength: ex.id.length
    })));

    // Enhanced validation with detailed logging
    if (!trainer?.id) {
      console.error('CRITICAL: No trainer found in CreateWorkoutDialog');
      toast({
        title: "Authentication Error",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!workoutName.trim()) {
      console.log('Validation failed: No workout name');
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMuscleGroup) {
      console.log('Validation failed: No muscle group selected');
      toast({
        title: "Error", 
        description: "Please select a muscle group category.",
        variant: "destructive",
      });
      return;
    }

    if (selectedExercises.length === 0) {
      console.log('Validation failed: No exercises selected');
      toast({
        title: "Error",
        description: "Please select at least one exercise.",
        variant: "destructive",
      });
      return;
    }

    const exerciseIds = selectedExercises.map(ex => ex.id);
    console.log('3. Exercise IDs to be saved:', exerciseIds);

    // Validate that all exercise IDs are properly formatted
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalidIds = exerciseIds.filter(id => !uuidRegex.test(id));
    
    if (invalidIds.length > 0) {
      console.error('CRITICAL: Invalid UUID format detected:', invalidIds);
      toast({
        title: "Error",
        description: "Invalid exercise data detected. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('4. Attempting to create workout template...');
      
      // Create the workout template
      await createTemplate({
        name: workoutName,
        description: workoutDescription.trim() || undefined,
        exercise_ids: exerciseIds,
        muscle_group: selectedMuscleGroup,
      });

      console.log('5. Workout template created successfully!');

      // If a client is selected, navigate to session with pre-populated exercises
      if (selectedClientId && selectedClientId !== 'none') {
        const client = activeClients.find(c => c.id === selectedClientId);
        if (client) {
          console.log('6. Setting selected client and navigating to session:', client.name);
          setSelectedClient(client);
          navigate(`/session?exercises=${exerciseIds.join(',')}`);
          
          toast({
            title: "Workout Created & Session Started",
            description: `"${workoutName}" has been created and session started for ${client.name}.`,
          });
        }
      } else {
        console.log('6. No client selected, staying on current page');
        toast({
          title: "Workout Created",
          description: `"${workoutName}" has been saved to your workout templates.`,
        });
      }

      // Clear form and close dialog
      setWorkoutName('');
      setWorkoutDescription('');
      setSelectedMuscleGroup('');
      setSelectedClientId('');
      onClearSelection();
      onOpenChange(false);
      
    } catch (error) {
      console.error('7. Error in handleCreateWorkout:', error);
      // Error handling is now done in the mutation's onError callback
    }
  };

  // Show loading state if trainer is not loaded yet
  if (!trainer) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>
              Please wait while we load your trainer information.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

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
                <SelectItem value="none">Save template only</SelectItem>
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
            disabled={!workoutName.trim() || !selectedMuscleGroup || selectedExercises.length === 0 || isCreatingTemplate || !trainer}
          >
            {isCreatingTemplate ? "Creating..." : "Create Workout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkoutDialog;
