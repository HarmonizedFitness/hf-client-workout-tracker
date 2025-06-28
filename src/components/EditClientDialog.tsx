
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupabaseClient } from '@/types/client';
import { useClientEdit } from '@/hooks/useClientEdit';
import { useEffect } from 'react';
import EditClientForm from './EditClientForm';

interface EditClientDialogProps {
  client: SupabaseClient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditClientDialog = ({ client, open, onOpenChange }: EditClientDialogProps) => {
  const {
    formState,
    updateFormField,
    handleUpdateClient,
    resetForm,
    initializeForm,
    isUpdating,
  } = useClientEdit();

  useEffect(() => {
    if (client && open) {
      console.log('🎯 Dialog opened with client:', client.name);
      console.log('🔧 About to initialize edit form...');
      console.log('📊 Current isUpdating before init:', isUpdating);
      
      // Initialize form with client data
      initializeForm(client);
      
      console.log('✅ Form initialization complete');
    }
  }, [client, open, initializeForm]);

  const handleSubmit = async () => {
    if (!client) {
      console.error('❌ No client selected for update');
      return;
    }
    
    console.log('📤 Submitting form for client:', client.name);
    console.log('📊 isUpdating before submission:', isUpdating);
    
    const success = await handleUpdateClient(client.id);
    if (success) {
      console.log('✅ Update successful, closing dialog');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    console.log('🚫 Edit cancelled, closing dialog');
    resetForm();
    onOpenChange(false);
  };

  if (!client) return null;

  // Add debug info to the dialog
  console.log('🎨 EditClientDialog rendering:');
  console.log('  - Client:', client.name);
  console.log('  - Dialog open:', open);
  console.log('  - isUpdating:', isUpdating);
  console.log('  - Form name field:', formState.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {client.name}</DialogTitle>
          <div className="text-sm text-gray-500">
            Debug: isUpdating = {String(isUpdating)} | Form ready = {formState.name ? 'Yes' : 'No'}
          </div>
        </DialogHeader>
        <EditClientForm
          formState={formState}
          onUpdateField={updateFormField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
