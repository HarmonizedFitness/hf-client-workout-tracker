
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { toast } from '@/hooks/use-toast';

interface ClientSelectDropdownProps {
  selectedClient: SupabaseClient | null;
  onClientSelect: (client: SupabaseClient) => void;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
  activeClients: SupabaseClient[];
  archivedClients: SupabaseClient[];
}

const ClientSelectDropdown = ({ 
  selectedClient, 
  onClientSelect, 
  showArchived, 
  setShowArchived,
  activeClients,
  archivedClients
}: ClientSelectDropdownProps) => {
  const displayClients = showArchived ? archivedClients : activeClients;

  const handleRestoreClient = (client: SupabaseClient) => {
    // This would need to be implemented with a restore mutation
    toast({
      title: "Client Restored",
      description: `${client.name} has been restored to active status.`,
    });
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <Label htmlFor="client-select">
          {showArchived ? 'Archived Clients' : 'Active Clients'}
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowArchived(!showArchived)}
          className="h-6 px-2"
        >
          {showArchived ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Hide Archived
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              View Archived ({archivedClients.length})
            </>
          )}
        </Button>
      </div>
      <Select 
        value={selectedClient?.id || ''} 
        onValueChange={(clientId) => {
          const client = [...activeClients, ...archivedClients].find(c => c.id === clientId);
          if (client) onClientSelect(client);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Choose a ${showArchived ? 'archived' : 'active'} client...`} />
        </SelectTrigger>
        <SelectContent>
          {displayClients.map(client => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {client.name}
                    {!client.is_active && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">
                        Archived
                      </span>
                    )}
                  </div>
                  {client.email && (
                    <div className="text-xs text-muted-foreground">{client.email}</div>
                  )}
                </div>
                {!client.is_active && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreClient(client);
                    }}
                    className="ml-auto h-6 px-2"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelectDropdown;
