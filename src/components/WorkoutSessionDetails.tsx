
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
      position: number;
      circuit_id: string | null;
      exercise_notes: string | null;
    }>;
  };
  getExerciseName: (exerciseId: string) => string;
}

const WorkoutSessionDetails = ({ session, getExerciseName }: WorkoutSessionDetailsProps) => {
  // Group sets by exercise and circuit
  const groupedSets = session.workout_sets
    .sort((a, b) => a.position - b.position)
    .reduce((acc, set) => {
      const key = set.circuit_id || set.exercise_id;
      if (!acc[key]) {
        acc[key] = {
          circuitId: set.circuit_id,
          exercises: {},
        };
      }
      
      if (!acc[key].exercises[set.exercise_id]) {
        acc[key].exercises[set.exercise_id] = [];
      }
      
      acc[key].exercises[set.exercise_id].push(set);
      
      return acc;
    }, {} as Record<string, { circuitId: string | null; exercises: Record<string, typeof session.workout_sets> }>);

  return (
    <div className="px-4 pb-4">
      {session.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-muted-foreground font-medium mb-1">Session Notes:</p>
          <p className="text-sm">{session.notes}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {Object.entries(groupedSets).map(([groupKey, group]) => {
          const isCircuit = group.circuitId;
          const exercises = Object.entries(group.exercises);
          
          if (isCircuit) {
            // Render circuit container
            return (
              <div key={groupKey} className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {group.circuitId}
                  </span>
                </div>
                <div className="space-y-3">
                  {exercises.map(([exerciseId, exerciseSets]) => (
                    <WorkoutExerciseDisplay
                      key={exerciseId}
                      exerciseId={exerciseId}
                      exerciseName={getExerciseName(exerciseId)}
                      sets={exerciseSets}
                      circuitId={group.circuitId}
                    />
                  ))}
                </div>
              </div>
            );
          } else {
            // Render standalone exercise
            const [exerciseId, exerciseSets] = exercises[0];
            return (
              <WorkoutExerciseDisplay
                key={exerciseId}
                exerciseId={exerciseId}
                exerciseName={getExerciseName(exerciseId)}
                sets={exerciseSets}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default WorkoutSessionDetails;
