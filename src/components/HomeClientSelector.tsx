
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockClients, getActiveClients } from '@/data/clientData';
import { Client } from '@/types/exercise';
import { UserCheck } from 'lucide-react';

interface HomeClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const HomeClientSelector = ({ selectedClient, onClientSelect }: HomeClientSelectorProps) => {
  const activeClients = getActiveClients();

  return (
    <div className="space-y-4">
      {selectedClient && selectedClient.isActive && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <UserCheck className="h-4 w-4" />
            <span className="font-medium">Selected: {selectedClient.name}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-green-600">
            <p>{selectedClient.trainingDaysPerWeek} days/week</p>
            <p>{selectedClient.personalRecords.length} PRs</p>
          </div>
        </div>
      )}

      <Select 
        value={selectedClient?.id || ''} 
        onValueChange={(clientId) => {
          const client = mockClients.find(c => c.id === clientId);
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
                  {client.trainingDaysPerWeek}x/week
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
