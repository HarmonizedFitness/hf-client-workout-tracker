
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTrainer } from './useTrainer';
import { toast } from '@/hooks/use-toast';

export interface SupabaseClient {
  id: string;
  trainer_id: string;
  name: string;
  email?: string;
  phone?: string;
  date_joined: string;
  is_active: boolean;
  date_archived?: string;
  training_days_per_week: number;
  cost_per_session: number;
  notes?: string;
  goals?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseClients = () => {
  const { trainer } = useTrainer();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', trainer?.id],
    queryFn: async () => {
      if (!trainer) return [];
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('trainer_id', trainer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupabaseClient[];
    },
    enabled: !!trainer,
  });

  const addClientMutation = useMutation({
    mutationFn: async (newClient: {
      name: string;
      email?: string;
      phone?: string;
      training_days_per_week: number;
      cost_per_session: number;
      notes?: string;
      goals?: string;
    }) => {
      if (!trainer) throw new Error('No trainer found');
      
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...newClient,
          trainer_id: trainer.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Added!",
        description: `${newClient.name} has been added to your client list.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupabaseClient> }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const archiveClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { data, error } = await supabase
        .from('clients')
        .update({ 
          is_active: false, 
          date_archived: new Date().toISOString().split('T')[0] 
        })
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Archived",
        description: `${client.name} has been archived and can be restored anytime.`,
      });
    },
  });

  const activeClients = clients.filter(client => client.is_active);
  const archivedClients = clients.filter(client => !client.is_active);

  return {
    clients,
    activeClients,
    archivedClients,
    isLoading,
    addClient: addClientMutation.mutate,
    isAddingClient: addClientMutation.isPending,
    updateClient: updateClientMutation.mutate,
    archiveClient: archiveClientMutation.mutate,
  };
};
