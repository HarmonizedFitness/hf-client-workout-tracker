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
      console.log('Fetching exercises with trainer ID:', trainer?.id);
      
      // Query both public exercises AND trainer's custom exercises
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or(`is_public.eq.true,created_by_trainer_id.eq.${trainer?.id}`)
        .range(0, 1499);

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log('Fetched exercises count:', data?.length || 0);
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

      if (error) {
        console.error('Error fetching trainer favorites:', error);
        throw error;
      }

      console.log('Trainer favorites count:', data?.length || 0);
      return data.map(item => item.id);
    },
    enabled: !!trainer?.id,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      if (!trainer?.id) throw new Error('No trainer found');

      const exercise = allExercises.find(ex => ex.id === exerciseId);
      const currentIsFavorite = trainerFavorites.includes(exerciseId);
      
      console.log('Toggle favorite - Before mutation:', {
        exerciseName: exercise?.name || 'Unknown',
        exerciseId,
        currentIsFavorite,
        trainerId: trainer.id
      });

      if (currentIsFavorite) {
        const { error } = await supabase
          .from('exercises')
          .update({ 
            trainer_id: null,
            is_favorite: false 
          })
          .eq('id', exerciseId)
          .eq('trainer_id', trainer.id);

        if (error) {
          console.error('Error removing favorite:', error);
          throw error;
        }
        
        return { exerciseId, isFavorite: false };
      } else {
        const { data: existingFavorite } = await supabase
          .from('exercises')
          .select('id, trainer_id, is_favorite')
          .eq('id', exerciseId)
          .single();

        if (existingFavorite?.trainer_id === trainer.id && existingFavorite?.is_favorite) {
          console.log('Exercise is already favorited by this trainer');
          return { exerciseId, isFavorite: true };
        }

        const { error } = await supabase
          .from('exercises')
          .update({ 
            trainer_id: trainer.id,
            is_favorite: true 
          })
          .eq('id', exerciseId);

        if (error) {
          console.error('Error adding favorite:', error);
          throw error;
        }
        
        return { exerciseId, isFavorite: true };
      }
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
      console.error('Toggle favorite - Error:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
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

      console.log('Adding exercise with data:', exercise);

      // Validate required fields
      if (!exercise.name?.trim()) {
        throw new Error('Exercise name is required');
      }
      if (!exercise.force_type?.trim()) {
        throw new Error('Force type is required');
      }
      if (!exercise.muscle_group?.trim()) {
        throw new Error('Muscle group is required');
      }

      // Insert the new exercise - let ID auto-generate
      const { data, error } = await supabase
        .from('exercises')
        .insert({
          name: exercise.name.trim(),
          force_type: exercise.force_type,
          muscle_group: exercise.muscle_group,
          notes: exercise.notes?.trim() || null,
          created_by_trainer_id: trainer.id,
          is_public: false, // Custom exercises are private by default
          is_favorite: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding exercise:', error);
        throw new Error(error.message || 'Failed to add exercise');
      }

      console.log('New exercise created:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate both exercises and favorites queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-favorites'] });
      
      console.log('Exercise added successfully:', data.name);
      toast({
        title: "Exercise Added Successfully",
        description: `${data.name} has been added to your library and is now available for use.`,
      });
    },
    onError: (error) => {
      console.error('Add exercise error:', error);
      toast({
        title: "Error Adding Exercise",
        description: error.message || "Failed to add exercise. Please check your input and try again.",
        variant: "destructive",
      });
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

  // Map exercises to the format expected by the UI and sort alphabetically
  const mappedExercises = allExercises
    .map(ex => ({
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
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log('Mapped exercises count:', mappedExercises.length);
  console.log('Favorites count:', mappedExercises.filter(ex => ex.isFavorite).length);

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
