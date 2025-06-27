
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  };
  onSubmit: () => void;
  onCancel: () => void;
}

const AddClientForm = ({ formState, onSubmit, onCancel }: AddClientFormProps) => {
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
  } = formState;

  return (
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
          <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
            Add Client
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddClientForm;
