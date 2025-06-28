
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { useExercises } from '@/hooks/useExercises';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WorkoutSessionItem from './WorkoutSessionItem';

interface WorkoutHistoryProps {
  client: SupabaseClient;
}

const WorkoutHistory = ({ client }: WorkoutHistoryProps) => {
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const { sessions, isLoading, refetch } = useWorkoutSessions(client.id);
  const { allExercises } = useExercises();

  const toggleSession = (sessionId: string) => {
    setOpenSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    return exercise?.name || 'Unknown Exercise';
  };

  const deleteWorkoutSession = async (sessionId: string) => {
    try {
      setDeletingSession(sessionId);
      
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Workout Deleted",
        description: "The workout session has been successfully deleted.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting workout session:', error);
      toast({
        title: "Error",
        description: "Failed to delete the workout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingSession(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Workout History - {client.name}
          </CardTitle>
          <CardDescription>Loading workout history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Workout History - {client.name}
          </CardTitle>
          <CardDescription>Complete workout history and progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No workout sessions recorded yet. Start logging workouts to track progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Workout History - {client.name}
        </CardTitle>
        <CardDescription>
          {sessions.length} workout sessions completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <WorkoutSessionItem
              key={session.id}
              session={session}
              isOpen={openSessions[session.id]}
              onToggle={() => toggleSession(session.id)}
              onDelete={deleteWorkoutSession}
              isDeleting={deletingSession === session.id}
              getExerciseName={getExerciseName}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutHistory;
