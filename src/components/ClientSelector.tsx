
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from 'lucide-react';
import { useClientActions } from '@/hooks/useClientActions';
import { useSupabaseClients, SupabaseClient } from '@/hooks/useSupabaseClients';
import ClientInfo from './ClientInfo';
import ClientSelectDropdown from './ClientSelectDropdown';
import AddClientForm from './AddClientForm';

interface ClientSelectorProps {
  selectedClient: SupabaseClient | null;
  onClientSelect: (client: SupabaseClient) => void;
}

const ClientSelector = ({ selectedClient, onClientSelect }: ClientSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  const { formState, handleAddClient, resetForm, isAddingClient } = useClientActions();
  const { activeClients, archivedClients, isLoading } = useSupabaseClients();

  const handleAddClientSubmit = () => {
    console.log('ClientSelector: handleAddClientSubmit called');
    handleAddClient();
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    resetForm();
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading clients...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Client Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ClientInfo 
          selectedClient={selectedClient} 
          onClientSelect={onClientSelect} 
        />

        <div className="flex items-center gap-4">
          <ClientSelectDropdown
            selectedClient={selectedClient}
            onClientSelect={onClientSelect}
            showArchived={showArchived}
            setShowArchived={setShowArchived}
            activeClients={activeClients}
            archivedClients={archivedClients}
          />
          
          {!showArchived && (
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(!showAddForm)}
              className="mt-6"
              disabled={isAddingClient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          )}
        </div>

        {showAddForm && (
          <AddClientForm
            formState={formState}
            onSubmit={handleAddClientSubmit}
            onCancel={handleCancelAdd}
            isLoading={isAddingClient}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
