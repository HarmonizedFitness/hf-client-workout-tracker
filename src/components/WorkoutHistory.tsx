
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronDown, Calendar, Clock, Award, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { useExercises } from '@/hooks/useExercises';
import { kgToLbs } from '@/utils/weightConversions';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
          {sessions.map((session) => {
            const totalSets = session.workout_sets.length;
            const prSets = session.workout_sets.filter(set => set.is_pr).length;
            const exercises = [...new Set(session.workout_sets.map(set => set.exercise_id))];
            
            return (
              <Collapsible
                key={session.id}
                open={openSessions[session.id]}
                onOpenChange={() => toggleSession(session.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
                            disabled={deletingSession === session.id}
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
                              onClick={() => deleteWorkoutSession(session.id)}
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
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                          <div key={exerciseId} className="border rounded-lg p-3">
                            <h4 className="font-medium mb-2">{exerciseName}</h4>
                            <div className="grid gap-2">
                              {exerciseSets.map((set, index) => (
                                <div key={set.id} className="flex items-center justify-between text-sm">
                                  <span>Set {set.set_number}</span>
                                  <div className="flex items-center gap-2">
                                    <span>{kgToLbs(set.weight)} lbs × {set.reps}</span>
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
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutHistory;
