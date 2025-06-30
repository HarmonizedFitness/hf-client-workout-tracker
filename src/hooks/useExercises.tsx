import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTrainer } from './useTrainer';
import { toast } from '@/hooks/use-toast';

export interface SupabaseExercise {
  id: string;
  name: string;
  force_type: string;
  muscle_group: string;
  notes?: string;
  is_favorite?: boolean;
  is_public?: boolean;
  created_by_trainer_id?: string;
}

export const useExercises = () => {
  const { trainer } = useTrainer();
  const queryClient = useQueryClient();

  const { data: customExercises = [], isLoading } = useQuery({
    queryKey: ['exercises', trainer?.id],
    queryFn: async () => {
      if (!trainer?.id) return [];

      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or(`is_public.eq.true,created_by_trainer_id.eq.${trainer.id}`);

      if (error) throw error;
      return data as SupabaseExercise[];
    },
    enabled: !!trainer?.id,
  });

  const resetFavoritesMutation = useMutation({
    mutationFn: async () => {
      if (!trainer?.id) throw new Error('No trainer found');

      const { error } = await supabase
        .from('exercises')
        .update({ is_favorite: false })
        .eq('created_by_trainer_id', trainer.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: "Favorites Reset",
        description: "All exercise favorites have been reset.",
      });
    },
  });

  const allExercises = customExercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    forceType: ex.force_type as any,
    muscleGroup: ex.muscle_group as any,
    notes: ex.notes,
    isFavorite: ex.is_favorite || false,
    dbId: ex.id,
  }));

  const addExerciseMutation = useMutation({
    mutationFn: async (exercise: {
      name: string;
      force_type: string;
      muscle_group: string;
      notes?: string;
    }) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const { data, error } = await supabase
        .from('exercises')
        .insert({
          ...exercise,
          created_by_trainer_id: trainer.id,
          is_public: false,
          is_favorite: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: "Exercise Added",
        description: "New exercise has been added to your library.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add exercise. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding exercise:', error);
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const exercise = allExercises.find(ex => ex.id === exerciseId);
      if (!exercise) throw new Error('Exercise not found');

      const { data, error } = await supabase
        .from('exercises')
        .update({ is_favorite: !exercise.isFavorite })
        .eq('id', exercise.dbId)
        .select()
        .single();

      if (error) throw error;
      return { ...data, exerciseName: exercise.name };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      const exerciseName = data.exerciseName || data.name;
      toast({
        title: data.is_favorite ? "Added to Favorites" : "Removed from Favorites",
        description: `${exerciseName} has been ${data.is_favorite ? 'added to' : 'removed from'} your favorites.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
      console.error('Error toggling favorite:', error);
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: async (exercise: {
      id: string;
      name: string;
      force_type: string;
      muscle_group: string;
      notes?: string;
    }) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const dbId = exercise.id;

      const { data, error } = await supabase
        .from('exercises')
        .update({
          name: exercise.name,
          force_type: exercise.force_type,
          muscle_group: exercise.muscle_group,
          notes: exercise.notes,
        })
        .eq('id', dbId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: "Exercise Updated",
        description: "Exercise has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update exercise. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating exercise:', error);
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const exercise = allExercises.find(ex => ex.id === exerciseId);
      if (!exercise?.dbId) {
        throw new Error('Cannot delete exercise without database entry');
      }

      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exercise.dbId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: "Exercise Deleted",
        description: "Exercise has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete exercise. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting exercise:', error);
    },
  });

  return {
    allExercises,
    customExercises,
    isLoading,
    addExercise: addExerciseMutation.mutate,
    isAddingExercise: addExerciseMutation.isPending,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
    updateExercise: updateExerciseMutation.mutate,
    isUpdatingExercise: updateExerciseMutation.isPending,
    deleteExercise: deleteExerciseMutation.mutate,
    isDeletingExercise: deleteExerciseMutation.isPending,
    resetFavorites: resetFavoritesMutation.mutate,
    isResettingFavorites: resetFavoritesMutation.isPending,
  };
};
