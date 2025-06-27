
import { useState } from 'react';
import { mockClients } from '@/data/clientData';
import { Client } from '@/types/exercise';
import { toast } from '@/hooks/use-toast';

export const useClientActions = (onClientSelect: (client: Client) => void) => {
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientTrainingDays, setNewClientTrainingDays] = useState(3);
  const [newClientCostPerSession, setNewClientCostPerSession] = useState(75);

  const handleAddClient = () => {
    if (!newClientName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the client's name.",
        variant: "destructive",
      });
      return;
    }

    const newClient: Client = {
      id: (mockClients.length + 1).toString(),
      name: newClientName.trim(),
      email: newClientEmail.trim() || undefined,
      phone: newClientPhone.trim() || undefined,
      dateJoined: new Date().toISOString().split('T')[0],
      isActive: true,
      trainingDaysPerWeek: newClientTrainingDays,
      costPerSession: newClientCostPerSession,
      personalRecords: [],
      workoutHistory: []
    };

    mockClients.push(newClient);
    onClientSelect(newClient);
    
    // Reset form
    resetForm();

    toast({
      title: "Client Added!",
      description: `${newClient.name} has been added to your client list.`,
    });
  };

  const resetForm = () => {
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientTrainingDays(3);
    setNewClientCostPerSession(75);
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
    },
    handleAddClient,
    resetForm,
  };
};
