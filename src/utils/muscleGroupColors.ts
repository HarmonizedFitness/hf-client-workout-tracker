
export const muscleGroupColors = {
  'Back': 'bg-blue-100 border-blue-300 text-blue-800',
  'Chest': 'bg-red-100 border-red-300 text-red-800',
  'Quads': 'bg-yellow-100 border-yellow-300 text-yellow-800',
  'Hamstrings': 'bg-orange-100 border-orange-300 text-orange-800',
  'Glutes': 'bg-pink-100 border-pink-300 text-pink-800',
  'Shoulders': 'bg-purple-100 border-purple-300 text-purple-800',
  'Arms (Biceps)': 'bg-cyan-100 border-cyan-300 text-cyan-800',
  'Arms (Triceps)': 'bg-teal-100 border-teal-300 text-teal-800',
  'Calves': 'bg-indigo-100 border-indigo-300 text-indigo-800',
  'Core': 'bg-green-100 border-green-300 text-green-800',
  'Abdominals': 'bg-lime-100 border-lime-300 text-lime-800',
  'Hip Abductors': 'bg-rose-100 border-rose-300 text-rose-800',
  'Hips': 'bg-amber-100 border-amber-300 text-amber-800'
};

export const getMuscleGroupColor = (muscleGroup: string): string => {
  return muscleGroupColors[muscleGroup as keyof typeof muscleGroupColors] || 'bg-gray-100 border-gray-300 text-gray-800';
};
