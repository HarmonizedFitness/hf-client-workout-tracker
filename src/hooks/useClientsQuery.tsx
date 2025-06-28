
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { useTrainer } from './useTrainer';

export const useClientsQuery = () => {
  const { trainer } = useTrainer();

  console.log('useClientsQuery: trainer data:', trainer);

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients', trainer?.id],
    queryFn: async () => {
      if (!trainer) {
        console.log('No trainer found, returning empty array');
        return [];
      }
      return clientService.fetchClients(trainer.id);
    },
    enabled: !!trainer,
  });

  const activeClients = clients.filter(client => client.is_active);
  const archivedClients = clients.filter(client => !client.is_active);

  console.log('useClientsQuery returning:', {
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
  };
};
