
-- Remove the duplicate foreign key constraint to resolve ambiguity
-- Keep the standard named constraint and remove the custom one
ALTER TABLE workout_sets DROP CONSTRAINT IF EXISTS fk_workout_sets_session;
