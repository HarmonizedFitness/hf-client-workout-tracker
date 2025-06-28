
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabaseClients, SupabaseClient } from '@/hooks/useSupabaseClients';
import { Users, Archive, RotateCcw, ChevronDown, ChevronRight, Mail, Phone, Calendar, Plus, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import AddClientForm from '@/components/AddClientForm';
import EditClientDialog from '@/components/EditClientDialog';
import { useClientActions } from '@/hooks/useClientActions';

const Clients = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<SupabaseClient | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { activeClients, archivedClients, isLoading, archiveClient } = useSupabaseClients();
  const { formState, handleAddClient, resetForm, isAddingClient } = useClientActions();

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

  const handleArchiveClient = (client: SupabaseClient) => {
    archiveClient(client.id);
  };

  const handleRestoreClient = (client: SupabaseClient) => {
    // TODO: Implement restore functionality in useSupabaseClients
    toast({
      title: "Feature Coming Soon",
      description: "Client restore functionality will be available soon.",
    });
  };

  const handleEditClient = (client: SupabaseClient) => {
    console.log('Edit client clicked:', client);
    setEditingClient(client);
    setShowEditDialog(true);
  };

  const handleAddClientSubmit = () => {
    handleAddClient();
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    resetForm();
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Users className="h-7 w-7 sm:h-8 sm:w-8 text-burnt-orange" />
            Client Management
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Loading your clients...
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageLayout>
    );
  }

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
          
          {!showArchived && (
            <div className="shrink-0">
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-burnt-orange hover:bg-burnt-orange/90"
                disabled={isAddingClient}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddClientForm
            formState={formState}
            onSubmit={handleAddClientSubmit}
            onCancel={handleCancelAdd}
            isLoading={isAddingClient}
          />
        </div>
      )}

      {/* Edit Client Dialog */}
      <EditClientDialog
        client={editingClient}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

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
                        {!client.is_active && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 self-start sm:self-center">
                            Archived
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{client.training_days_per_week} days/week</span>
                        <span>${client.cost_per_session}/session</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {client.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                        className="text-blue-600 hover:text-blue-700 h-9"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    )}
                    
                    {client.is_active ? (
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
                      <span className="text-sm">Joined: {client.date_joined}</span>
                    </div>
                    {client.goals && (
                      <div className="col-span-full">
                        <h4 className="font-medium text-sm mb-1">Goals:</h4>
                        <p className="text-sm text-muted-foreground">{client.goals}</p>
                      </div>
                    )}
                    {client.notes && (
                      <div className="col-span-full">
                        <h4 className="font-medium text-sm mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{client.notes}</p>
                      </div>
                    )}
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
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-burnt-orange hover:bg-burnt-orange/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Clients;
