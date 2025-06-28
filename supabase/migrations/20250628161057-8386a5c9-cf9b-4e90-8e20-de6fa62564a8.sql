
-- Complete data reset - delete in correct order to respect foreign key constraints
-- First delete personal records (they reference workout sessions)
DELETE FROM personal_records;

-- Then delete workout sets (they reference workout sessions)
DELETE FROM workout_sets;

-- Finally delete workout sessions
DELETE FROM workout_sessions;

-- Add comments to track this reset
COMMENT ON TABLE personal_records IS 'Weight values stored in pounds (LBS) only - reset and rebuilt 2025-06-28';
COMMENT ON TABLE workout_sets IS 'Weight values stored in pounds (LBS) only - reset and rebuilt 2025-06-28';
COMMENT ON TABLE workout_sessions IS 'Clean slate - reset and rebuilt 2025-06-28';
