
-- Add missing columns to the exercises table
ALTER TABLE public.exercises 
ADD COLUMN is_favorite boolean DEFAULT false,
ADD COLUMN trainer_id uuid REFERENCES public.trainers(id),
ADD COLUMN notes text,
ADD COLUMN is_public boolean DEFAULT true,
ADD COLUMN created_by_trainer_id uuid REFERENCES public.trainers(id);

-- Create index for better performance on trainer queries
CREATE INDEX idx_exercises_trainer_id ON public.exercises(trainer_id);
CREATE INDEX idx_exercises_created_by_trainer_id ON public.exercises(created_by_trainer_id);

-- Enable RLS on exercises table
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Create policy to allow trainers to view all public exercises and their own
CREATE POLICY "Trainers can view public exercises and their own" 
  ON public.exercises 
  FOR SELECT 
  USING (
    is_public = true OR 
    created_by_trainer_id = (SELECT id FROM trainers WHERE user_id = auth.uid()) OR
    trainer_id = (SELECT id FROM trainers WHERE user_id = auth.uid())
  );

-- Create policy to allow trainers to update favorites on exercises
CREATE POLICY "Trainers can update exercise favorites" 
  ON public.exercises 
  FOR UPDATE 
  USING (
    is_public = true OR 
    created_by_trainer_id = (SELECT id FROM trainers WHERE user_id = auth.uid())
  );

-- Create policy to allow trainers to insert their own exercises
CREATE POLICY "Trainers can insert their own exercises" 
  ON public.exercises 
  FOR INSERT 
  WITH CHECK (created_by_trainer_id = (SELECT id FROM trainers WHERE user_id = auth.uid()));
