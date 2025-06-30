import { backExercises } from './backExercises';
import { chestExercises } from './chestExercises';
import { shoulderExercises } from './shoulderExercises';
import { armBicepsExercises } from './armBicepsExercises';
import { armTricepsExercises } from './armTricepsExercises';
import { legExercises } from './legExercises';
import { calvesExercises } from './calvesExercises';
import { coreExercises } from './coreExercises';

export const Exercises = [
  ...backExercises,
  ...chestExercises,
  ...shoulderExercises,
  ...armBicepsExercises,
  ...armTricepsExercises,
  ...legExercises,
  ...calvesExercises,
  ...coreExercises,
];

// Optionally still export the muscle group arrays too
export {
  backExercises,
  chestExercises,
  shoulderExercises,
  armBicepsExercises,
  armTricepsExercises,
  legExercises,
  calvesExercises,
  coreExercises,
};
