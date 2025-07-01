import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { Exercise } from '@/types/exercise';
import ExerciseGrid from '@/components/ExerciseGrid';
import ExerciseLibraryHeader from '@/components/ExerciseLibraryHeader';
import ExerciseLibraryFilters from '@/components/ExerciseLibraryFilters';
import ExerciseLibraryActions from '@/components/ExerciseLibraryActions';
import ExerciseLibraryDialogs from '@/components/ExerciseLibraryDialogs';
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
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedForceTypes, setSelectedForceTypes] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Selection state
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  
  // Dialog states
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

  // Filter exercises with improved favorites handling and alphabetical sorting
  const filteredExercises = allExercises
    .filter(exercise => {
      // Search term filter
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Muscle group filter
      const matchesMuscleGroup = selectedMuscleGroups.length === 0 || 
        selectedMuscleGroups.some(group => 
          exercise.muscleGroup.toLowerCase().includes(group.toLowerCase()) ||
          group.toLowerCase().includes(exercise.muscleGroup.toLowerCase())
        );
      
      // Force type filter
      const matchesForceType = selectedForceTypes.length === 0 || 
        selectedForceTypes.some(type => 
          exercise.forceType.toLowerCase().includes(type.toLowerCase()) ||
          type.toLowerCase().includes(exercise.forceType.toLowerCase())
        );
      
      // Favorites filter - only show favorites when filter is active
      const matchesFavorites = !showFavorites || exercise.isFavorite === true;
      
      return matchesSearch && matchesMuscleGroup && matchesForceType && matchesFavorites;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Always sort alphabetically by name

  console.log('Filtered exercises:', {
    total: allExercises.length,
    filtered: filteredExercises.length,
    showFavorites,
    searchTerm,
    selectedMuscleGroups,
    selectedForceTypes
  });

  // Selection handlers
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

  const handleSelectAll = () => {
    setSelectedExercises(filteredExercises);
  };

  const handleClearSelection = () => {
    setSelectedExercises([]);
  };

  // Exercise handlers
  const handleToggleFavorite = (exerciseId: string) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    console.log('ExerciseLibrary - Toggle favorite clicked:', {
      exerciseId,
      exerciseName: exercise?.name || 'Unknown',
      currentIsFavorite: exercise?.isFavorite || false
    });
    toggleFavorite(exerciseId);
  };

  const handleEditExercise = (exercise: Exercise) => {
    if (exercise.createdByTrainerId) {
      setExerciseToEdit(exercise);
      setShowEditDialog(true);
    }
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    if (exercise.createdByTrainerId) {
      setExerciseToDelete(exercise);
      setShowDeleteDialog(true);
    }
  };

  // Dialog handlers
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedMuscleGroups([]);
    setSelectedForceTypes([]);
    setShowFavorites(false);
  };

  const handleCreateWorkout = () => {
    setShowCreateWorkoutDialog(true);
  };

  // Computed values
  const selectedExerciseIds = new Set(selectedExercises.map(ex => ex.id));
  const favoritesCount = allExercises.filter(ex => ex.isFavorite === true).length;

  console.log('ExerciseLibrary render:', {
    totalExercises: allExercises.length,
    filteredExercises: filteredExercises.length,
    favoritesCount,
    selectedCount: selectedExercises.length
  });

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
        <ExerciseLibraryHeader
          totalExercises={allExercises.length}
          favoritesCount={favoritesCount}
          onAddExercise={() => setShowAddDialog(true)}
          isAddingExercise={isAddingExercise}
        />

        <ExerciseLibraryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMuscleGroups={selectedMuscleGroups}
          setSelectedMuscleGroups={setSelectedMuscleGroups}
          selectedForceTypes={selectedForceTypes}
          setSelectedForceTypes={setSelectedForceTypes}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          totalExercises={allExercises.length}
          filteredCount={filteredExercises.length}
        />

        <ExerciseLibraryActions
          selectedExercises={selectedExercises}
          filteredExercises={filteredExercises}
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

        <ExerciseLibraryDialogs
          showAddDialog={showAddDialog}
          setShowAddDialog={setShowAddDialog}
          onAddExercise={handleAddExercise}
          isAddingExercise={isAddingExercise}
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          exerciseToEdit={exerciseToEdit}
          setExerciseToEdit={setExerciseToEdit}
          onUpdateExercise={handleUpdateExercise}
          muscleGroups={muscleGroups}
          forceTypes={forceTypes}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          exerciseToDelete={exerciseToDelete}
          setExerciseToDelete={setExerciseToDelete}
          onConfirmDelete={handleConfirmDelete}
          isDeletingExercise={isDeletingExercise}
          showCreateWorkoutDialog={showCreateWorkoutDialog}
          setShowCreateWorkoutDialog={setShowCreateWorkoutDialog}
          selectedExercises={selectedExercises}
          onClearSelection={handleClearSelection}
        />
      </div>
    </PageLayout>
  );
};

export default ExerciseLibrary;
