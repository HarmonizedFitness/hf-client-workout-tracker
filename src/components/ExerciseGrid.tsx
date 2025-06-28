
import { Button } from "@/components/ui/button";
import { Exercise } from '@/types/exercise';
import ExerciseCard from '@/components/ExerciseCard';

interface ExerciseGridProps {
  exercises: Exercise[];
  selectedExercises: Set<string>;
  onSelectExercise: (exerciseId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
  onEditExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exercise: Exercise) => void;
  onClearFilters: () => void;
  totalCount: number;
}

const ExerciseGrid = ({
  exercises,
  selectedExercises,
  onSelectExercise,
  onToggleFavorite,
  onEditExercise,
  onDeleteExercise,
  onClearFilters,
  totalCount
}: ExerciseGridProps) => {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No exercises found matching your criteria.</p>
        <Button 
          variant="ghost" 
          onClick={onClearFilters}
          className="mt-2"
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isSelected={selectedExercises.has(exercise.id)}
            onSelect={onSelectExercise}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEditExercise}
            onDelete={onDeleteExercise}
          />
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        Showing {exercises.length} of {totalCount} exercises
        {selectedExercises.size > 0 && (
          <span className="ml-2">({selectedExercises.size} selected)</span>
        )}
      </div>
    </>
  );
};

export default ExerciseGrid;
