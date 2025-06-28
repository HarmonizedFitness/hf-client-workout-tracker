
// Utility functions for weight conversions between KG and LBS
export const KG_TO_LBS = 2.20462;
export const LBS_TO_KG = 1 / KG_TO_LBS;

export const kgToLbs = (kg: number): number => {
  return Math.round(kg * KG_TO_LBS * 10) / 10; // Round to 1 decimal place
};

export const lbsToKg = (lbs: number): number => {
  return Math.round(lbs * LBS_TO_KG * 10) / 10; // Round to 1 decimal place
};

export const formatWeight = (kg: number): string => {
  return `${kgToLbs(kg)} lbs`;
};
