
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
        console.error('Error details:', { code: error.code, message: error.message, details: error.details });
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
      
      const templateData = {
        ...template,
        trainer_id: trainer.id,
      };
      
      console.log('Template data to insert:', templateData);
      
      const { data, error } = await supabase
        .from('workout_templates')
        .insert(templateData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating workout template:', error);
        console.error('Error details:', { 
          code: error.code, 
          message: error.message, 
          details: error.details,
          hint: error.hint 
        });
        console.error('Template data that failed:', templateData);
        throw error;
      }
      
      console.log('Successfully created workout template:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Template creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Created",
        description: `"${data.name}" has been saved successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error in createTemplateMutation:', error);
      
      let errorMessage = "Failed to create workout template. Please try again.";
      
      if (error.message?.includes('row-level security')) {
        errorMessage = "Unable to create workout template. Authentication issue detected.";
        console.error('RLS Policy issue detected');
      } else if (error.code === 'PGRST301') {
        errorMessage = "Database connection issue. Please refresh and try again.";
      }
      
      toast({
        title: "Error Creating Workout",
        description: errorMessage,
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
      console.log('Updating workout template:', id, 'with updates:', updates);
      
      const { data, error } = await supabase
        .from('workout_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating workout template:', error);
        console.error('Error details:', { code: error.code, message: error.message, details: error.details });
        throw error;
      }
      
      console.log('Successfully updated workout template:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Updated",
        description: "Workout template has been updated successfully.",
      });
    },
    onError: (error: any) => {
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
      console.log('Deleting workout template:', templateId);
      
      const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', templateId);
      
      if (error) {
        console.error('Error deleting workout template:', error);
        console.error('Error details:', { code: error.code, message: error.message, details: error.details });
        throw error;
      }
      
      console.log('Successfully deleted workout template:', templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      toast({
        title: "Workout Deleted",
        description: "Workout template has been removed.",
      });
    },
    onError: (error: any) => {
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
