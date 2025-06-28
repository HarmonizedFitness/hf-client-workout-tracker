
import { supabase } from '@/integrations/supabase/client';
import { PersonalRecord, PRSaveData } from '@/types/personalRecord';

export const clearAllPRsForClient = async (clientId: string): Promise<void> => {
  console.log('Clearing all PRs for client:', clientId);
  
  const { error } = await supabase
    .from('personal_records')
    .delete()
    .eq('client_id', clientId);
    
  if (error) {
    console.error('Error clearing PRs:', error);
    throw error;
  }
  
  console.log('Successfully cleared all PRs for client');
};

export const recalculatePRsFromWorkoutHistory = async (clientId: string): Promise<PersonalRecord[]> => {
  console.log('Recalculating PRs from workout history for client:', clientId);
  
  // Get all workout sets for this client, ordered by date
  const { data: workoutSets, error: setsError } = await supabase
    .from('workout_sets')
    .select(`
      *,
      workout_sessions!inner(client_id, date)
    `)
    .eq('workout_sessions.client_id', clientId)
    .order('workout_sessions.date', { ascending: true });
    
  if (setsError) {
    console.error('Error fetching workout sets:', setsError);
    throw setsError;
  }
  
  if (!workoutSets || workoutSets.length === 0) {
    console.log('No workout sets found for client');
    return [];
  }
  
  console.log(`Found ${workoutSets.length} workout sets for recalculation`);
  
  // Group sets by exercise to track PRs per exercise
  const exerciseTracker: Record<string, {
    maxWeight: { weight: number; reps: number; set: any; session: any } | null;
    maxVolume: { volume: number; weight: number; reps: number; set: any; session: any } | null;
  }> = {};
  
  const newPRs: PRSaveData[] = [];
  
  // Process each set chronologically to find PRs
  for (const set of workoutSets) {
    const exerciseId = set.exercise_id;
    const weight = parseFloat(set.weight.toString());
    const reps = set.reps;
    const volume = weight * reps;
    const session = (set as any).workout_sessions;
    
    if (!exerciseTracker[exerciseId]) {
      exerciseTracker[exerciseId] = { maxWeight: null, maxVolume: null };
    }
    
    const tracker = exerciseTracker[exerciseId];
    
    // Check for new max weight PR
    if (!tracker.maxWeight || weight > tracker.maxWeight.weight) {
      tracker.maxWeight = { weight, reps, set, session };
      
      newPRs.push({
        clientId,
        exerciseId,
        weight,
        reps,
        setNumber: set.set_number,
        date: session.date,
        sessionId: set.session_id,
        prType: 'single_weight',
      });
    }
    
    // Check for new volume PR
    if (!tracker.maxVolume || volume > tracker.maxVolume.volume) {
      tracker.maxVolume = { volume, weight, reps, set, session };
      
      newPRs.push({
        clientId,
        exerciseId,
        weight,
        reps,
        setNumber: set.set_number,
        date: session.date,
        sessionId: set.session_id,
        prType: 'volume',
        totalVolume: volume,
      });
    }
  }
  
  console.log(`Identified ${newPRs.length} PRs to save`);
  
  // Save all the PRs
  const savedPRs: PersonalRecord[] = [];
  
  for (const prData of newPRs) {
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
      console.error('Error saving PR:', error);
      throw error;
    }
    
    if (data) {
      savedPRs.push({
        ...data,
        pr_type: (data.pr_type || 'single_weight') as 'single_weight' | 'volume'
      } as PersonalRecord);
    }
  }
  
  console.log(`Successfully saved ${savedPRs.length} PRs`);
  return savedPRs;
};
