
import { PersonalRecord, PersonalRecordWithExercise, PRCheckData, PRSaveData } from '@/types/personalRecord';
import { initialExercises } from '@/data/exerciseData';
import { SupabaseExercise } from '@/hooks/useExercises';

export const mapPersonalRecordsWithExercises = (
  records: PersonalRecord[], 
  customExercises: SupabaseExercise[] = []
): PersonalRecordWithExercise[] => {
  return records.map(record => {
    // First check initial exercises
    let exercise = initialExercises.find(ex => ex.id === record.exercise_id);
    
    // If not found, check custom exercises from Supabase
    if (!exercise) {
      exercise = customExercises.find(ex => ex.id === record.exercise_id);
    }
    
    return {
      ...record,
      pr_type: record.pr_type || 'single_weight',
      total_volume: record.total_volume || null,
      exercise_name: exercise?.name || 'Unknown Exercise'
    };
  });
};

export const checkForNewPRs = (
  existingPRs: PersonalRecord[],
  checkData: PRCheckData
): PRSaveData[] => {
  const { clientId, exerciseId, weight, reps, setNumber, date, sessionId } = checkData;
  
  console.log('Checking PRs for:', checkData);
  
  const weightInLbs = weight;
  const singleSetVolume = weightInLbs * reps; // Volume for this specific set
  
  const exercisePRs = existingPRs.filter(
    pr => pr.client_id === clientId && pr.exercise_id === exerciseId
  );

  console.log('Existing PRs for exercise:', exercisePRs);

  const newPRs: PRSaveData[] = [];

  // Check for Max Weight PR - find the absolute heaviest weight ever lifted
  const currentMaxWeight = exercisePRs
    .filter(pr => pr.pr_type === 'single_weight')
    .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);

  console.log('Current max weight PR (LBS):', currentMaxWeight, 'New weight (LBS):', weightInLbs);

  if (weightInLbs > currentMaxWeight) {
    console.log('New max weight PR detected!');
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

  // Check for Volume PR - find the highest single-set volume (weight × reps)
  const currentMaxVolume = exercisePRs
    .filter(pr => pr.pr_type === 'volume')
    .reduce((max, pr) => (pr.total_volume || 0) > max ? (pr.total_volume || 0) : max, 0);

  console.log('Current max volume PR (LBS):', currentMaxVolume, 'New single-set volume (LBS):', singleSetVolume);

  if (singleSetVolume > currentMaxVolume) {
    console.log('New volume PR detected!');
    newPRs.push({
      clientId,
      exerciseId,
      weight: weightInLbs,
      reps,
      setNumber,
      date,
      sessionId,
      prType: 'volume',
      totalVolume: singleSetVolume, // Store the single-set volume
    });
  }

  return newPRs;
};
