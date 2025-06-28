
import { Client } from '@/types/exercise';
import SessionForm from './SessionForm';

interface SessionLoggerProps {
  client: Client;
  preSelectedExercises?: string[];
  workoutTemplateId?: string | null;
}

const SessionLogger = ({ client, preSelectedExercises = [], workoutTemplateId }: SessionLoggerProps) => {
  return (
    <SessionForm 
      client={client}
      preSelectedExercises={preSelectedExercises}
      workoutTemplateId={workoutTemplateId}
    />
  );
};

export default SessionLogger;
