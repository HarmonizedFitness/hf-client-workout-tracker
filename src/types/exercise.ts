
export interface Exercise {
  id: string;
  name: string;
  forceType: 'Pull' | 'Push' | 'Squat' | 'Raise' | 'Static' | 'Squeeze';
  muscleGroup: 'Back' | 'Chest' | 'Quads' | 'Hamstrings' | 'Glutes' | 'Shoulders' | 'Arms (Biceps)' | 'Arms (Triceps)' | 'Calves' | 'Core' | 'Abdominals';
  notes?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
  isPB?: boolean;
}

export interface WorkoutSession {
  id: string;
  clientId: string;
  date: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  date: string;
  sets: number;
  reps: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateJoined: string;
  personalRecords: PersonalRecord[];
  workoutHistory: WorkoutSession[];
}
