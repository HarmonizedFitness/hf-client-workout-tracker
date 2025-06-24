
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { mockClients, getActiveClients, getArchivedClients, archiveClient, restoreClient } from '@/data/clientData';
import { Client } from '@/types/exercise';
import { Users, Plus, UserCheck, Archive, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const ClientSelector = ({ selectedClient, onClientSelect }: ClientSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientTrainingDays, setNewClientTrainingDays] = useState(3);
  const [newClientCostPerSession, setNewClientCostPerSession] = useState(75);

  const activeClients = getActiveClients();
  const archivedClients = getArchivedClients();
  const displayClients = showArchived ? archivedClients : activeClients;

  const handleAddClient = () => {
    if (!newClientName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the client's name.",
        variant: "destructive",
      });
      return;
    }

    const newClient: Client = {
      id: (mockClients.length + 1).toString(),
      name: newClientName.trim(),
      email: newClientEmail.trim() || undefined,
      phone: newClientPhone.trim() || undefined,
      dateJoined: new Date().toISOString().split('T')[0],
      isActive: true,
      trainingDaysPerWeek: newClientTrainingDays,
      costPerSession: newClientCostPerSession,
      personalRecords: [],
      workoutHistory: []
    };

    mockClients.push(newClient);
    onClientSelect(newClient);
    
    // Reset form
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientTrainingDays(3);
    setNewClientCostPerSession(75);
    setShowAddForm(false);

    toast({
      title: "Client Added!",
      description: `${newClient.name} has been added to your client list.`,
    });
  };

  const handleArchiveClient = (client: Client) => {
    archiveClient(client.id);
    if (selectedClient?.id === client.id) {
      onClientSelect(null);
    }
    toast({
      title: "Client Archived",
      description: `${client.name} has been archived and can be restored anytime.`,
    });
  };

  const handleRestoreClient = (client: Client) => {
    restoreClient(client.id);
    toast({
      title: "Client Restored",
      description: `${client.name} has been restored to active status.`,
    });
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
        {selectedClient && selectedClient.isActive && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-800">
                <UserCheck className="h-4 w-4" />
                <span className="font-medium">Active Client: {selectedClient.name}</span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-700">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive Client</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to archive {selectedClient.name}? Their workout history and personal records will be preserved and can be restored at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleArchiveClient(selectedClient)}>
                      Archive Client
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {selectedClient.email && <p className="text-green-600">{selectedClient.email}</p>}
              {selectedClient.phone && <p className="text-green-600">{selectedClient.phone}</p>}
              <p className="text-green-600">{selectedClient.trainingDaysPerWeek} days/week</p>
              <p className="text-green-600">${selectedClient.costPerSession}/session</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
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
                const client = mockClients.find(c => c.id === clientId);
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
                          {!client.isActive && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">
                              Archived
                            </span>
                          )}
                        </div>
                        {client.email && (
                          <div className="text-xs text-muted-foreground">{client.email}</div>
                        )}
                      </div>
                      {!client.isActive && (
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
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add New Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name">Name *</Label>
                  <Input
                    id="client-name"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Client's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="client-email">Email (Optional)</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="client-phone">Phone (Optional)</Label>
                  <Input
                    id="client-phone"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="training-days">Training Days per Week</Label>
                  <Select value={newClientTrainingDays.toString()} onValueChange={(value) => setNewClientTrainingDays(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} {days === 1 ? 'day' : 'days'} per week
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cost-per-session">Cost Per Session ($)</Label>
                  <Input
                    id="cost-per-session"
                    type="number"
                    min="0"
                    step="5"
                    value={newClientCostPerSession}
                    onChange={(e) => setNewClientCostPerSession(parseFloat(e.target.value) || 0)}
                    placeholder="75"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddClient} className="bg-green-600 hover:bg-green-700">
                  Add Client
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
