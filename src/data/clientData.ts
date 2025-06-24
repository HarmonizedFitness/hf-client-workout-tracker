
import { Client } from '@/types/exercise';

// Mock client data - in a real app this would come from a database
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    dateJoined: '2024-01-15',
    isActive: true,
    trainingDaysPerWeek: 3,
    costPerSession: 75,
    personalRecords: [
      { exerciseId: '34', exerciseName: 'Barbell Squat', weight: 225, date: '2024-02-20', setNumber: 1, reps: 5 },
      { exerciseId: '16', exerciseName: 'Barbell Bench Press ( Flat )', weight: 185, date: '2024-02-18', setNumber: 1, reps: 5 },
    ],
    workoutHistory: []
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    dateJoined: '2024-01-20',
    isActive: true,
    trainingDaysPerWeek: 4,
    costPerSession: 80,
    personalRecords: [
      { exerciseId: '34', exerciseName: 'Barbell Squat', weight: 135, date: '2024-02-22', setNumber: 1, reps: 8 },
      { exerciseId: '46', exerciseName: 'Romanian Deadlift', weight: 155, date: '2024-02-19', setNumber: 1, reps: 6 },
    ],
    workoutHistory: []
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '(555) 345-6789',
    dateJoined: '2024-02-01',
    isActive: false,
    trainingDaysPerWeek: 2,
    costPerSession: 65,
    dateArchived: '2024-06-15',
    personalRecords: [
      { exerciseId: '49', exerciseName: 'Conventional Deadlift', weight: 315, date: '2024-02-21', setNumber: 1, reps: 3 },
      { exerciseId: '64', exerciseName: 'Overhead Press (Military Press)', weight: 135, date: '2024-02-20', setNumber: 1, reps: 5 },
    ],
    workoutHistory: []
  }
];

export const getActiveClients = (): Client[] => {
  return mockClients.filter(client => client.isActive);
};

export const getArchivedClients = (): Client[] => {
  return mockClients.filter(client => !client.isActive);
};

export const archiveClient = (clientId: string): void => {
  const client = mockClients.find(c => c.id === clientId);
  if (client) {
    client.isActive = false;
    client.dateArchived = new Date().toISOString().split('T')[0];
  }
};

export const restoreClient = (clientId: string): void => {
  const client = mockClients.find(c => c.id === clientId);
  if (client) {
    client.isActive = true;
    client.dateArchived = undefined;
  }
};
