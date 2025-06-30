import { PersonalRecord, PersonalRecordWithExercise, PRCheckData, PRSaveData } from '@/types/personalRecord';
import { Exercises } from '@/data/exercises'; // updated import
import { SupabaseExercise } from '@/hooks/useExercises';

export const mapPersonalRecordsWithExercises = (
  records: PersonalRecord[], 
  customExercises: SupabaseExercise[] = []
): PersonalRecordWithExercise[] => {
  return records.map(record => {
    // First check Exercises (includes built-in + favorites from Supabase)
    let exerciseName = Exercises.find(ex => ex.id === record.exercise_id)?.name;
    
    // If not found, check additional custom exercises (rare case)
    if (!exerciseName) {
      exerciseName = customExercises.find(ex => ex.id === record.exercise_id)?.name;
    }
    
    return {
      ...record,
      pr_type: record.pr_type || 'single_weight',
      total_volume: record.total_volume || null,
      exercise_name: exerciseName || 'Unknown Exercise'
    };
  });
};

export const checkForNewPRs = (
  existingPRs: PersonalRecord[],
  checkData: PRCheckData
): PRSaveData[] => {
  const { clientId, exerciseId, weight, reps, setNumber, date, sessionId } = checkData;
  
  const weightInLbs = weight;
  const singleSetVolume = weightInLbs * reps;
  
  const exercisePRs = existingPRs.filter(
    pr => pr.client_id === clientId && pr.exercise_id === exerciseId
  );

  const newPRs: PRSaveData[] = [];

  // Check for Max Weight PR
  const currentMaxWeightPR = exercisePRs
    .filter(pr => pr.pr_type === 'single_weight')
    .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);

  if (weightInLbs > currentMaxWeightPR) {
    newPRs.push({
      clientId,
      exerciseId,
      weight: weightInLbs,
      reps,
      setNumber,
      date,
      sessionId,
      prType: 'single_weight',
    });
  }

  // Check for Volume PR
  const currentMaxVolumePR = exercisePRs
    .filter(pr => pr.pr_type === 'volume')
    .reduce((max, pr) => (pr.total_volume || 0) > max ? (pr.total_volume || 0) : max, 0);

  if (singleSetVolume > currentMaxVolumePR) {
    newPRs.push({
      clientId,
      exerciseId,
      weight: weightInLbs,
      reps,
      setNumber,
      date,
      sessionId,
      prType: 'volume',
      totalVolume: singleSetVolume,
    });
  }

  return newPRs;
};
