
// Utility functions for weight display formatting
// All weights are now stored in LBS in the database

export const formatWeight = (lbs: number): string => {
  return `${lbs} lbs`;
};

export const parseWeight = (weightString: string): number => {
  // Parse weight input, removing 'lbs' suffix if present
  const cleaned = weightString.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
};

export const validateWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 2000; // Reasonable limits for gym weights
};
