
-- Create enum types for better data integrity
CREATE TYPE public.app_role AS ENUM ('admin', 'trainer', 'client');
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'pro', 'enterprise');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Create trainers table (coaches who use the platform)
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  subscription_tier subscription_tier DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  client_limit INTEGER DEFAULT 15,
  branding_colors JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#10B981"}',
  google_sheets_connected BOOLEAN DEFAULT FALSE,
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table (linked to specific trainers)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_joined DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  date_archived DATE,
  training_days_per_week INTEGER DEFAULT 3,
  cost_per_session DECIMAL(10,2) DEFAULT 75.00,
  notes TEXT,
  goals TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table (shared across all trainers)
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  force_type TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.trainers(id),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_sessions table
CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  duration_minutes INTEGER,
  synced_to_sheets BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_sets table
CREATE TABLE public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  is_pr BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create personal_records table
CREATE TABLE public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  date DATE NOT NULL,
  set_number INTEGER NOT NULL,
  session_id UUID REFERENCES public.workout_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table for scheduling
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status appointment_status DEFAULT 'scheduled',
  notes TEXT,
  google_calendar_event_id TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trainer_integrations table for API connections
CREATE TABLE public.trainer_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  integration_type TEXT NOT NULL, -- 'google_sheets', 'google_calendar', 'stripe'
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trainer_id, integration_type)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trainers
CREATE POLICY "Trainers can view their own profile" ON public.trainers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Trainers can update their own profile" ON public.trainers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Trainers can insert their own profile" ON public.trainers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for clients
CREATE POLICY "Trainers can view their own clients" ON public.clients
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can manage their own clients" ON public.clients
  FOR ALL USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create RLS policies for exercises
CREATE POLICY "Anyone can view public exercises" ON public.exercises
  FOR SELECT USING (is_public = TRUE OR created_by IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can create exercises" ON public.exercises
  FOR INSERT WITH CHECK (created_by IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create RLS policies for workout_sessions
CREATE POLICY "Trainers can view their clients' sessions" ON public.workout_sessions
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can manage their clients' sessions" ON public.workout_sessions
  FOR ALL USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create RLS policies for workout_sets
CREATE POLICY "Trainers can view their clients' sets" ON public.workout_sets
  FOR SELECT USING (session_id IN (
    SELECT id FROM public.workout_sessions 
    WHERE trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
  ));

CREATE POLICY "Trainers can manage their clients' sets" ON public.workout_sets
  FOR ALL USING (session_id IN (
    SELECT id FROM public.workout_sessions 
    WHERE trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
  ));

-- Create RLS policies for personal_records
CREATE POLICY "Trainers can view their clients' PRs" ON public.personal_records
  FOR SELECT USING (client_id IN (
    SELECT id FROM public.clients 
    WHERE trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
  ));

CREATE POLICY "Trainers can manage their clients' PRs" ON public.personal_records
  FOR ALL USING (client_id IN (
    SELECT id FROM public.clients 
    WHERE trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid())
  ));

-- Create RLS policies for appointments
CREATE POLICY "Trainers can view their appointments" ON public.appointments
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can manage their appointments" ON public.appointments
  FOR ALL USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create RLS policies for trainer_integrations
CREATE POLICY "Trainers can view their integrations" ON public.trainer_integrations
  FOR SELECT USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can manage their integrations" ON public.trainer_integrations
  FOR ALL USING (trainer_id IN (SELECT id FROM public.trainers WHERE user_id = auth.uid()));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_trainer()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.trainers (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_trainer();

-- Insert default exercises from the existing data
INSERT INTO public.exercises (name, force_type, muscle_group, notes, is_public) VALUES
('Barbell Squat', 'Squat', 'Quads', 'Compound movement for leg strength', true),
('Deadlift', 'Pull', 'Hamstrings', 'Full body compound movement', true),
('Bench Press', 'Push', 'Chest', 'Upper body pressing movement', true),
('Pull-up', 'Pull', 'Back', 'Bodyweight back exercise', true),
('Overhead Press', 'Push', 'Shoulders', 'Vertical pressing movement', true),
('Barbell Row', 'Pull', 'Back', 'Horizontal pulling movement', true),
('Dumbbell Curl', 'Pull', 'Arms (Biceps)', 'Isolation exercise for biceps', true),
('Tricep Dip', 'Push', 'Arms (Triceps)', 'Bodyweight tricep exercise', true),
('Plank', 'Static', 'Core', 'Isometric core exercise', true),
('Lunges', 'Squat', 'Quads', 'Unilateral leg exercise', true);

-- Create indexes for better performance
CREATE INDEX idx_clients_trainer_id ON public.clients(trainer_id);
CREATE INDEX idx_workout_sessions_client_id ON public.workout_sessions(client_id);
CREATE INDEX idx_workout_sessions_trainer_id ON public.workout_sessions(trainer_id);
CREATE INDEX idx_workout_sets_session_id ON public.workout_sets(session_id);
CREATE INDEX idx_personal_records_client_id ON public.personal_records(client_id);
CREATE INDEX idx_appointments_trainer_id ON public.appointments(trainer_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
