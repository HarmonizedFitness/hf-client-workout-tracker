
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SupabaseClient, useSupabaseClients } from '@/hooks/useSupabaseClients';
import { UserCheck, Users, Plus, X } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import PageLayout from '@/components/PageLayout';
import SessionLogger from '@/components/SessionLogger';
import { adaptSupabaseClientToLegacyClient } from '@/components/ClientAdapter';
import { useSearchParams } from 'react-router-dom';

const Session = () => {
  const { selectedClient: globalSelectedClient, setSelectedClient: setGlobalSelectedClient, clearSelectedClient } = useClient();
  const [selectedClient, setSelectedClient] = useState<SupabaseClient | null>(null);
  const { activeClients } = useSupabaseClients();
  const [searchParams] = useSearchParams();

  // Check for workout template in URL params
  const workoutTemplateId = searchParams.get('template');
  const preSelectedExercises = searchParams.get('exercises')?.split(',') || [];

  // Initialize with global client context on mount
  useEffect(() => {
    if (globalSelectedClient && globalSelectedClient.is_active) {
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

  const handleClearClient = () => {
    setSelectedClient(null);
    clearSelectedClient();
  };

  if (!selectedClient) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <div className="text-center">
            <Plus className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Log Workout Session</h1>
            <p className="text-muted-foreground">Select a client to start logging their workout</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Client for Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client-select">Choose a client to log session for</Label>
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
                            {client.training_days_per_week}x/week
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
          <Plus className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Log Workout Session</h1>
        </div>

        {/* Client Switcher */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                <UserCheck className="h-4 w-4" />
                <span className="font-medium">Log New Session: {selectedClient.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearClient}
                  className="text-red-600 hover:text-red-700 h-8 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
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

        {/* Session Logger */}
        <SessionLogger 
          client={adaptSupabaseClientToLegacyClient(selectedClient)}
          preSelectedExercises={preSelectedExercises}
          workoutTemplateId={workoutTemplateId}
        />
      </div>
    </PageLayout>
  );
};

export default Session;
