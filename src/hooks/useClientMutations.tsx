
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
    mutationFn: clientService.updateClient,
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
    updateClient: updateClientMutation.mutate,
    archiveClient: archiveClientMutation.mutate,
  };
};
