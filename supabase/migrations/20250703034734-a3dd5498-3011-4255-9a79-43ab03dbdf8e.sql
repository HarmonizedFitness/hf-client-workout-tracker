
-- Fix the exercises table id column to use proper UUID generation
ALTER TABLE public.exercises 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Remove any duplicate constraint issues by ensuring proper primary key
-- First, let's see if there are any constraint issues to resolve
DO $$
BEGIN
    -- Check if there's a problematic constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'exercises_pkey1' 
        AND table_name = 'exercises'
    ) THEN
        -- Drop the problematic constraint if it exists
        ALTER TABLE public.exercises DROP CONSTRAINT IF EXISTS exercises_pkey1;
    END IF;
    
    -- Ensure we have a proper primary key constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'exercises_pkey' 
        AND table_name = 'exercises' 
        AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE public.exercises ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);
    END IF;
END $$;
