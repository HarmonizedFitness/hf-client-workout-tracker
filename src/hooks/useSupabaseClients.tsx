
import { useTrainer } from './useTrainer';
import { useClientsQuery } from './useClientsQuery';
import { useClientMutations } from './useClientMutations';

export type { SupabaseClient } from '@/types/client';

export const useSupabaseClients = () => {
  const { trainer } = useTrainer();
  const { clients, activeClients, archivedClients, isLoading, error } = useClientsQuery();
  const { addClient, isAddingClient, updateClient, archiveClient } = useClientMutations(trainer?.id);

  return {
    clients,
    activeClients,
    archivedClients,
    isLoading,
    error,
    addClient,
    isAddingClient,
    updateClient,
    archiveClient,
  };
};
