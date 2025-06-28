
-- Add muscle_group column to workout_templates table
ALTER TABLE workout_templates 
ADD COLUMN muscle_group TEXT;

-- Add an index for better performance when filtering by muscle group
CREATE INDEX idx_workout_templates_muscle_group ON workout_templates(muscle_group);
