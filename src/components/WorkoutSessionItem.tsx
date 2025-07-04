
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from 'react';
import WorkoutSessionHeader from './WorkoutSessionHeader';
import WorkoutSessionDetails from './WorkoutSessionDetails';

interface WorkoutSessionItemProps {
  session: {
    id: string;
    date: string;
    duration_minutes: number | null;
    notes: string | null;
    workout_sets: Array<{
      id: string;
      exercise_id: string;
      set_number: number;
      weight: number;
      reps: number;
      is_pr: boolean;
      position?: number;
      circuit_id?: string | null;
      exercise_notes?: string | null;
    }>;
  };
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (sessionId: string) => void;
  isDeleting: boolean;
  getExerciseName: (exerciseId: string) => string;
}

const WorkoutSessionItem = ({ 
  session, 
  isOpen, 
  onToggle, 
  onDelete, 
  isDeleting, 
  getExerciseName 
}: WorkoutSessionItemProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
    >
      <CollapsibleTrigger className="w-full">
        <WorkoutSessionHeader
          session={session}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <WorkoutSessionDetails
          session={session}
          getExerciseName={getExerciseName}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default WorkoutSessionItem;
