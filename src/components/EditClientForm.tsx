
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClientEditFormState } from '@/hooks/useClientEdit';

interface EditClientFormProps {
  formState: ClientEditFormState;
  onUpdateField: (field: keyof ClientEditFormState, value: string | number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EditClientForm = ({
  formState,
  onUpdateField,
  onSubmit,
  onCancel,
  isLoading = false
}: EditClientFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📋 Form submitted with state:', formState);
    console.log('⏳ isLoading state:', isLoading);
    onSubmit();
  };

  const handleFieldChange = (field: keyof ClientEditFormState, value: string | number) => {
    console.log(`✏️ Field ${field} changed to:`, value);
    console.log('🔒 Form disabled state:', isLoading);
    onUpdateField(field, value);
  };

  // Add debugging for render
  console.log('🎨 EditClientForm rendering with isLoading:', isLoading);
  console.log('📊 Current form state:', formState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formState.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Client name"
                required
                disabled={isLoading}
                className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
              />
              {isLoading && <p className="text-xs text-gray-500">Field is disabled (loading: {String(isLoading)})</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formState.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="client@example.com"
                disabled={isLoading}
                className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formState.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                disabled={isLoading}
                className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-training-days">Training Days per Week</Label>
              <Input
                id="edit-training-days"
                type="number"
                min="1"
                max="7"
                value={formState.training_days_per_week}
                onChange={(e) => handleFieldChange('training_days_per_week', parseInt(e.target.value) || 1)}
                disabled={isLoading}
                className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-cost">Cost per Session ($)</Label>
              <Input
                id="edit-cost"
                type="number"
                min="0"
                step="0.01"
                value={formState.cost_per_session}
                onChange={(e) => handleFieldChange('cost_per_session', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
                className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-goals">Goals</Label>
              <Textarea
                id="edit-goals"
                value={formState.goals}
                onChange={(e) => handleFieldChange('goals', e.target.value)}
                placeholder="Client's fitness goals..."
                disabled={isLoading}
                className={`min-h-[100px] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formState.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Additional notes about the client..."
                disabled={isLoading}
                className={`min-h-[100px] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-burnt-orange hover:bg-burnt-orange/90"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Client'}
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

export default EditClientForm;
