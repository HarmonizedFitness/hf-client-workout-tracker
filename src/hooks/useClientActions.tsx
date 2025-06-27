
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
    console.log('handleAddClient called with:', {
      name: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      training_days_per_week: newClientTrainingDays,
      cost_per_session: newClientCostPerSession,
      notes: newClientNotes,
      goals: newClientGoals,
    });

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
      notes: newClientNotes.trim() || undefined,
      goals: newClientGoals.trim() || undefined,
    };

    console.log('Calling addClient with processed data:', clientData);
    addClient(clientData);
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    console.log('Resetting client form');
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
