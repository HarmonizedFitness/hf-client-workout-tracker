
import { supabase } from '@/integrations/supabase/client';
import { PersonalRecord, PRSaveData } from '@/types/personalRecord';

export const fetchPersonalRecords = async (trainerId: string, clientId?: string): Promise<PersonalRecord[]> => {
  let query = supabase
    .from('personal_records')
    .select('*')
    .order('date', { ascending: false });

  if (clientId) {
    query = query.eq('client_id', clientId);
  } else {
    // If no specific client, get records for all trainer's clients
    const { data: clients } = await supabase
      .from('clients')
      .select('id')
      .eq('trainer_id', trainerId);
    
    if (clients && clients.length > 0) {
      const clientIds = clients.map(c => c.id);
      query = query.in('client_id', clientIds);
    }
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  // Type assertion to handle the pr_type conversion from database string to our union type
  return (data || []).map(record => ({
    ...record,
    pr_type: (record.pr_type || 'single_weight') as 'single_weight' | 'volume'
  })) as PersonalRecord[];
};

export const savePR = async (prData: PRSaveData): Promise<PersonalRecord> => {
  console.log('Upserting PR:', prData);
  
  // With the unique constraint, we can safely upsert and it will update existing records
  const { data, error } = await supabase
    .from('personal_records')
    .upsert({
      client_id: prData.clientId,
      exercise_id: prData.exerciseId,
      weight: prData.weight,
      reps: prData.reps,
      set_number: prData.setNumber,
      date: prData.date,
      session_id: prData.sessionId,
      pr_type: prData.prType,
      total_volume: prData.totalVolume,
    }, {
      onConflict: 'client_id,exercise_id,pr_type',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting PR:', error);
    throw error;
  }
  
  console.log('PR upserted successfully:', data);
  
  // Type assertion to handle the pr_type conversion from database string to our union type
  return {
    ...data,
    pr_type: (data.pr_type || 'single_weight') as 'single_weight' | 'volume'
  } as PersonalRecord;
};
