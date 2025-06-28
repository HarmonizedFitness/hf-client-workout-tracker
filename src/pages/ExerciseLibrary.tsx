import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell } from 'lucide-react';
import { initialExercises } from '@/data/exerciseData';
import { Exercise } from '@/types/exercise';
import ExerciseLibraryHeader from '@/components/ExerciseLibraryHeader';
import ExerciseFilters from '@/components/ExerciseFilters';
import ExerciseGrid from '@/components/ExerciseGrid';
import BulkActionsBar from '@/components/BulkActionsBar';
import AddExerciseDialog from '@/components/AddExerciseDialog';
import CreateWorkoutDialog from '@/components/CreateWorkoutDialog';
import PageLayout from '@/components/PageLayout';
import { useExercises } from '@/hooks/useExercises';

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedForceTypes, setSelectedForceTypes] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCreateWorkoutDialog, setShowCreateWorkoutDialog] = useState(false);
  
  const { allExercises, addExercise, isAddingExercise } = useExercises();

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroups.length === 0 || selectedMuscleGroups.includes(exercise.muscleGroup);
    const matchesForceType = selectedForceTypes.length === 0 || selectedForceTypes.includes(exercise.forceType);
    
    return matchesSearch && matchesMuscleGroup && matchesForceType;
  });

  const handleExerciseToggle = (exercise: Exercise, isSelected: boolean) => {
    if (isSelected) {
      setSelectedExercises([...selectedExercises, exercise]);
    } else {
      setSelectedExercises(selectedExercises.filter(e => e.id !== exercise.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedExercises(filteredExercises);
  };

  const handleClearSelection = () => {
    setSelectedExercises([]);
  };

  const handleCreateWorkout = () => {
    setShowCreateWorkoutDialog(true);
  };

  const handleAddExercise = (exerciseData: {
    name: string;
    forceType: string;
    muscleGroup: string;
    notes?: string;
  }) => {
    addExercise({
      name: exerciseData.name,
      force_type: exerciseData.forceType,
      muscle_group: exerciseData.muscleGroup,
      notes: exerciseData.notes,
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
          <p className="text-muted-foreground">Browse and manage your exercise collection</p>
        </div>

        <div className="flex justify-between items-center">
          <ExerciseLibraryHeader />
          <Button onClick={() => setShowAddDialog(true)} disabled={isAddingExercise}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        <ExerciseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedMuscleGroups={selectedMuscleGroups}
          onMuscleGroupsChange={setSelectedMuscleGroups}
          selectedForceTypes={selectedForceTypes}
          onForceTypesChange={setSelectedForceTypes}
          totalExercises={allExercises.length}
          filteredCount={filteredExercises.length}
        />

        {selectedExercises.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedExercises.length}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onCreateWorkout={handleCreateWorkout}
          />
        )}

        <ExerciseGrid
          exercises={filteredExercises}
          selectedExercises={selectedExercises}
          onExerciseToggle={handleExerciseToggle}
        />

        <AddExerciseDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddExercise={handleAddExercise}
          isLoading={isAddingExercise}
        />

        <CreateWorkoutDialog
          open={showCreateWorkoutDialog}
          onOpenChange={setShowCreateWorkoutDialog}
          selectedExercises={selectedExercises}
          onClearSelection={handleClearSelection}
        />
      </div>
    </PageLayout>
  );
};

export default ExerciseLibrary;
