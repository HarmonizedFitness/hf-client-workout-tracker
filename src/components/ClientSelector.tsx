
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/exercise';
import { Users, Plus } from 'lucide-react';
import { useClientActions } from '@/hooks/useClientActions';
import ClientInfo from './ClientInfo';
import ClientSelectDropdown from './ClientSelectDropdown';
import AddClientForm from './AddClientForm';

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const ClientSelector = ({ selectedClient, onClientSelect }: ClientSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  const { formState, handleAddClient, resetForm } = useClientActions(onClientSelect);

  const handleAddClientSubmit = () => {
    handleAddClient();
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    resetForm();
    setShowAddForm(false);
  };

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
          />
          
          {!showArchived && (
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(!showAddForm)}
              className="mt-6"
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
