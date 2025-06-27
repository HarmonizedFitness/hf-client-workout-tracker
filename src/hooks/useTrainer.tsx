
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Trainer {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  business_name?: string;
  phone?: string;
  subscription_tier: 'basic' | 'pro' | 'enterprise';
  subscription_status: string;
  client_limit: number;
  branding_colors: any; // Changed from specific type to any to handle Json type
  google_sheets_connected: boolean;
  google_calendar_connected: boolean;
  created_at: string;
  updated_at: string;
}

export const useTrainer = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: trainer, isLoading } = useQuery({
    queryKey: ['trainer', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Trainer;
    },
    enabled: !!user,
  });

  const updateTrainerMutation = useMutation({
    mutationFn: async (updates: Partial<Trainer>) => {
      if (!trainer) throw new Error('No trainer found');
      
      const { data, error } = await supabase
        .from('trainers')
        .update(updates)
        .eq('id', trainer.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer'] });
    },
  });

  return {
    trainer,
    isLoading,
    updateTrainer: updateTrainerMutation.mutate,
    isUpdating: updateTrainerMutation.isPending,
  };
};
