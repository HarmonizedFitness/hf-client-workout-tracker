
import { Exercise } from '@/types/exercise';
import AddExerciseDialog from '@/components/AddExerciseDialog';
import EditExerciseDialog from '@/components/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/DeleteExerciseDialog';
import CreateWorkoutDialog from '@/components/CreateWorkoutDialog';

interface ExerciseLibraryDialogsProps {
  // Add Exercise Dialog
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  onAddExercise: (exerciseData: {
    name: string;
    forceType: string;
    muscleGroup: string;
    notes?: string;
  }) => void;
  isAddingExercise: boolean;

  // Edit Exercise Dialog
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  exerciseToEdit: Exercise | null;
  setExerciseToEdit: (exercise: Exercise | null) => void;
  onUpdateExercise: (exercise: Exercise) => void;
  muscleGroups: string[];
  forceTypes: string[];

  // Delete Exercise Dialog
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  exerciseToDelete: Exercise | null;
  setExerciseToDelete: (exercise: Exercise | null) => void;
  onConfirmDelete: () => void;
  isDeletingExercise: boolean;

  // Create Workout Dialog
  showCreateWorkoutDialog: boolean;
  setShowCreateWorkoutDialog: (show: boolean) => void;
  selectedExercises: Exercise[];
  onClearSelection: () => void;
}

const ExerciseLibraryDialogs = ({
  showAddDialog,
  setShowAddDialog,
  onAddExercise,
  isAddingExercise,
  showEditDialog,
  setShowEditDialog,
  exerciseToEdit,
  setExerciseToEdit,
  onUpdateExercise,
  muscleGroups,
  forceTypes,
  showDeleteDialog,
  setShowDeleteDialog,
  exerciseToDelete,
  setExerciseToDelete,
  onConfirmDelete,
  isDeletingExercise,
  showCreateWorkoutDialog,
  setShowCreateWorkoutDialog,
  selectedExercises,
  onClearSelection
}: ExerciseLibraryDialogsProps) => {
  return (
    <>
      <AddExerciseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddExercise={onAddExercise}
        isLoading={isAddingExercise}
      />

      <EditExerciseDialog
        exercise={exerciseToEdit}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setExerciseToEdit(null);
        }}
        onSave={onUpdateExercise}
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
        onConfirm={onConfirmDelete}
        isDeleting={isDeletingExercise}
      />

      <CreateWorkoutDialog
        open={showCreateWorkoutDialog}
        onOpenChange={setShowCreateWorkoutDialog}
        selectedExercises={selectedExercises}
        onClearSelection={onClearSelection}
      />
    </>
  );
};

export default ExerciseLibraryDialogs;
