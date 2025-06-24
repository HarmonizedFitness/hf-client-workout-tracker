
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockClients } from '@/data/clientData';
import { Client } from '@/types/exercise';
import { Users, Plus, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const ClientSelector = ({ selectedClient, onClientSelect }: ClientSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

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
      personalRecords: [],
      workoutHistory: []
    };

    // In a real app, this would save to database
    mockClients.push(newClient);
    onClientSelect(newClient);
    
    // Reset form
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setShowAddForm(false);

    toast({
      title: "Client Added!",
      description: `${newClient.name} has been added to your client list.`,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Client Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedClient && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <UserCheck className="h-4 w-4" />
              <span className="font-medium">Active Client: {selectedClient.name}</span>
            </div>
            {selectedClient.email && (
              <p className="text-sm text-green-600 mt-1">{selectedClient.email}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="client-select">Select Client</Label>
            <Select value={selectedClient?.id || ''} onValueChange={(clientId) => {
              const client = mockClients.find(c => c.id === clientId);
              if (client) onClientSelect(client);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      {client.email && (
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add New Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
