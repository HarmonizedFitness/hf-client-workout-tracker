
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getActiveClients } from '@/data/clientData';
import { Client } from '@/types/exercise';
import { Trophy, Users, RefreshCw } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import PageLayout from '@/components/PageLayout';
import PersonalBests from '@/components/PersonalBests';

const Records = () => {
  const { selectedClient: globalSelectedClient, setSelectedClient: setGlobalSelectedClient } = useClient();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const activeClients = getActiveClients();

  // Initialize with global client context on mount
  useEffect(() => {
    if (globalSelectedClient && globalSelectedClient.isActive) {
      setSelectedClient(globalSelectedClient);
    }
  }, [globalSelectedClient]);

  const handleClientSelect = (clientId: string) => {
    const client = activeClients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setGlobalSelectedClient(client); // Update global context
    }
  };

  if (!selectedClient) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Personal Records</h1>
            <p className="text-muted-foreground">Select a client to view their personal best records</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Client for Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client-select">Choose a client to view their records</Label>
                <Select 
                  value=""
                  onValueChange={handleClientSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client..." />
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
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Personal Records</h1>
          <p className="text-muted-foreground">Viewing records for {selectedClient.name}</p>
        </div>

        {/* Client Switcher */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Current Client: {selectedClient.name}</span>
                <Badge variant="secondary">
                  {selectedClient.trainingDaysPerWeek} days/week
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedClient.id} onValueChange={handleClientSelect}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <PersonalBests client={selectedClient} />
      </div>
    </PageLayout>
  );
};

export default Records;
