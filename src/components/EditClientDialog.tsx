
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
      console.log('Initializing edit form for client:', client);
      initializeForm(client);
    }
  }, [client, open, initializeForm]);

  const handleSubmit = async () => {
    if (!client) return;
    
    const success = await handleUpdateClient(client.id);
    if (success) {
      onOpenChange(false);
      resetForm();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {client.name}</DialogTitle>
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
