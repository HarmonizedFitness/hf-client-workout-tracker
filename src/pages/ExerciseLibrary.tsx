
import { useState, useEffect } from 'react';
import { initialExercises } from '@/data/exerciseData';
import { Exercise } from '@/types/exercise';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import ExerciseLibraryHeader from '@/components/ExerciseLibraryHeader';
import BulkActionsBar from '@/components/BulkActionsBar';
import ExerciseFilters from '@/components/ExerciseFilters';
import ExerciseGrid from '@/components/ExerciseGrid';
import EditExerciseDialog from '@/components/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/DeleteExerciseDialog';

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');
  const [forceTypeFilter, setForceTypeFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [deletingExercises, setDeletingExercises] = useState<Exercise[]>([]);
  
  // New exercise form state
  const [newExercise, setNewExercise] = useState<{
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

  // Load exercises from localStorage or use initial data
  useEffect(() => {
    const savedExercises = localStorage.getItem('exerciseLibrary');
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    } else {
      const exercisesWithFavorites = initialExercises.map(ex => ({ ...ex, isFavorite: false }));
      setExercises(exercisesWithFavorites);
    }
  }, []);

  // Save exercises to localStorage whenever exercises change
  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem('exerciseLibrary', JSON.stringify(exercises));
    }
  }, [exercises]);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = muscleGroupFilter === 'all' || exercise.muscleGroup === muscleGroupFilter;
    const matchesForceType = forceTypeFilter === 'all' || exercise.forceType === forceTypeFilter;
    const matchesFavorites = !showFavoritesOnly || exercise.isFavorite;
    
    return matchesSearch && matchesMuscleGroup && matchesForceType && matchesFavorites;
  });

  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup))).sort();
  const forceTypes = Array.from(new Set(exercises.map(ex => ex.forceType))).sort();
  const favoriteCount = exercises.filter(ex => ex.isFavorite).length;

  const handleAddExercise = () => {
    if (!newExercise.name.trim() || !newExercise.muscleGroup || !newExercise.forceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in exercise name, muscle group, and force type.",
        variant: "destructive",
      });
      return;
    }

    const exercise: Exercise = {
      id: (Date.now()).toString(),
      name: newExercise.name.trim(),
      muscleGroup: newExercise.muscleGroup as Exercise['muscleGroup'],
      forceType: newExercise.forceType as Exercise['forceType'],
      notes: newExercise.notes.trim() || undefined,
      isFavorite: false
    };

    setExercises([...exercises, exercise]);
    setNewExercise({ name: '', muscleGroup: '', forceType: '', notes: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to the exercise library.`,
    });
  };

  const handleSelectExercise = (exerciseId: string) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(exerciseId)) {
      newSelected.delete(exerciseId);
    } else {
      newSelected.add(exerciseId);
    }
    setSelectedExercises(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedExercises.size === filteredExercises.length) {
      setSelectedExercises(new Set());
    } else {
      setSelectedExercises(new Set(filteredExercises.map(ex => ex.id)));
    }
  };

  const handleToggleFavorite = (exerciseId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, isFavorite: !ex.isFavorite } : ex
    ));
  };

  const handleEditExercise = (updatedExercise: Exercise) => {
    setExercises(exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    ));
  };

  const handleDeleteExercises = (exerciseIds: string[]) => {
    setExercises(exercises.filter(ex => !exerciseIds.includes(ex.id)));
    setSelectedExercises(new Set());
  };

  const handleBulkEdit = () => {
    if (selectedExercises.size === 1) {
      const exercise = exercises.find(ex => selectedExercises.has(ex.id));
      if (exercise) {
        setEditingExercise(exercise);
      }
    }
  };

  const handleBulkDelete = () => {
    const exercisesToDelete = exercises.filter(ex => selectedExercises.has(ex.id));
    setDeletingExercises(exercisesToDelete);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMuscleGroupFilter('all');
    setForceTypeFilter('all');
    setShowFavoritesOnly(false);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <ExerciseLibraryHeader
          favoriteCount={favoriteCount}
          muscleGroups={muscleGroups}
          forceTypes={forceTypes}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          newExercise={newExercise}
          setNewExercise={setNewExercise}
          onAddExercise={handleAddExercise}
        />

        <BulkActionsBar
          selectedCount={selectedExercises.size}
          filteredCount={filteredExercises.length}
          onSelectAll={handleSelectAll}
          onBulkEdit={handleBulkEdit}
          onBulkDelete={handleBulkDelete}
        />

        <ExerciseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          muscleGroupFilter={muscleGroupFilter}
          setMuscleGroupFilter={setMuscleGroupFilter}
          forceTypeFilter={forceTypeFilter}
          setForceTypeFilter={setForceTypeFilter}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          muscleGroups={muscleGroups}
          forceTypes={forceTypes}
        />

        <ExerciseGrid
          exercises={filteredExercises}
          selectedExercises={selectedExercises}
          onSelectExercise={handleSelectExercise}
          onToggleFavorite={handleToggleFavorite}
          onEditExercise={setEditingExercise}
          onDeleteExercise={(ex) => setDeletingExercises([ex])}
          onClearFilters={handleClearFilters}
          totalCount={exercises.length}
        />

        <EditExerciseDialog
          exercise={editingExercise}
          isOpen={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          onSave={handleEditExercise}
          muscleGroups={muscleGroups}
          forceTypes={forceTypes}
        />

        <DeleteExerciseDialog
          exercises={deletingExercises}
          isOpen={deletingExercises.length > 0}
          onClose={() => setDeletingExercises([])}
          onConfirm={handleDeleteExercises}
        />
      </div>
    </PageLayout>
  );
};

export default ExerciseLibrary;
