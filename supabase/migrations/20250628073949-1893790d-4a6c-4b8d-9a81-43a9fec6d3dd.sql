
-- First, let's check if we need to add any columns to the existing exercises table
-- and create a workout_templates table for saved workouts

-- Add a created_by column to exercises table if it doesn't exist (for custom exercises)
-- This will allow trainers to create their own exercises
ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS created_by_trainer_id UUID REFERENCES public.trainers(id);

-- Create workout_templates table for saved workout combinations
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  exercise_ids UUID[] NOT NULL, -- Array of exercise IDs
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on workout_templates
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workout_templates
CREATE POLICY "Trainers can view their own workout templates" ON public.workout_templates
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can manage their own workout templates" ON public.workout_templates
  FOR ALL USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Update exercises RLS policy to allow trainers to create custom exercises
DROP POLICY IF EXISTS "Trainers can create exercises" ON public.exercises;
CREATE POLICY "Trainers can create exercises" ON public.exercises
  FOR INSERT WITH CHECK (
    created_by IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()) OR
    created_by_trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
  );

-- Update exercises select policy to include trainer's custom exercises
DROP POLICY IF EXISTS "Anyone can view public exercises" ON public.exercises;
CREATE POLICY "Users can view public exercises and their own custom exercises" ON public.exercises
  FOR SELECT USING (
    is_public = TRUE OR 
    created_by IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()) OR
    created_by_trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_created_by_trainer_id ON public.exercises(created_by_trainer_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_trainer_id ON public.workout_templates(trainer_id);
