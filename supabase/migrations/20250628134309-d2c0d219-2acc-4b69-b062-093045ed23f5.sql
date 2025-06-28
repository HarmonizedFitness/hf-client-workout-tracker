
-- Drop foreign key constraints first
ALTER TABLE workout_sets DROP CONSTRAINT IF EXISTS workout_sets_exercise_id_fkey;
ALTER TABLE personal_records DROP CONSTRAINT IF EXISTS personal_records_exercise_id_fkey;

-- Update workout_sets table to use TEXT for exercise_id instead of UUID
ALTER TABLE workout_sets ALTER COLUMN exercise_id TYPE TEXT;

-- Update personal_records table to use TEXT for exercise_id instead of UUID
ALTER TABLE personal_records ALTER COLUMN exercise_id TYPE TEXT;

-- Since we're now using TEXT exercise_ids that match the data structure in exerciseData.ts,
-- we won't recreate the foreign key constraints as they would reference incompatible types
-- The exercise_id will now store the string IDs from exerciseData.ts (like "1", "2", etc.)
