
export interface WorkoutExercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  technicalCues: string[];
  somaticCues: string[];
  beginnerModification: string;
  advancedModification: string;
  commonMistakes: string[];
  videoUrl: string;
  duration?: string;
  reps?: string;
  sets?: string;
}

export interface WorkoutSection {
  title: string;
  emoji: string;
  duration: string;
  exercises: WorkoutExercise[];
  instructions?: string[];
}

export interface WorkoutDay {
  dayNumber: number;
  title: string;
  theme: string;
  introduction: string[];
  mindsetMoment: {
    theme: string;
    positioning: string;
    breathingPattern: string;
    affirmation: string;
    visualization: string;
    closingAwareness: string;
    drUQuote: string;
  };
  movementPreparation: WorkoutSection;
  mainWorkout: WorkoutSection;
  coolDown: WorkoutSection;
  keyTakeaways: string[];
  tomorrowPreview: string;
  cta: {
    text: string;
    product: string;
    link: string;
  };
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  type: 'bodyweight' | 'trx' | 'stretching';
  level: string;
  duration: string;
  equipment: string[];
  days: WorkoutDay[];
}
