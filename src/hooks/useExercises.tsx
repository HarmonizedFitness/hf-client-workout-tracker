
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

  // Combine initial exercises with custom exercises
  const allExercises = [
    ...initialExercises,
    ...customExercises.map(ex => ({
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

  return {
    allExercises,
    customExercises,
    isLoading,
    addExercise: addExerciseMutation.mutate,
    isAddingExercise: addExerciseMutation.isPending,
  };
};
