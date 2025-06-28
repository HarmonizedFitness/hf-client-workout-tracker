
export interface SupabaseClient {
  id: string;
  trainer_id: string;
  name: string;
  email?: string;
  phone?: string;
  date_joined: string;
  is_active: boolean;
  date_archived?: string;
  training_days_per_week: number;
  cost_per_session: number;
  notes?: string;
  goals?: string;
  created_at: string;
  updated_at: string;
}

export interface NewClientData {
  name: string;
  email?: string;
  phone?: string;
  training_days_per_week: number;
  cost_per_session: number;
  notes?: string;
  goals?: string;
}

export interface ClientUpdateData {
  id: string;
  updates: Partial<SupabaseClient>;
}
