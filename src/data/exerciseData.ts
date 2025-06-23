
import { Exercise } from '@/types/exercise';

export const initialExercises: Exercise[] = [
  // Back Exercises
  { id: '1', name: 'Cable Bent Lat Pulldown', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '2', name: 'Cable Pull Over', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '3', name: 'Cable Rope Reverse Grip', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '4', name: 'Cable Rope Neutral Grip', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '5', name: 'Cable Wide Straight Grip', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '6', name: 'Dumbbell Row', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '7', name: 'Deep Grip Lat Pulldown', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '8', name: 'Landmine Low Pull-Grip', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '9', name: 'Machine Lat Pulldown', forceType: 'Pull', muscleGroup: 'Back' },
  { id: '10', name: 'Dumbbell Shrug', forceType: 'Pull', muscleGroup: 'Back' },

  // Chest Exercises
  { id: '11', name: 'Barbell Bench Press ( Flat )', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '12', name: 'Barbell Bench Press (Close Grip)', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '13', name: 'Barbell Bench Press (Decline)', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '14', name: 'Barbell Bench Press (Incline)', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '15', name: 'Cable Crossover (High to Low)', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '16', name: 'Cable Crossover (Low to High)', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '17', name: 'Cable Fly (Decline, High to Low )', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '18', name: 'Cable Fly (Flat, Neutral)', forceType: 'Push', muscleGroup: 'Chest' },
  { id: '19', name: 'Cable Fly (Incline, Low to High )', forceType: 'Push', muscleGroup: 'Chest' },

  // Quads Exercises
  { id: '20', name: 'Barbell Front Squat', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '21', name: 'Barbell Lunge', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '22', name: 'Barbell Squat', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '23', name: 'Bulgarian Split Squat', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '24', name: 'Calf Raise Squat', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '25', name: 'Front Rack Lunge (Barbell)', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '26', name: 'Goblet Squat (Dumbbell)', forceType: 'Squat', muscleGroup: 'Quads' },
  { id: '27', name: 'Hack Squat', forceType: 'Squat', muscleGroup: 'Quads' },

  // Hamstrings/Glutes Exercises
  { id: '28', name: 'Barbell Glute Lunges', forceType: 'Squat', muscleGroup: 'Hamstrings' },
  { id: '29', name: 'Good Morning', forceType: 'Squat', muscleGroup: 'Hamstrings' },
  { id: '30', name: 'Romanian Deadlift', forceType: 'Pull', muscleGroup: 'Hamstrings' },
  { id: '31', name: 'Single Leg Glute Ham Bridge', forceType: 'Squeeze', muscleGroup: 'Glutes' },
  { id: '32', name: 'Single Leg Romanian Deadlift', forceType: 'Pull', muscleGroup: 'Hamstrings' },

  // Shoulders Exercises
  { id: '33', name: 'Arnold Press', forceType: 'Push', muscleGroup: 'Shoulders' },
  { id: '34', name: 'Barbell Behind Neck Press', forceType: 'Push', muscleGroup: 'Shoulders' },
  { id: '35', name: 'Barbell Shrug', forceType: 'Raise', muscleGroup: 'Shoulders' },
  { id: '36', name: 'Bradford Press', forceType: 'Push', muscleGroup: 'Shoulders' },
  { id: '37', name: 'Dumbbell External Isolation', forceType: 'Raise', muscleGroup: 'Shoulders' },
  { id: '38', name: 'Dumbbell Internal Isolation', forceType: 'Raise', muscleGroup: 'Shoulders' },
  { id: '39', name: 'Dumbbell Shrug', forceType: 'Raise', muscleGroup: 'Shoulders' },
  { id: '40', name: 'Face Pulls', forceType: 'Pull', muscleGroup: 'Shoulders' },

  // Arms (Biceps)
  { id: '41', name: 'Barbell Preacher Curl', forceType: 'Pull', muscleGroup: 'Arms (Biceps)' },
  { id: '42', name: 'Barbell Curl', forceType: 'Pull', muscleGroup: 'Arms (Biceps)' },
  { id: '43', name: 'Cable Rope Bicep Curl', forceType: 'Pull', muscleGroup: 'Arms (Biceps)' },
  { id: '44', name: 'Hammer Curl', forceType: 'Pull', muscleGroup: 'Arms (Biceps)' },
  { id: '45', name: 'Incline Dumbbell Curl', forceType: 'Pull', muscleGroup: 'Arms (Biceps)' },

  // Arms (Triceps)
  { id: '46', name: 'Barbell Lying Tricep Extension', forceType: 'Push', muscleGroup: 'Arms (Triceps)' },
  { id: '47', name: 'Cable Rope Tricep Push-down', forceType: 'Push', muscleGroup: 'Arms (Triceps)' },
  { id: '48', name: 'Dip Machine', forceType: 'Push', muscleGroup: 'Arms (Triceps)' },
  { id: '49', name: 'Overhead Tricep Extension', forceType: 'Push', muscleGroup: 'Arms (Triceps)' },

  // Calves
  { id: '50', name: 'Standing Calf Raise', forceType: 'Raise', muscleGroup: 'Calves' },
  { id: '51', name: 'Seated Calf Raise', forceType: 'Raise', muscleGroup: 'Calves' },

  // Core/Abdominals
  { id: '52', name: 'Ab Bike', forceType: 'Squeeze', muscleGroup: 'Abdominals' },
  { id: '53', name: 'Cable Crunch', forceType: 'Squeeze', muscleGroup: 'Abdominals' },
  { id: '54', name: 'Crunches', forceType: 'Squeeze', muscleGroup: 'Abdominals' },
  { id: '55', name: 'Hanging Crunch', forceType: 'Squeeze', muscleGroup: 'Abdominals' },
  { id: '56', name: 'Plank', forceType: 'Static', muscleGroup: 'Core' },
  { id: '57', name: 'Russian Twist', forceType: 'Squeeze', muscleGroup: 'Abdominals' }
];
