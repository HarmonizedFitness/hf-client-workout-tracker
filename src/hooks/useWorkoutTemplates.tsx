
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTrainer } from './useTrainer';
import { toast } from '@/hooks/use-toast';

export interface WorkoutTemplate {
  id: string;
  trainer_id: string;
  name: string;
  description?: string;
  exercise_ids: string[];
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export const useWorkoutTemplates = () => {
  const { trainer } = useTrainer();
  const queryClient = useQueryClient();

  const { data: workoutTemplates = [], isLoading } = useQuery({
    queryKey: ['workout-templates', trainer?.id],
    queryFn: async () => {
      if (!trainer?.id) return [];
      
      const { data, error } = await supabase
        .from('workout_templates')
        .select('*')
        .eq('trainer_id', trainer.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WorkoutTemplate[];
    },
    enabled: !!trainer?.id,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: {
      name: string;
      description?: string;
      exercise_ids: string[];
    }) => {
      if (!trainer?.id) throw new Error('No trainer found');
      
      const { data, error } = await supabase
        .from('workout_templates')
        .insert({
          ...template,
          trainer_id: trainer.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Created",
        description: "Your workout template has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workout template.",
        variant: "destructive",
      });
      console.error('Error creating workout template:', error);
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', templateId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Deleted",
        description: "Workout template has been removed.",
      });
    },
  });

  return {
    workoutTemplates,
    isLoading,
    createTemplate: createTemplateMutation.mutate,
    isCreatingTemplate: createTemplateMutation.isPending,
    deleteTemplate: deleteTemplateMutation.mutate,
  };
};
