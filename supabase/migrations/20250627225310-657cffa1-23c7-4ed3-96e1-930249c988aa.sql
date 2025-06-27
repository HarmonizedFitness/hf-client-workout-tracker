
-- Drop existing policies on clients table
DROP POLICY IF EXISTS "Trainers can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Trainers can insert their own clients" ON public.clients;
DROP POLICY IF EXISTS "Trainers can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Trainers can delete their own clients" ON public.clients;
DROP POLICY IF EXISTS "Trainers can manage their own clients" ON public.clients;

-- Recreate the RLS policies for the clients table
CREATE POLICY "Trainers can view their own clients" ON public.clients
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can insert their own clients" ON public.clients
  FOR INSERT WITH CHECK (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can update their own clients" ON public.clients
  FOR UPDATE USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can delete their own clients" ON public.clients
  FOR DELETE USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));
