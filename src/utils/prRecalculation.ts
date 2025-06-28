
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
  
  try {
    // First, get all workout sessions for this client
    const { data: sessions, error: sessionsError } = await supabase
      .from('workout_sessions')
      .select('id, date')
      .eq('client_id', clientId)
      .order('date', { ascending: true });
      
    if (sessionsError) {
      console.error('Error fetching workout sessions:', sessionsError);
      throw sessionsError;
    }
    
    if (!sessions || sessions.length === 0) {
      console.log('No workout sessions found for client');
      return [];
    }
    
    console.log(`Found ${sessions.length} workout sessions for client`);
    
    // Get all workout sets for these sessions
    const sessionIds = sessions.map(s => s.id);
    const { data: workoutSets, error: setsError } = await supabase
      .from('workout_sets')
      .select('*')
      .in('session_id', sessionIds);
      
    if (setsError) {
      console.error('Error fetching workout sets:', setsError);
      throw setsError;
    }
    
    if (!workoutSets || workoutSets.length === 0) {
      console.log('No workout sets found for client');
      return [];
    }
    
    console.log(`Found ${workoutSets.length} workout sets for recalculation`);
    
    // Create a map of session IDs to dates for easy lookup
    const sessionDateMap = new Map(sessions.map(s => [s.id, s.date]));
    
    // Group sets by exercise to track PRs per exercise
    const exerciseTracker: Record<string, {
      maxWeight: { weight: number; reps: number; set: any; date: string } | null;
      maxVolume: { volume: number; weight: number; reps: number; set: any; date: string } | null;
    }> = {};
    
    const newPRs: PRSaveData[] = [];
    
    // Sort sets by date to process chronologically
    const sortedSets = workoutSets.sort((a, b) => {
      const dateA = sessionDateMap.get(a.session_id) || '';
      const dateB = sessionDateMap.get(b.session_id) || '';
      return dateA.localeCompare(dateB);
    });
    
    // Process each set chronologically to find PRs
    for (const set of sortedSets) {
      const exerciseId = set.exercise_id;
      const weight = parseFloat(set.weight.toString());
      const reps = set.reps;
      const volume = weight * reps;
      const sessionDate = sessionDateMap.get(set.session_id);
      
      if (!sessionDate) {
        console.warn(`No date found for session ${set.session_id}, skipping set`);
        continue;
      }
      
      if (!exerciseTracker[exerciseId]) {
        exerciseTracker[exerciseId] = { maxWeight: null, maxVolume: null };
      }
      
      const tracker = exerciseTracker[exerciseId];
      
      // Check for new max weight PR
      if (!tracker.maxWeight || weight > tracker.maxWeight.weight) {
        tracker.maxWeight = { weight, reps, set, date: sessionDate };
        
        newPRs.push({
          clientId,
          exerciseId,
          weight,
          reps,
          setNumber: set.set_number,
          date: sessionDate,
          sessionId: set.session_id,
          prType: 'single_weight',
        });
      }
      
      // Check for new volume PR
      if (!tracker.maxVolume || volume > tracker.maxVolume.volume) {
        tracker.maxVolume = { volume, weight, reps, set, date: sessionDate };
        
        newPRs.push({
          clientId,
          exerciseId,
          weight,
          reps,
          setNumber: set.set_number,
          date: sessionDate,
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
      try {
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
          console.error('Error saving PR:', error, 'PR data:', prData);
          throw error;
        }
        
        if (data) {
          savedPRs.push({
            ...data,
            pr_type: (data.pr_type || 'single_weight') as 'single_weight' | 'volume'
          } as PersonalRecord);
        }
      } catch (error) {
        console.error(`Failed to save PR for exercise ${prData.exerciseId}:`, error);
        // Continue with other PRs even if one fails
      }
    }
    
    console.log(`Successfully saved ${savedPRs.length} PRs`);
    return savedPRs;
    
  } catch (error) {
    console.error('Error in recalculatePRsFromWorkoutHistory:', error);
    throw error;
  }
};
