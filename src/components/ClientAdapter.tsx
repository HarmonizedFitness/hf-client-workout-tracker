
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { Client } from '@/types/exercise';

// Helper function to convert SupabaseClient to legacy Client format
export const adaptSupabaseClientToLegacyClient = (supabaseClient: SupabaseClient): Client => {
  return {
    id: supabaseClient.id,
    name: supabaseClient.name,
    email: supabaseClient.email,
    phone: supabaseClient.phone,
    dateJoined: supabaseClient.date_joined || new Date().toISOString(),
    isActive: supabaseClient.is_active,
    trainingDaysPerWeek: supabaseClient.training_days_per_week,
    costPerSession: Number(supabaseClient.cost_per_session),
    dateArchived: supabaseClient.date_archived || undefined,
    personalRecords: [], // This would need to be fetched separately
    workoutHistory: [], // This would need to be fetched separately
  };
};

// Helper function to convert legacy Client to SupabaseClient format
export const adaptLegacyClientToSupabaseClient = (client: Client, trainerId: string): Partial<SupabaseClient> => {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    date_joined: client.dateJoined.split('T')[0], // Convert to date format
    is_active: client.isActive,
    training_days_per_week: client.trainingDaysPerWeek,
    cost_per_session: client.costPerSession,
    date_archived: client.dateArchived?.split('T')[0], // Convert to date format
    trainer_id: trainerId,
  };
};
