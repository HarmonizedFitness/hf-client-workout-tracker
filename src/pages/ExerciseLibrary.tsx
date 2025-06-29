import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell, RotateCcw } from 'lucide-react';
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

const muscleGroups = ['Back', 'Chest', 'Quads', 'Hamstrings', 'Glutes', 'Shoulders', 'Arms (Biceps)', 'Arms (Triceps)', 'Calves', 'Core', 'Abdominals', 'Hip Abductors', 'Hips'];
const forceTypes = ['Pull', 'Push', 'Squat', 'Raise', 'Static', 'Squeeze', 'Rotate', 'Twist', 'Stretch', 'Hold'];

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
    resetFavorites,
    isResettingFavorites
  } = useExercises();

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroups.length === 0 || selectedMuscleGroups.includes(exercise.muscleGroup);
    const matchesForceType = selectedForceTypes.length === 0 || selectedForceTypes.includes(exercise.forceType);
    // Fixed favorites filter - only show exercises that are actually favorited
    const matchesFavorites = !showFavorites || (exercise.isFavorite === true);
    
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
    setExerciseToEdit(exercise);
    setShowEditDialog(true);
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    setExerciseToDelete(exercise);
    setShowDeleteDialog(true);
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

  const handleResetFavorites = () => {
    resetFavorites();
  };

  // Create a Set of selected exercise IDs for ExerciseGrid
  const selectedExerciseIds = new Set(selectedExercises.map(ex => ex.id));

  // Count actual favorites for debugging
  const favoritesCount = allExercises.filter(ex => ex.isFavorite === true).length;

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
          <p className="text-muted-foreground">Browse and manage your exercise collection</p>
          {favoritesCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {favoritesCount} exercise{favoritesCount !== 1 ? 's' : ''} marked as favorite
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <Button 
            onClick={handleResetFavorites} 
            disabled={isResettingFavorites}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Favorites
          </Button>
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
