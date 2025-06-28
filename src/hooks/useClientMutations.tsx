
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { clientService } from '@/services/clientService';
import { NewClientData, ClientUpdateData } from '@/types/client';

export const useClientMutations = (trainerId?: string) => {
  const queryClient = useQueryClient();

  const addClientMutation = useMutation({
    mutationFn: async (newClient: NewClientData) => {
      if (!trainerId) {
        throw new Error('No trainer found - please make sure you are logged in');
      }
      return clientService.addClient(newClient, trainerId);
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
    mutationFn: async (updateData: ClientUpdateData) => {
      console.log('🔄 Starting client update mutation with data:', updateData);
      
      try {
        const result = await clientService.updateClient(updateData);
        console.log('✅ Client update successful:', result);
        return result;
      } catch (error) {
        console.error('❌ Client update failed in mutation:', error);
        throw error;
      }
    },
    onSuccess: (updatedClient) => {
      console.log('🎉 Client update mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      // Don't show toast here - let the calling component handle it
      // to avoid duplicate toasts
    },
    onError: (error: any) => {
      console.error('💥 Client update mutation error:', error);
      
      // Don't show toast here - let the calling component handle it
      // to provide more specific error messages
      throw error; // Re-throw so the calling component can catch it
    },
  });

  const archiveClientMutation = useMutation({
    mutationFn: clientService.archiveClient,
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

  return {
    addClient: addClientMutation.mutate,
    isAddingClient: addClientMutation.isPending,
    updateClient: updateClientMutation.mutateAsync, // Use mutateAsync for better error handling
    archiveClient: archiveClientMutation.mutate,
  };
};
