
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTrainer } from './useTrainer';
import { toast } from '@/hooks/use-toast';
import { initialExercises } from '@/data/exerciseData';

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

  // Create a map of custom exercises by name for favorites lookup
  const customExerciseMap = new Map(
    customExercises.map(ex => [ex.name, ex])
  );

  // Combine initial exercises with custom exercises, merging favorites status
  const allExercises = [
    ...initialExercises.map(exercise => {
      const customVersion = customExerciseMap.get(exercise.name);
      return {
        ...exercise,
        isFavorite: customVersion?.is_favorite || false,
      };
    }),
    ...customExercises
      .filter(ex => !initialExercises.some(initial => initial.name === ex.name))
      .map(ex => ({
        id: ex.id,
        name: ex.name,
        forceType: ex.force_type as any,
        muscleGroup: ex.muscle_group as any,
        notes: ex.notes,
        isFavorite: ex.is_favorite,
      }))
  ];

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
      
      // Find the exercise to get current favorite status
      const exercise = customExercises.find(ex => ex.id === exerciseId);
      if (!exercise) {
        // For initial exercises, we need to create a new entry in the database
        const initialExercise = initialExercises.find(ex => ex.id === exerciseId);
        if (initialExercise) {
          const { data, error } = await supabase
            .from('exercises')
            .insert({
              name: initialExercise.name,
              force_type: initialExercise.forceType,
              muscle_group: initialExercise.muscleGroup,
              notes: initialExercise.notes,
              created_by_trainer_id: trainer.id,
              is_public: false,
              is_favorite: true,
            })
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
        throw new Error('Exercise not found');
      }

      const { data, error } = await supabase
        .from('exercises')
        .update({ is_favorite: !exercise.is_favorite })
        .eq('id', exerciseId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: data.is_favorite ? "Added to Favorites" : "Removed from Favorites",
        description: `${data.name} has been ${data.is_favorite ? 'added to' : 'removed from'} your favorites.`,
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
        .eq('id', exerciseId);
      
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
  };
};
