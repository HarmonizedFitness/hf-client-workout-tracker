
import { useState } from 'react';
import { SupabaseClient } from '@/types/client';
import { useSupabaseClients } from './useSupabaseClients';
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
    console.log('🔄 Initializing form with client data:', client);
    
    // Reset loading state when initializing
    setIsUpdating(false);
    
    setFormState({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      training_days_per_week: client.training_days_per_week,
      cost_per_session: Number(client.cost_per_session),
      goals: client.goals || '',
      notes: client.notes || '',
    });
    
    console.log('✅ Form initialized, isUpdating reset to false');
  };

  const updateFormField = (field: keyof ClientEditFormState, value: string | number) => {
    console.log('📝 Updating form field:', field, 'with value:', value);
    console.log('📊 Current isUpdating state:', isUpdating);
    
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateClient = async (clientId: string) => {
    console.log('🚀 Starting client update for ID:', clientId);
    console.log('📋 Form state:', formState);
    console.log('⏳ Setting isUpdating to true');
    
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
      console.log('📡 Calling updateClient mutation...');
      
      const updateData = {
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
      };
      
      console.log('📦 Update data being sent:', updateData);
      
      await updateClient(updateData);
      
      console.log('✅ Client update successful');
      toast({
        title: "Client Updated!",
        description: `${formState.name} has been updated successfully.`,
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error updating client:', error);
      
      let errorMessage = 'Failed to update client. Please try again.';
      
      if (error instanceof Error) {
        console.error('📝 Error message:', error.message);
        
        if (error.message.includes('row-level security')) {
          errorMessage = 'Permission denied. You can only edit your own clients.';
        } else if (error.message.includes('violates')) {
          errorMessage = 'Invalid data provided. Please check all fields.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = `Update failed: ${error.message}`;
        }
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      console.log('🏁 Setting isUpdating to false');
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    console.log('🔄 Resetting form to initial state');
    setIsUpdating(false);
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
