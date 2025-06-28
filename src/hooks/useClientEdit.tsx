
import { useState } from 'react';
import { useSupabaseClients, SupabaseClient } from './useSupabaseClients';
import { toast } from '@/hooks/use-toast';

export interface ClientEditFormState {
  name: string;
  email: string;
  phone: string;
  training_days_per_week: number;
  cost_per_session: number;
  goals: string;
  notes: string;
}

export const useClientEdit = () => {
  const { updateClient } = useSupabaseClients();
  const [formState, setFormState] = useState<ClientEditFormState>({
    name: '',
    email: '',
    phone: '',
    training_days_per_week: 3,
    cost_per_session: 75,
    goals: '',
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const initializeForm = (client: SupabaseClient) => {
    setFormState({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      training_days_per_week: client.training_days_per_week,
      cost_per_session: Number(client.cost_per_session),
      goals: client.goals || '',
      notes: client.notes || '',
    });
  };

  const updateFormField = (field: keyof ClientEditFormState, value: string | number) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateClient = async (clientId: string) => {
    console.log('Updating client:', clientId, formState);
    
    if (!formState.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Client name is required.",
        variant: "destructive",
      });
      return false;
    }

    setIsUpdating(true);
    try {
      await updateClient({
        id: clientId,
        updates: {
          name: formState.name.trim(),
          email: formState.email.trim() || null,
          phone: formState.phone.trim() || null,
          training_days_per_week: formState.training_days_per_week,
          cost_per_session: formState.cost_per_session,
          goals: formState.goals.trim() || null,
          notes: formState.notes.trim() || null,
        }
      });
      
      toast({
        title: "Client Updated!",
        description: `${formState.name} has been updated successfully.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      training_days_per_week: 3,
      cost_per_session: 75,
      goals: '',
      notes: '',
    });
  };

  return {
    formState,
    updateFormField,
    handleUpdateClient,
    resetForm,
    initializeForm,
    isUpdating,
  };
};
