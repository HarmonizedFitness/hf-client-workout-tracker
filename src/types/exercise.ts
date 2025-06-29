export interface Exercise {
  id: string;
  name: string;
  forceType: 'Pull' | 'Push' | 'Squat' | 'Raise' | 'Static' | 'Squeeze' | 'Rotate' | 'Twist' | 'Stretch' | 'Hold';
  muscleGroup: 'Back' | 'Chest' | 'Quads' | 'Hamstrings' | 'Glutes' | 'Shoulders' | 'Arms (Biceps)' | 'Arms (Triceps)' | 'Calves' | 'Core' | 'Abdominals' | 'Hip Abductors' | 'Hips';
  notes?: string;
  isFavorite?: boolean;
  dbId?: string; // Database ID for exercises that exist in Supabase
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
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
  setNumber: number;
  reps: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateJoined: string;
  isActive: boolean;
  trainingDaysPerWeek: number;
  costPerSession: number;
  dateArchived?: string;
  personalRecords: PersonalRecord[];
  workoutHistory: WorkoutSession[];
}
