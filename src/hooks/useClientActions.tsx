
import { useState } from 'react';
import { useSupabaseClients } from './useSupabaseClients';
import { toast } from '@/hooks/use-toast';

export const useClientActions = () => {
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientTrainingDays, setNewClientTrainingDays] = useState(3);
  const [newClientCostPerSession, setNewClientCostPerSession] = useState(75);
  const [newClientNotes, setNewClientNotes] = useState('');
  const [newClientGoals, setNewClientGoals] = useState('');

  const { addClient, isAddingClient } = useSupabaseClients();

  const handleAddClient = () => {
    console.log('🎯 handleAddClient called with:', {
      name: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      training_days_per_week: newClientTrainingDays,
      cost_per_session: newClientCostPerSession,
      notes: newClientNotes,
      goals: newClientGoals,
    });

    // Enhanced validation
    if (!newClientName.trim()) {
      console.error('❌ Validation failed: Name is required');
      toast({
        title: "Name Required",
        description: "Please enter the client's name.",
        variant: "destructive",
      });
      return;
    }

    if (newClientName.trim().length < 2) {
      console.error('❌ Validation failed: Name too short');
      toast({
        title: "Invalid Name",
        description: "Client name must be at least 2 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newClientTrainingDays < 1 || newClientTrainingDays > 7) {
      console.error('❌ Validation failed: Invalid training days');
      toast({
        title: "Invalid Training Days",
        description: "Training days must be between 1 and 7.",
        variant: "destructive",
      });
      return;
    }

    if (newClientCostPerSession < 0) {
      console.error('❌ Validation failed: Invalid cost per session');
      toast({
        title: "Invalid Cost",
        description: "Cost per session cannot be negative.",
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
      notes: newClientNotes.trim() || undefined,
      goals: newClientGoals.trim() || undefined,
    };

    console.log('✅ Validation passed, calling addClient with processed data:', clientData);
    
    try {
      addClient(clientData);
      console.log('🚀 addClient called successfully, resetting form');
      // Reset form immediately - the success handler will handle the toast
      resetForm();
    } catch (error) {
      console.error('💥 Error calling addClient:', error);
    }
  };

  const resetForm = () => {
    console.log('🔄 Resetting client form');
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientTrainingDays(3);
    setNewClientCostPerSession(75);
    setNewClientNotes('');
    setNewClientGoals('');
  };

  return {
    formState: {
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
    },
    handleAddClient,
    resetForm,
    isAddingClient,
  };
};
