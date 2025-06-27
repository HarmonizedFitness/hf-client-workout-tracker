
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

  console.log('useSupabaseClients: trainer data:', trainer);

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients', trainer?.id],
    queryFn: async () => {
      console.log('Fetching clients for trainer:', trainer?.id);
      
      if (!trainer) {
        console.log('No trainer found, returning empty array');
        return [];
      }
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('trainer_id', trainer.id)
        .order('created_at', { ascending: false });

      console.log('Supabase clients query result:', { data, error });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      console.log('Successfully fetched clients:', data);
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
      console.log('addClientMutation called with data:', newClient);
      console.log('Current trainer:', trainer);
      
      if (!trainer) {
        console.error('No trainer found for client creation');
        throw new Error('No trainer found - please make sure you are logged in');
      }
      
      const clientData = {
        ...newClient,
        trainer_id: trainer.id,
      };
      
      console.log('Inserting client data to Supabase:', clientData);
      
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      console.log('Supabase insert result:', { data, error });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Successfully created client:', data);
      return data;
    },
    onSuccess: (newClient) => {
      console.log('Client creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Added!",
        description: `${newClient.name} has been added to your client list.`,
      });
    },
    onError: (error: any) => {
      console.error('Client creation error:', error);
      toast({
        title: "Error Adding Client",
        description: error.message || 'Failed to add client. Please try again.',
        variant: "destructive",
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupabaseClient> }) => {
      console.log('Updating client:', id, updates);
      
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Client update error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: any) => {
      console.error('Client update error:', error);
      toast({
        title: "Error Updating Client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const archiveClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      console.log('Archiving client:', clientId);
      
      const { data, error } = await supabase
        .from('clients')
        .update({ 
          is_active: false, 
          date_archived: new Date().toISOString().split('T')[0] 
        })
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        console.error('Client archive error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Archived",
        description: `${client.name} has been archived and can be restored anytime.`,
      });
    },
    onError: (error: any) => {
      console.error('Client archive error:', error);
      toast({
        title: "Error Archiving Client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activeClients = clients.filter(client => client.is_active);
  const archivedClients = clients.filter(client => !client.is_active);

  console.log('useSupabaseClients returning:', {
    totalClients: clients.length,
    activeClients: activeClients.length,
    archivedClients: archivedClients.length,
    isLoading,
    error
  });

  return {
    clients,
    activeClients,
    archivedClients,
    isLoading,
    error,
    addClient: addClientMutation.mutate,
    isAddingClient: addClientMutation.isPending,
    updateClient: updateClientMutation.mutate,
    archiveClient: archiveClientMutation.mutate,
  };
};
