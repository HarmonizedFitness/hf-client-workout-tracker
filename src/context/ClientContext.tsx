
import { createContext, useContext, useState, ReactNode } from 'react';
import { SupabaseClient } from '@/hooks/useSupabaseClients';

interface ClientContextType {
  selectedClient: SupabaseClient | null;
  setSelectedClient: (client: SupabaseClient | null) => void;
  clearSelectedClient: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClient, setSelectedClient] = useState<SupabaseClient | null>(null);

  const clearSelectedClient = () => {
    setSelectedClient(null);
  };

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient, clearSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
