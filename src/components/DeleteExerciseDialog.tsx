
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise } from '@/types/exercise';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DeleteExerciseDialogProps {
  exercises: Exercise[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (exerciseIds: string[]) => void;
}

const DeleteExerciseDialog = ({ 
  exercises, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteExerciseDialogProps) => {
  const handleConfirm = () => {
    const exerciseIds = exercises.map(ex => ex.id);
    onConfirm(exerciseIds);
    onClose();
    
    toast({
      title: "Exercises Deleted",
      description: `${exercises.length} exercise${exercises.length > 1 ? 's' : ''} deleted successfully.`,
    });
  };

  const isMultiple = exercises.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Exercise{isMultiple ? 's' : ''}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete {isMultiple ? 'these exercises' : 'this exercise'}? 
            This action cannot be undone.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {exercises.map(exercise => (
              <div key={exercise.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{exercise.name}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge className={getMuscleGroupColor(exercise.muscleGroup)}>
                      {exercise.muscleGroup}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.forceType}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              className="flex-1"
            >
              Delete {isMultiple ? `${exercises.length} Exercises` : 'Exercise'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExerciseDialog;
