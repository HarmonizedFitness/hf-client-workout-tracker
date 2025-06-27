
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/exercise';
import { UserCheck, Archive } from 'lucide-react';
import { archiveClient } from '@/data/clientData';
import { toast } from '@/hooks/use-toast';

interface ClientInfoProps {
  selectedClient: Client;
  onClientSelect: (client: Client | null) => void;
}

const ClientInfo = ({ selectedClient, onClientSelect }: ClientInfoProps) => {
  const handleArchiveClient = (client: Client) => {
    archiveClient(client.id);
    onClientSelect(null);
    toast({
      title: "Client Archived",
      description: `${client.name} has been archived and can be restored anytime.`,
    });
  };

  if (!selectedClient || !selectedClient.isActive) return null;

  return (
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
  );
};

export default ClientInfo;
