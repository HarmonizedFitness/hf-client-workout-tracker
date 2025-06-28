
-- First, let's clean up duplicate personal records by keeping only the best record for each exercise type
-- For single_weight PRs: keep the highest weight
-- For volume PRs: keep the highest total volume

-- Create a temporary table with the IDs of records to keep
WITH records_to_keep AS (
  SELECT DISTINCT ON (client_id, exercise_id, pr_type) id
  FROM personal_records
  ORDER BY client_id, exercise_id, pr_type, 
    CASE 
      WHEN pr_type = 'single_weight' THEN weight 
      WHEN pr_type = 'volume' THEN COALESCE(total_volume, 0)
      ELSE weight 
    END DESC
)
-- Delete all records that are not in the records_to_keep list
DELETE FROM personal_records 
WHERE id NOT IN (SELECT id FROM records_to_keep);

-- Add unique constraint to prevent future duplicates
ALTER TABLE personal_records 
ADD CONSTRAINT unique_client_exercise_pr_type 
UNIQUE (client_id, exercise_id, pr_type);

-- Add cascade delete for workout sets when workout sessions are deleted
-- First, let's add the foreign key constraint if it doesn't exist
ALTER TABLE workout_sets 
ADD CONSTRAINT fk_workout_sets_session 
FOREIGN KEY (session_id) 
REFERENCES workout_sessions(id) 
ON DELETE CASCADE;
