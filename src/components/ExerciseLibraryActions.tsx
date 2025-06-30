
import BulkActionsBar from '@/components/BulkActionsBar';
import { Exercise } from '@/types/exercise';

interface ExerciseLibraryActionsProps {
  selectedExercises: Exercise[];
  filteredExercises: Exercise[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCreateWorkout: () => void;
}

const ExerciseLibraryActions = ({
  selectedExercises,
  filteredExercises,
  onSelectAll,
  onClearSelection,
  onCreateWorkout
}: ExerciseLibraryActionsProps) => {
  const handleSelectAll = () => {
    onSelectAll();
  };

  return (
    <BulkActionsBar
      selectedCount={selectedExercises.length}
      onSelectAll={handleSelectAll}
      onClearSelection={onClearSelection}
      onCreateWorkout={onCreateWorkout}
    />
  );
};

export default ExerciseLibraryActions;
