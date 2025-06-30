
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
  trainer_id?: string;
}

export const useExercises = () => {
  const { trainer } = useTrainer();
  const queryClient = useQueryClient();

  const { data: allExercises = [], isLoading } = useQuery({
    queryKey: ['exercises', trainer?.id],
    queryFn: async () => {
      // Query all public exercises and trainer's custom exercises
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('is_public', true);

      if (error) throw error;
      return data as SupabaseExercise[];
    },
    enabled: !!trainer?.id,
  });

  // Get trainer-specific favorites
  const { data: trainerFavorites = [] } = useQuery({
    queryKey: ['trainer-favorites', trainer?.id],
    queryFn: async () => {
      if (!trainer?.id) return [];

      const { data, error } = await supabase
        .from('exercises')
        .select('id')
        .eq('trainer_id', trainer.id)
        .eq('is_favorite', true);

      if (error) throw error;
      return data.map(item => item.id);
    },
    enabled: !!trainer?.id,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const isFavorite = trainerFavorites.includes(exerciseId);
      
      if (isFavorite) {
        // Remove favorite - delete the trainer_id association
        const { error } = await supabase
          .from('exercises')
          .update({ 
            trainer_id: null,
            is_favorite: false 
          })
          .eq('id', exerciseId)
          .eq('trainer_id', trainer.id);

        if (error) throw error;
      } else {
        // Add favorite - set trainer_id and is_favorite
        const { error } = await supabase
          .from('exercises')
          .update({ 
            trainer_id: trainer.id,
            is_favorite: true 
          })
          .eq('id', exerciseId);

        if (error) throw error;
      }

      return { exerciseId, isFavorite: !isFavorite };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-favorites'] });
      
      const exercise = allExercises.find(ex => ex.id === data.exerciseId);
      const exerciseName = exercise?.name || 'Exercise';
      
      toast({
        title: data.isFavorite ? "Added to Favorites" : "Removed from Favorites",
        description: `${exerciseName} has been ${data.isFavorite ? 'added to' : 'removed from'} your favorites.`,
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

  const updateExerciseMutation = useMutation({
    mutationFn: async (exercise: {
      id: string;
      name: string;
      force_type: string;
      muscle_group: string;
      notes?: string;
    }) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const { data, error } = await supabase
        .from('exercises')
        .update({
          name: exercise.name,
          force_type: exercise.force_type,
          muscle_group: exercise.muscle_group,
          notes: exercise.notes,
        })
        .eq('id', exercise.id)
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

      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId)
        .eq('created_by_trainer_id', trainer.id);

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

  // Map exercises to the format expected by the UI
  const mappedExercises = allExercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    forceType: ex.force_type as any,
    muscleGroup: ex.muscle_group as any,
    notes: ex.notes,
    isFavorite: trainerFavorites.includes(ex.id),
    dbId: ex.id,
    isPublic: ex.is_public,
    createdByTrainerId: ex.created_by_trainer_id,
    trainerId: ex.trainer_id,
  }));

  return {
    allExercises: mappedExercises,
    customExercises: allExercises,
    isLoading,
    addExercise: addExerciseMutation.mutate,
    isAddingExercise: addExerciseMutation.isPending,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
    updateExercise: updateExerciseMutation.mutate,
    isUpdatingExercise: updateExerciseMutation.isPending,
    deleteExercise: deleteExerciseMutation.mutate,
    isDeletingExercise: deleteExerciseMutation.isPending,
  };
};
