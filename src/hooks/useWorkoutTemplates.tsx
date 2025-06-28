
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
  muscle_group?: string;
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
      
      console.log('Fetching workout templates for trainer:', trainer.id);
      
      const { data, error } = await supabase
        .from('workout_templates')
        .select('*')
        .eq('trainer_id', trainer.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching workout templates:', error);
        throw error;
      }
      
      console.log('Fetched workout templates:', data);
      return data as WorkoutTemplate[];
    },
    enabled: !!trainer?.id,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: {
      name: string;
      description?: string;
      exercise_ids: string[];
      muscle_group?: string;
    }) => {
      if (!trainer?.id) {
        console.error('No trainer found when creating template');
        throw new Error('No trainer found');
      }
      
      console.log('Creating workout template:', template, 'for trainer:', trainer.id);
      
      const { data, error } = await supabase
        .from('workout_templates')
        .insert({
          ...template,
          trainer_id: trainer.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating workout template:', error);
        throw error;
      }
      
      console.log('Successfully created workout template:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Created",
        description: "Your workout template has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error in createTemplateMutation:', error);
      toast({
        title: "Error",
        description: "Failed to create workout template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      name?: string; 
      description?: string; 
      exercise_ids?: string[];
      muscle_group?: string;
    }) => {
      const { data, error } = await supabase
        .from('workout_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Updated",
        description: "Workout template has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating workout template:', error);
      toast({
        title: "Error",
        description: "Failed to update workout template.",
        variant: "destructive",
      });
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
    onError: (error) => {
      console.error('Error deleting workout template:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout template.",
        variant: "destructive",
      });
    },
  });

  return {
    workoutTemplates,
    isLoading,
    createTemplate: createTemplateMutation.mutate,
    isCreatingTemplate: createTemplateMutation.isPending,
    updateTemplate: updateTemplateMutation.mutate,
    isUpdatingTemplate: updateTemplateMutation.isPending,
    deleteTemplate: deleteTemplateMutation.mutate,
    isDeletingTemplate: deleteTemplateMutation.isPending,
  };
};
