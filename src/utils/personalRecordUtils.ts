
import { PersonalRecord, PersonalRecordWithExercise, PRCheckData, PRSaveData } from '@/types/personalRecord';
import { initialExercises } from '@/data/exerciseData';
import { lbsToKg } from '@/utils/weightConversions';

export const mapPersonalRecordsWithExercises = (records: PersonalRecord[]): PersonalRecordWithExercise[] => {
  return records.map(record => {
    const exercise = initialExercises.find(ex => ex.id === record.exercise_id);
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
  
  // Convert LBS input to KG for database storage
  const weightInKg = lbsToKg(weight);
  const totalVolumeKg = weightInKg * reps;
  
  const exercisePRs = existingPRs.filter(
    pr => pr.client_id === clientId && pr.exercise_id === exerciseId
  );

  console.log('Existing PRs:', exercisePRs);

  const newPRs: PRSaveData[] = [];

  // Check for single weight PR (1RM equivalent)
  const maxWeightPR = exercisePRs
    .filter(pr => pr.pr_type === 'single_weight')
    .reduce((max, pr) => pr.weight > max ? pr.weight : max, 0);

  console.log('Current max weight PR (KG):', maxWeightPR, 'New weight (KG):', weightInKg);

  if (weightInKg > maxWeightPR) {
    console.log('New single weight PR detected!');
    newPRs.push({
      clientId,
      exerciseId,
      weight: weightInKg,
      reps,
      setNumber,
      date,
      sessionId,
      prType: 'single_weight',
    });
  }

  // Check for volume PR
  const maxVolumePR = exercisePRs
    .filter(pr => pr.pr_type === 'volume')
    .reduce((max, pr) => (pr.total_volume || 0) > max ? (pr.total_volume || 0) : max, 0);

  console.log('Current max volume PR (KG):', maxVolumePR, 'New volume (KG):', totalVolumeKg);

  if (totalVolumeKg > maxVolumePR) {
    console.log('New volume PR detected!');
    newPRs.push({
      clientId,
      exerciseId,
      weight: weightInKg,
      reps,
      setNumber,
      date,
      sessionId,
      prType: 'volume',
      totalVolume: totalVolumeKg,
    });
  }

  return newPRs;
};
