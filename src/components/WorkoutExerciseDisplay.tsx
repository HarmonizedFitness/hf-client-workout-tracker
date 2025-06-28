
import { Badge } from "@/components/ui/badge";
import { formatWeight } from '@/utils/weightConversions';

interface WorkoutExerciseDisplayProps {
  exerciseId: string;
  exerciseName: string;
  sets: Array<{
    id: string;
    set_number: number;
    weight: number;
    reps: number;
    is_pr: boolean;
  }>;
}

const WorkoutExerciseDisplay = ({ exerciseId, exerciseName, sets }: WorkoutExerciseDisplayProps) => {
  return (
    <div key={exerciseId} className="border rounded-lg p-3">
      <h4 className="font-medium mb-2">{exerciseName}</h4>
      <div className="grid gap-2">
        {sets.map((set) => (
          <div key={set.id} className="flex items-center justify-between text-sm">
            <span>Set {set.set_number}</span>
            <div className="flex items-center gap-2">
              <span>{formatWeight(set.weight)} × {set.reps}</span>
              {set.is_pr && (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-800 text-xs">
                  PR
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutExerciseDisplay;
