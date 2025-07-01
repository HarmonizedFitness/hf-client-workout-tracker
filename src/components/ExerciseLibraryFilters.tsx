
import { useState } from 'react';
import ExerciseFilters from '@/components/ExerciseFilters';

interface ExerciseLibraryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMuscleGroups: string[];
  setSelectedMuscleGroups: (groups: string[]) => void;
  selectedForceTypes: string[];
  setSelectedForceTypes: (types: string[]) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  totalExercises: number;
  filteredCount: number;
}

const ExerciseLibraryFilters = ({
  searchTerm,
  setSearchTerm,
  selectedMuscleGroups,
  setSelectedMuscleGroups,
  selectedForceTypes,
  setSelectedForceTypes,
  showFavorites,
  setShowFavorites,
  totalExercises,
  filteredCount
}: ExerciseLibraryFiltersProps) => {
  return (
    <ExerciseFilters
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedMuscleGroups={selectedMuscleGroups}
      onMuscleGroupsChange={setSelectedMuscleGroups}
      selectedForceTypes={selectedForceTypes}
      onForceTypesChange={setSelectedForceTypes}
      showFavorites={showFavorites}
      onShowFavoritesChange={setShowFavorites}
      totalExercises={totalExercises}
      filteredCount={filteredCount}
    />
  );
};

export default ExerciseLibraryFilters;
