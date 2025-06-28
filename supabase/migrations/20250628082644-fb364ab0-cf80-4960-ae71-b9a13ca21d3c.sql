
-- Add missing columns to personal_records table
ALTER TABLE personal_records 
ADD COLUMN pr_type TEXT DEFAULT 'single_weight' CHECK (pr_type IN ('single_weight', 'volume')),
ADD COLUMN total_volume NUMERIC;
