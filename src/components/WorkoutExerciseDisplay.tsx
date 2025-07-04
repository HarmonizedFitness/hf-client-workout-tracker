
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatWeight } from '@/utils/weightConversions';
import { StickyNote } from 'lucide-react';

interface WorkoutExerciseDisplayProps {
  exerciseId: string;
  exerciseName: string;
  sets: Array<{
    id: string;
    set_number: number;
    weight: number;
    reps: number;
    is_pr: boolean;
    position: number;
    circuit_id: string | null;
    exercise_notes: string | null;
  }>;
  circuitId?: string;
}

const WorkoutExerciseDisplay = ({ 
  exerciseId, 
  exerciseName, 
  sets, 
  circuitId 
}: WorkoutExerciseDisplayProps) => {
  const exerciseNotes = sets[0]?.exercise_notes;

  return (
    <Card className={`p-3 ${circuitId ? 'border-blue-200 dark:border-blue-800' : ''}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{exerciseName}</h4>
            {circuitId && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                {circuitId}
              </Badge>
            )}
          </div>
          {exerciseNotes && (
            <div className="flex items-center text-muted-foreground">
              <StickyNote className="h-4 w-4" />
            </div>
          )}
        </div>

        {exerciseNotes && (
          <div className="p-2 bg-muted rounded text-sm">
            <div className="flex items-center gap-1 mb-1">
              <StickyNote className="h-3 w-3" />
              <span className="text-xs font-medium text-muted-foreground">Notes:</span>
            </div>
            <p>{exerciseNotes}</p>
          </div>
        )}

        <div className="grid gap-2">
          {sets
            .sort((a, b) => a.set_number - b.set_number)
            .map((set) => (
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
    </Card>
  );
};

export default WorkoutExerciseDisplay;
