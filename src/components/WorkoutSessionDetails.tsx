
import WorkoutExerciseDisplay from './WorkoutExerciseDisplay';

interface WorkoutSessionDetailsProps {
  session: {
    id: string;
    notes: string | null;
    workout_sets: Array<{
      id: string;
      exercise_id: string;
      set_number: number;
      weight: number;
      reps: number;
      is_pr: boolean;
    }>;
  };
  getExerciseName: (exerciseId: string) => string;
}

const WorkoutSessionDetails = ({ session, getExerciseName }: WorkoutSessionDetailsProps) => {
  const exercises = [...new Set(session.workout_sets.map(set => set.exercise_id))];

  return (
    <div className="px-4 pb-4">
      {session.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-muted-foreground font-medium mb-1">Session Notes:</p>
          <p className="text-sm">{session.notes}</p>
        </div>
      )}
      <div className="space-y-3">
        {exercises.map(exerciseId => {
          const exerciseSets = session.workout_sets.filter(set => set.exercise_id === exerciseId);
          const exerciseName = getExerciseName(exerciseId);
          
          return (
            <WorkoutExerciseDisplay
              key={exerciseId}
              exerciseId={exerciseId}
              exerciseName={exerciseName}
              sets={exerciseSets}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutSessionDetails;
