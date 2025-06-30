
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell } from 'lucide-react';
import { Exercise } from '@/types/exercise';
import ExerciseFilters from '@/components/ExerciseFilters';
import ExerciseGrid from '@/components/ExerciseGrid';
import BulkActionsBar from '@/components/BulkActionsBar';
import AddExerciseDialog from '@/components/AddExerciseDialog';
import EditExerciseDialog from '@/components/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/DeleteExerciseDialog';
import CreateWorkoutDialog from '@/components/CreateWorkoutDialog';
import PageLayout from '@/components/PageLayout';
import { useExercises } from '@/hooks/useExercises';

// Updated to include all possible values from your 1,200+ exercises
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

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedForceTypes, setSelectedForceTypes] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateWorkoutDialog, setShowCreateWorkoutDialog] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  
  const { 
    allExercises, 
    addExercise, 
    isAddingExercise, 
    toggleFavorite, 
    isTogglingFavorite, 
    updateExercise, 
    isUpdatingExercise, 
    deleteExercise, 
    isDeletingExercise,
    isLoading
  } = useExercises();

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroups.length === 0 || 
      selectedMuscleGroups.some(group => 
        exercise.muscleGroup.toLowerCase().includes(group.toLowerCase()) ||
        group.toLowerCase().includes(exercise.muscleGroup.toLowerCase())
      );
    const matchesForceType = selectedForceTypes.length === 0 || 
      selectedForceTypes.some(type => 
        exercise.forceType.toLowerCase().includes(type.toLowerCase()) ||
        type.toLowerCase().includes(exercise.forceType.toLowerCase())
      );
    const matchesFavorites = !showFavorites || exercise.isFavorite === true;
    
    return matchesSearch && matchesMuscleGroup && matchesForceType && matchesFavorites;
  });

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const isSelected = selectedExercises.some(ex => ex.id === exerciseId);
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleToggleFavorite = (exerciseId: string) => {
    console.log('Toggling favorite for exercise ID:', exerciseId);
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    console.log('Found exercise:', exercise?.name);
    toggleFavorite(exerciseId);
  };

  const handleEditExercise = (exercise: Exercise) => {
    // Only allow editing of custom exercises created by trainer
    if (exercise.createdByTrainerId) {
      setExerciseToEdit(exercise);
      setShowEditDialog(true);
    }
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    // Only allow deleting of custom exercises created by trainer
    if (exercise.createdByTrainerId) {
      setExerciseToDelete(exercise);
      setShowDeleteDialog(true);
    }
  };

  const handleSelectAll = () => {
    setSelectedExercises(filteredExercises);
  };

  const handleClearSelection = () => {
    setSelectedExercises([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedMuscleGroups([]);
    setSelectedForceTypes([]);
    setShowFavorites(false);
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

  const handleUpdateExercise = (exercise: Exercise) => {
    updateExercise({
      id: exercise.id,
      name: exercise.name,
      force_type: exercise.forceType,
      muscle_group: exercise.muscleGroup,
      notes: exercise.notes,
    });
    setShowEditDialog(false);
    setExerciseToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (exerciseToDelete) {
      deleteExercise(exerciseToDelete.id);
      setShowDeleteDialog(false);
      setExerciseToDelete(null);
    }
  };

  const selectedExerciseIds = new Set(selectedExercises.map(ex => ex.id));
  const favoritesCount = allExercises.filter(ex => ex.isFavorite === true).length;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Dumbbell className="h-12 w-12 text-burnt-orange mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading exercises...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
          <p className="text-muted-foreground">Browse and manage your exercise collection</p>
          <p className="text-sm text-muted-foreground mt-2">
            {allExercises.length} total exercises
            {favoritesCount > 0 && (
              <span className="ml-2">• {favoritesCount} favorite{favoritesCount !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setShowAddDialog(true)} disabled={isAddingExercise}>
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Exercise
          </Button>
        </div>

        <ExerciseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedMuscleGroups={selectedMuscleGroups}
          onMuscleGroupsChange={setSelectedMuscleGroups}
          selectedForceTypes={selectedForceTypes}
          onForceTypesChange={setSelectedForceTypes}
          showFavorites={showFavorites}
          onShowFavoritesChange={setShowFavorites}
          totalExercises={allExercises.length}
          filteredCount={filteredExercises.length}
        />

        <BulkActionsBar
          selectedCount={selectedExercises.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onCreateWorkout={handleCreateWorkout}
        />

        <ExerciseGrid
          exercises={filteredExercises}
          selectedExercises={selectedExerciseIds}
          onSelectExercise={handleSelectExercise}
          onToggleFavorite={handleToggleFavorite}
          onEditExercise={handleEditExercise}
          onDeleteExercise={handleDeleteExercise}
          onClearFilters={handleClearFilters}
          totalCount={allExercises.length}
        />

        <AddExerciseDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddExercise={handleAddExercise}
          isLoading={isAddingExercise}
        />

        <EditExerciseDialog
          exercise={exerciseToEdit}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setExerciseToEdit(null);
          }}
          onSave={handleUpdateExercise}
          muscleGroups={muscleGroups}
          forceTypes={forceTypes}
        />

        <DeleteExerciseDialog
          exercise={exerciseToDelete}
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setExerciseToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeletingExercise}
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
