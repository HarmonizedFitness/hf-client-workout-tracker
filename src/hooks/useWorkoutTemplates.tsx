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
      console.log('=== WORKOUT TEMPLATE CREATION DEBUG ===');
      console.log('1. Trainer data:', { trainer, trainerId: trainer?.id });
      
      if (!trainer?.id) {
        console.error('CRITICAL: No trainer found when creating template');
        throw new Error('No trainer found - authentication issue');
      }
      
      console.log('2. Template data received:', template);
      console.log('3. Exercise IDs format check:', {
        exerciseIds: template.exercise_ids,
        firstExerciseId: template.exercise_ids[0],
        typeOfFirstId: typeof template.exercise_ids[0],
        isArray: Array.isArray(template.exercise_ids),
        length: template.exercise_ids.length
      });
      
      const templateData = {
        ...template,
        trainer_id: trainer.id,
      };
      
      console.log('4. Final template data for insert:', templateData);
      
      // Test authentication first
      const { data: authTest } = await supabase.auth.getUser();
      console.log('5. Auth test:', { 
        user: authTest?.user?.id,
        isAuthenticated: !!authTest?.user,
        matchesTrainer: authTest?.user?.id === trainer.user_id
      });

      const { data, error } = await supabase
        .from('workout_templates')
        .insert(templateData)
        .select()
        .single();
      
      if (error) {
        console.error('=== SUPABASE ERROR DETAILS ===');
        console.error('Error object:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Template data that failed:', templateData);
        console.error('============================');
        
        // Provide more specific error messages
        if (error.message?.includes('invalid input syntax for type uuid')) {
          throw new Error('Invalid exercise ID format. Please refresh the page and try again.');
        } else if (error.message?.includes('row-level security')) {
          throw new Error('Authentication error. Please refresh the page and try again.');
        } else if (error.code === 'PGRST301') {
          throw new Error('Database connection issue. Please refresh and try again.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      console.log('6. Successfully created workout template:', data);
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
      console.error('=== MUTATION ERROR ===');
      console.error('Error in createTemplateMutation:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('====================');
      
      toast({
        title: "Error Creating Workout",
        description: error.message || "Failed to create workout template. Please try again.",
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
