
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseClients, SupabaseClient } from '@/hooks/useSupabaseClients';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddClientDialogProps {
  onClientAdded: (client: SupabaseClient) => void;
}

const AddClientDialog = ({ onClientAdded }: AddClientDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientTrainingDays, setNewClientTrainingDays] = useState(3);
  const [newClientCostPerSession, setNewClientCostPerSession] = useState(75);

  const { addClient, isAddingClient } = useSupabaseClients();

  const handleAddClient = async () => {
    if (!newClientName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the client's name.",
        variant: "destructive",
      });
      return;
    }

    const clientData = {
      name: newClientName.trim(),
      email: newClientEmail.trim() || undefined,
      phone: newClientPhone.trim() || undefined,
      training_days_per_week: newClientTrainingDays,
      cost_per_session: newClientCostPerSession,
    };

    try {
      const newClient = await addClient(clientData);
      if (newClient) {
        onClientAdded(newClient);
        
        // Reset form and close dialog
        setNewClientName('');
        setNewClientEmail('');
        setNewClientPhone('');
        setNewClientTrainingDays(3);
        setNewClientCostPerSession(75);
        setOpen(false);

        toast({
          title: "Client Added!",
          description: `${newClient.name} has been added to your client list.`,
        });
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-burnt-orange hover:bg-burnt-orange/90 h-12 px-6 text-base font-medium shadow-lg"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-center">Add New Client</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="client-name" className="text-base font-medium">
                Name *
              </Label>
              <Input
                id="client-name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Client's full name"
                className="h-12 text-base"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client-email" className="text-base font-medium">
                Email (Optional)
              </Label>
              <Input
                id="client-email"
                type="email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                placeholder="client@email.com"
                className="h-12 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client-phone" className="text-base font-medium">
                Phone (Optional)
              </Label>
              <Input
                id="client-phone"
                type="tel"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="h-12 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="training-days" className="text-base font-medium">
                Training Days per Week
              </Label>
              <Select value={newClientTrainingDays.toString()} onValueChange={(value) => setNewClientTrainingDays(parseInt(value))}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(days => (
                    <SelectItem key={days} value={days.toString()} className="text-base py-3">
                      {days} {days === 1 ? 'day' : 'days'} per week
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cost-per-session" className="text-base font-medium">
                Cost Per Session ($)
              </Label>
              <Input
                id="cost-per-session"
                type="number"
                min="0"
                step="5"
                value={newClientCostPerSession}
                onChange={(e) => setNewClientCostPerSession(parseFloat(e.target.value) || 0)}
                placeholder="75"
                className="h-12 text-base"
              />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handleAddClient} 
              className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base font-medium"
              size="lg"
              disabled={isAddingClient}
            >
              {isAddingClient ? 'Adding...' : 'Add Client'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 h-12 text-base font-medium"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
