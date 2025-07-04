
-- Add new columns to workout_sets table to support enhanced functionality
ALTER TABLE public.workout_sets 
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS circuit_id TEXT,
ADD COLUMN IF NOT EXISTS exercise_notes TEXT;

-- Create index for better performance on position queries
CREATE INDEX IF NOT EXISTS idx_workout_sets_session_position 
ON public.workout_sets(session_id, position);

-- Create index for circuit queries
CREATE INDEX IF NOT EXISTS idx_workout_sets_circuit 
ON public.workout_sets(session_id, circuit_id);

-- Update existing workout_sets to have proper position values
WITH ranked_sets AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at, exercise_id) as new_position
  FROM workout_sets 
  WHERE position IS NULL OR position = 1
)
UPDATE workout_sets 
SET position = ranked_sets.new_position
FROM ranked_sets 
WHERE workout_sets.id = ranked_sets.id;

-- Ensure position is never null going forward
ALTER TABLE public.workout_sets 
ALTER COLUMN position SET NOT NULL;
