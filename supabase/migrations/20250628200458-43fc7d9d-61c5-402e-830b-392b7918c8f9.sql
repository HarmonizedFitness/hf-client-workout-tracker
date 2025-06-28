
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Trainers can view their own workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Trainers can insert their own workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Trainers can update their own workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Trainers can delete their own workout templates" ON public.workout_templates;

-- Enable Row Level Security on workout_templates table (if not already enabled)
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for trainers to view their own workout templates
CREATE POLICY "Trainers can view their own workout templates" ON public.workout_templates
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create policy for trainers to insert their own workout templates
CREATE POLICY "Trainers can insert their own workout templates" ON public.workout_templates
  FOR INSERT WITH CHECK (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create policy for trainers to update their own workout templates
CREATE POLICY "Trainers can update their own workout templates" ON public.workout_templates
  FOR UPDATE USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create policy for trainers to delete their own workout templates
CREATE POLICY "Trainers can delete their own workout templates" ON public.workout_templates
  FOR DELETE USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));
