
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddClientFormProps {
  formState: {
    newClientName: string;
    setNewClientName: (name: string) => void;
    newClientEmail: string;
    setNewClientEmail: (email: string) => void;
    newClientPhone: string;
    setNewClientPhone: (phone: string) => void;
    newClientTrainingDays: number;
    setNewClientTrainingDays: (days: number) => void;
    newClientCostPerSession: number;
    setNewClientCostPerSession: (cost: number) => void;
    newClientNotes: string;
    setNewClientNotes: (notes: string) => void;
    newClientGoals: string;
    setNewClientGoals: (goals: string) => void;
  };
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddClientForm = ({ formState, onSubmit, onCancel, isLoading = false }: AddClientFormProps) => {
  const {
    newClientName,
    setNewClientName,
    newClientEmail,
    setNewClientEmail,
    newClientPhone,
    setNewClientPhone,
    newClientTrainingDays,
    setNewClientTrainingDays,
    newClientCostPerSession,
    setNewClientCostPerSession,
    newClientNotes,
    setNewClientNotes,
    newClientGoals,
    setNewClientGoals,
  } = formState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 AddClientForm: handleSubmit called');
    onSubmit();
  };

  const isFormValid = newClientName.trim().length >= 2 && 
                     newClientTrainingDays >= 1 && 
                     newClientTrainingDays <= 7 && 
                     newClientCostPerSession >= 0;

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Add New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isFormValid && newClientName.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please ensure all required fields are filled correctly.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client-name">Name *</Label>
              <Input
                id="client-name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Client's full name"
                required
                disabled={isLoading}
                className={newClientName.length > 0 && newClientName.trim().length < 2 ? 'border-red-500' : ''}
              />
              {newClientName.length > 0 && newClientName.trim().length < 2 && (
                <p className="text-sm text-red-500 mt-1">Name must be at least 2 characters</p>
              )}
            </div>
            <div>
              <Label htmlFor="client-email">Email (Optional)</Label>
              <Input
                id="client-email"
                type="email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                placeholder="client@email.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="client-phone">Phone (Optional)</Label>
              <Input
                id="client-phone"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                placeholder="(555) 123-4567"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="training-days">Training Days per Week</Label>
              <Select 
                value={newClientTrainingDays.toString()} 
                onValueChange={(value) => setNewClientTrainingDays(parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map(days => (
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
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="client-goals">Goals (Optional)</Label>
              <Textarea
                id="client-goals"
                value={newClientGoals}
                onChange={(e) => setNewClientGoals(e.target.value)}
                placeholder="Client's fitness goals..."
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="client-notes">Notes (Optional)</Label>
              <Textarea
                id="client-notes"
                value={newClientNotes}
                onChange={(e) => setNewClientNotes(e.target.value)}
                placeholder="Additional notes about the client..."
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || !isFormValid}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLoading ? 'Adding...' : 'Add Client'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddClientForm;
