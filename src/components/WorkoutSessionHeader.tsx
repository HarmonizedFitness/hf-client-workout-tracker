
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronDown, Calendar, Clock, Award, Trash2 } from 'lucide-react';

interface WorkoutSessionHeaderProps {
  session: {
    id: string;
    date: string;
    duration_minutes: number | null;
    workout_sets: Array<{
      id: string;
      exercise_id: string;
      is_pr: boolean;
    }>;
  };
  onDelete: (sessionId: string) => void;
  isDeleting: boolean;
}

const WorkoutSessionHeader = ({ session, onDelete, isDeleting }: WorkoutSessionHeaderProps) => {
  const totalSets = session.workout_sets.length;
  const prSets = session.workout_sets.filter(set => set.is_pr).length;
  const exercises = [...new Set(session.workout_sets.map(set => set.exercise_id))];

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(session.date).toLocaleDateString()}
          {session.duration_minutes && (
            <>
              <Clock className="h-4 w-4 ml-2" />
              {session.duration_minutes}min
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {exercises.length} exercises
        </Badge>
        <Badge variant="outline">
          {totalSets} sets
        </Badge>
        {prSets > 0 && (
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-800">
            <Award className="h-3 w-3 mr-1" />
            {prSets} PR{prSets > 1 ? 's' : ''}
          </Badge>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => e.stopPropagation()}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workout Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this workout session from {new Date(session.date).toLocaleDateString()}? 
                This will permanently remove all exercises and sets from this session. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(session.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Workout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
};

export default WorkoutSessionHeader;
