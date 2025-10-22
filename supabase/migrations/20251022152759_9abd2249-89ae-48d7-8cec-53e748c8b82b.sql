-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('elite_master', 'super_admin', 'event_admin', 'viewer', 'user');

-- Create enum for registration status
CREATE TYPE public.registration_status AS ENUM ('submitted', 'confirmed', 'rejected');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'verified', 'rejected');

-- Create enum for chapters
CREATE TYPE public.chapter_type AS ENUM ('APS', 'SPS', 'PROCOM', 'CS', 'PES');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  branch TEXT,
  year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  chapter chapter_type,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create events table (update existing structure)
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organizer TEXT,
  chapter chapter_type NOT NULL,
  date TEXT NOT NULL,
  day INTEGER NOT NULL CHECK (day IN (1, 2)),
  venue TEXT,
  short_desc TEXT,
  long_desc TEXT,
  image TEXT,
  guest TEXT,
  schedule JSONB,
  program_outcomes TEXT[],
  topics TEXT[],
  rules TEXT[],
  criteria TEXT[],
  assigned_admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT NOT NULL,
  participant_branch TEXT NOT NULL,
  participant_year TEXT NOT NULL,
  status registration_status DEFAULT 'submitted' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  transaction_id TEXT,
  payment_proof_url TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user chapter
CREATE OR REPLACE FUNCTION public.get_user_chapter(_user_id UUID)
RETURNS chapter_type
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT chapter
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role = 'event_admin'
  LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'elite_master') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'event_admin')
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Elite master can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'elite_master'));

CREATE POLICY "Super admin can create event admins"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin') AND
    role = 'event_admin'
  );

CREATE POLICY "Super admin can view all roles"
  ON public.user_roles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'event_admin')
  );

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Elite master can manage all events"
  ON public.events FOR ALL
  USING (public.has_role(auth.uid(), 'elite_master'));

CREATE POLICY "Super admin can manage all events"
  ON public.events FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Event admin can view their chapter events"
  ON public.events FOR SELECT
  USING (
    public.has_role(auth.uid(), 'event_admin') AND
    chapter = public.get_user_chapter(auth.uid())
  );

CREATE POLICY "Event admin can update their chapter events"
  ON public.events FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'event_admin') AND
    chapter = public.get_user_chapter(auth.uid())
  );

-- RLS Policies for registrations
CREATE POLICY "Users can view their own registrations"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Elite master can view all registrations"
  ON public.registrations FOR SELECT
  USING (public.has_role(auth.uid(), 'elite_master'));

CREATE POLICY "Super admin can view all registrations"
  ON public.registrations FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Event admin can view their chapter registrations"
  ON public.registrations FOR SELECT
  USING (
    public.has_role(auth.uid(), 'event_admin') AND
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = registrations.event_id
        AND events.chapter = public.get_user_chapter(auth.uid())
    )
  );

CREATE POLICY "Admins can update registrations"
  ON public.registrations FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'elite_master') OR
    public.has_role(auth.uid(), 'super_admin') OR
    (
      public.has_role(auth.uid(), 'event_admin') AND
      EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = registrations.event_id
          AND events.chapter = public.get_user_chapter(auth.uid())
      )
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    public.has_role(auth.uid(), 'elite_master') OR
    public.has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "Anyone can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs
CREATE POLICY "Users can upload their payment proofs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own payment proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all payment proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-proofs' AND (
      public.has_role(auth.uid(), 'elite_master') OR
      public.has_role(auth.uid(), 'super_admin') OR
      public.has_role(auth.uid(), 'event_admin')
    )
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();