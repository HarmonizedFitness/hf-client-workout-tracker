
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useExercises } from '@/hooks/useExercises';
import AddExerciseDialog from './AddExerciseDialog';
import FavoritesToggle from './FavoritesToggle';
import ExerciseSearchPopover from './ExerciseSearchPopover';
import ExerciseClearFilters from './ExerciseClearFilters';
import ExerciseResultsSummary from './ExerciseResultsSummary';

interface ExerciseSelectorProps {
  onExerciseAdd: (exerciseId: string) => void;
  existingExerciseIds: string[];
}

const ExerciseSelector = ({ onExerciseAdd, existingExerciseIds }: ExerciseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { allExercises, isLoading, addExercise, isAddingExercise } = useExercises();

  const handleAddExercise = (exerciseId: string) => {
    if (existingExerciseIds.includes(exerciseId)) {
      toast({
        title: "Exercise Already Added",
        description: "This exercise is already in your current session.",
        variant: "destructive",
      });
      return;
    }

    onExerciseAdd(exerciseId);
    setOpen(false);
    setSearchValue('');

    const exercise = allExercises.find(ex => ex.id === exerciseId);
    toast({
      title: "Exercise Added",
      description: `${exercise?.name} has been added to your session.`,
    });
  };

  const handleAddNewExercise = (exercise: {
    name: string;
    forceType: string;
    muscleGroup: string;
    notes?: string;
  }) => {
    console.log('Adding new exercise:', exercise);
    
    // Use the proper field mapping for the API
    addExercise({
      name: exercise.name,
      force_type: exercise.forceType,
      muscle_group: exercise.muscleGroup,
      notes: exercise.notes,
    });
    
    setShowAddDialog(false);
  };

  const handleFavoritesToggle = (checked: boolean | "indeterminate") => {
    // Convert CheckedState to boolean
    setShowFavoritesOnly(checked === true);
  };

  // Filter exercises based on search term and favorites toggle
  const filteredExercises = allExercises
    .filter(exercise => {
      // Search term filter - matches name or muscle group
      const matchesSearch = !searchValue || 
        exercise.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchValue.toLowerCase());
      
      // Favorites filter - only show favorites when toggle is active
      const matchesFavorites = !showFavoritesOnly || exercise.isFavorite === true;
      
      return matchesSearch && matchesFavorites;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Always sort alphabetically

  console.log('ExerciseSelector - Filtered exercises:', {
    total: allExercises.length,
    filtered: filteredExercises.length,
    showFavoritesOnly,
    searchValue,
    favorites: allExercises.filter(ex => ex.isFavorite === true).length
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading exercises...</div>
        </CardContent>
      </Card>
    );
  }

  const favoritesCount = allExercises.filter(ex => ex.isFavorite === true).length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Exercise to Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FavoritesToggle
            showFavoritesOnly={showFavoritesOnly}
            onToggle={handleFavoritesToggle}
            favoritesCount={favoritesCount}
          />

          <div>
            <Label>Select or Search Exercise</Label>
            <div className="flex gap-2 mt-2">
              <ExerciseSearchPopover
                open={open}
                onOpenChange={setOpen}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                showFavoritesOnly={showFavoritesOnly}
                filteredExercises={filteredExercises}
                existingExerciseIds={existingExerciseIds}
                onExerciseAdd={handleAddExercise}
                onShowAddDialog={() => setShowAddDialog(true)}
              />
              
              <Button
                onClick={() => setShowAddDialog(true)}
                variant="outline"
                className="h-12 px-4"
                title="Add New Exercise"
                disabled={isAddingExercise}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <ExerciseClearFilters
              searchValue={searchValue}
              showFavoritesOnly={showFavoritesOnly}
              onClearSearch={() => setSearchValue('')}
              onClearFavorites={() => setShowFavoritesOnly(false)}
            />

            <ExerciseResultsSummary
              filteredCount={filteredExercises.length}
              totalCount={allExercises.length}
              showFavoritesOnly={showFavoritesOnly}
            />
          </div>
        </CardContent>
      </Card>

      <AddExerciseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddExercise={handleAddNewExercise}
        isLoading={isAddingExercise}
      />
    </>
  );
};

export default ExerciseSelector;
