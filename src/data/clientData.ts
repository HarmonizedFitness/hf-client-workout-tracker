
import { Client } from '@/types/exercise';

// Mock client data - in a real app this would come from a database
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    dateJoined: '2024-01-15',
    personalRecords: [
      { exerciseId: '34', exerciseName: 'Barbell Squat', weight: 225, date: '2024-02-20', sets: 3, reps: 5 },
      { exerciseId: '16', exerciseName: 'Barbell Bench Press ( Flat )', weight: 185, date: '2024-02-18', sets: 3, reps: 5 },
    ],
    workoutHistory: []
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    dateJoined: '2024-01-20',
    personalRecords: [
      { exerciseId: '34', exerciseName: 'Barbell Squat', weight: 135, date: '2024-02-22', sets: 3, reps: 8 },
      { exerciseId: '46', exerciseName: 'Romanian Deadlift', weight: 155, date: '2024-02-19', sets: 3, reps: 6 },
    ],
    workoutHistory: []
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '(555) 345-6789',
    dateJoined: '2024-02-01',
    personalRecords: [
      { exerciseId: '49', exerciseName: 'Conventional Deadlift', weight: 315, date: '2024-02-21', sets: 1, reps: 3 },
      { exerciseId: '64', exerciseName: 'Overhead Press (Military Press)', weight: 135, date: '2024-02-20', sets: 3, reps: 5 },
    ],
    workoutHistory: []
  }
];
