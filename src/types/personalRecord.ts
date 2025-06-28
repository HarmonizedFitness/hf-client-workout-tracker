
export interface PersonalRecord {
  id: string;
  client_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  set_number: number;
  date: string;
  session_id?: string;
  total_volume?: number;
  pr_type: 'single_weight' | 'volume';
  created_at: string;
}

export interface PersonalRecordWithExercise extends PersonalRecord {
  exercise_name: string;
}

export interface PRCheckData {
  clientId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  setNumber: number;
  date: string;
  sessionId?: string;
}

export interface PRSaveData extends PRCheckData {
  prType: 'single_weight' | 'volume';
  totalVolume?: number;
}
