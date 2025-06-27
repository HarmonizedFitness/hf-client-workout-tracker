
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { mockClients, getActiveClients, getArchivedClients, archiveClient, restoreClient } from '@/data/clientData';
import { Client } from '@/types/exercise';
import { Users, Archive, RotateCcw, ChevronDown, ChevronRight, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import AddClientDialog from '@/components/AddClientDialog';

const Clients = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

  const activeClients = getActiveClients().sort((a, b) => a.name.localeCompare(b.name));
  const archivedClients = getArchivedClients().sort((a, b) => a.name.localeCompare(b.name));
  const displayClients = showArchived ? archivedClients : activeClients;

  const toggleClientDetails = (clientId: string) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const handleArchiveClient = (client: Client) => {
    archiveClient(client.id);
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

  const handleClientAdded = (client: Client) => {
    // The client is already added to mockClients in the dialog
    // This callback could be used for additional actions if needed
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-burnt-orange" />
              Client Management
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Manage your training clients and their information
            </p>
          </div>
          
          {/* Prominent Add Client Button - Always Visible */}
          {!showArchived && (
            <div className="shrink-0">
              <AddClientDialog onClientAdded={handleClientAdded} />
            </div>
          )}
        </div>
      </div>

      {/* Toggle between Active and Archived */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={!showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(false)}
            className={`flex-1 sm:flex-none h-11 ${!showArchived ? "bg-burnt-orange hover:bg-burnt-orange/90" : ""}`}
          >
            Active Clients ({activeClients.length})
          </Button>
          <Button 
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(true)}
            className={`flex-1 sm:flex-none h-11 ${showArchived ? "bg-burnt-orange hover:bg-burnt-orange/90" : ""}`}
          >
            Archived Clients ({archivedClients.length})
          </Button>
        </div>
        
        {/* Secondary Add Button for smaller screens when viewing active clients */}
        {!showArchived && (
          <div className="sm:hidden w-full">
            <AddClientDialog onClientAdded={handleClientAdded} />
          </div>
        )}
      </div>

      {/* Client Cards */}
      <div className="grid gap-4">
        {displayClients.map((client) => {
          const isExpanded = expandedClients.has(client.id);
          
          return (
            <Card key={client.id} className="transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleClientDetails(client.id)}
                      className="p-1 h-8 w-8 shrink-0 mt-1"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl">
                        <span className="truncate">{client.name}</span>
                        {!client.isActive && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 self-start sm:self-center">
                            Archived
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{client.trainingDaysPerWeek} days/week</span>
                        <span>{client.personalRecords.length} PRs</span>
                        <span>${client.costPerSession}/session</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {client.isActive ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-700 h-9">
                            <Archive className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Archive</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Archive Client</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to archive {client.name}? Their workout history and personal records will be preserved and can be restored at any time.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleArchiveClient(client)}>
                              Archive Client
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreClient(client)}
                        className="text-green-600 hover:text-green-700 h-9"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Restore</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{client.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">Joined: {client.dateJoined}</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {displayClients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4 text-base">
              {showArchived ? 'No archived clients found.' : 'No active clients found.'}
            </p>
            {!showArchived && (
              <AddClientDialog onClientAdded={handleClientAdded} />
            )}
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Clients;
