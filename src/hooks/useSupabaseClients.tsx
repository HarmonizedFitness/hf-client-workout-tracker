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
      console.log('🚀 Starting addClientMutation with data:', newClient);
      console.log('🔑 Current trainer:', trainer);
      
      // Get current auth user
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      console.log('🔐 Auth user:', authUser?.user?.id, 'Auth error:', authError);
      
      if (!trainer) {
        const errorMsg = 'No trainer found - please make sure you are logged in';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }
      
      if (!authUser?.user) {
        const errorMsg = 'No authenticated user found';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Verify trainer ownership
      if (trainer.user_id !== authUser.user.id) {
        const errorMsg = 'Trainer user_id does not match authenticated user';
        console.error('❌', errorMsg, { trainerUserId: trainer.user_id, authUserId: authUser.user.id });
        throw new Error(errorMsg);
      }
      
      const clientData = {
        ...newClient,
        trainer_id: trainer.id,
      };
      
      console.log('📦 Final client data for insertion:', clientData);
      console.log('📊 Data types:', {
        name: typeof clientData.name,
        trainer_id: typeof clientData.trainer_id,
        training_days_per_week: typeof clientData.training_days_per_week,
        cost_per_session: typeof clientData.cost_per_session,
      });
      
      // Test if we can query the clients table first
      console.log('🧪 Testing clients table access...');
      const { data: testData, error: testError } = await supabase
        .from('clients')
        .select('id')
        .eq('trainer_id', trainer.id)
        .limit(1);
      
      console.log('🧪 Test query result:', { testData, testError });
      
      console.log('💾 Attempting to insert client into Supabase...');
      
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      console.log('💾 Supabase insert result:', { data, error });
      console.log('💾 Insert error details:', error?.message, error?.details, error?.hint, error?.code);

      if (error) {
        console.error('🔥 Supabase insert error:', error);
        // More detailed error information
        if (error.code === 'PGRST301') {
          console.error('🔥 Row Level Security policy violation');
        }
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }
      
      if (!data) {
        const errorMsg = 'No data returned from insert operation';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('✅ Successfully created client:', data);
      return data;
    },
    onSuccess: (newClient) => {
      console.log('🎉 Client creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Added!",
        description: `${newClient.name} has been added to your client list.`,
      });
    },
    onError: (error: any) => {
      console.error('💥 Client creation error:', error);
      console.error('💥 Error stack:', error.stack);
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
