
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { UserCheck, Users } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { useSupabaseClients, SupabaseClient } from '@/hooks/useSupabaseClients';
import SessionLogger from './SessionLogger';
import { adaptSupabaseClientToLegacyClient } from './ClientAdapter';

const EnhancedSessionLogger = () => {
  const { selectedClient, setSelectedClient } = useClient();
  const { activeClients } = useSupabaseClients();

  if (!selectedClient) {
    return (
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
              onValueChange={(clientId) => {
                const client = activeClients.find(c => c.id === clientId);
                if (client) setSelectedClient(client);
              }}
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Client Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
              <UserCheck className="h-4 w-4" />
              <span className="font-medium">Logging session for: {selectedClient.name}</span>
            </div>
            <Badge variant="secondary">
              {selectedClient.training_days_per_week} days/week
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Session Logger */}
      <SessionLogger client={adaptSupabaseClientToLegacyClient(selectedClient)} />
    </div>
  );
};

export default EnhancedSessionLogger;
