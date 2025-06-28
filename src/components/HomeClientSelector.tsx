
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSupabaseClients, SupabaseClient } from '@/hooks/useSupabaseClients';
import { UserCheck } from 'lucide-react';

interface HomeClientSelectorProps {
  selectedClient: SupabaseClient | null;
  onClientSelect: (client: SupabaseClient) => void;
}

const HomeClientSelector = ({ selectedClient, onClientSelect }: HomeClientSelectorProps) => {
  const { activeClients, isLoading } = useSupabaseClients();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedClient && selectedClient.is_active && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <UserCheck className="h-4 w-4" />
            <span className="font-medium">Selected: {selectedClient.name}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-green-600">
            <p>{selectedClient.training_days_per_week} days/week</p>
            <p>${selectedClient.cost_per_session}/session</p>
          </div>
        </div>
      )}

      <Select 
        value={selectedClient?.id || ''} 
        onValueChange={(clientId) => {
          const client = activeClients.find(c => c.id === clientId);
          if (client) onClientSelect(client);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose a client..." />
        </SelectTrigger>
        <SelectContent>
          {activeClients.map(client => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">{client.name}</div>
                  {client.email && (
                    <div className="text-xs text-muted-foreground">{client.email}</div>
                  )}
                </div>
                <Badge variant="secondary" className="ml-2">
                  {client.training_days_per_week}x/week
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HomeClientSelector;
