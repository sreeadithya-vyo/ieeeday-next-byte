-- Create profiles table (referenced by existing handle_new_user trigger)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Add trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add payment_status column to registrations for easier querying
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- Add payment_proof_url column to registrations
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS payment_proof_url text;

-- Update existing registrations payment status based on payments table
UPDATE public.registrations r
SET payment_status = COALESCE(
  (SELECT p.status FROM public.payments p WHERE p.registration_id = r.id ORDER BY p.created_at DESC LIMIT 1),
  'pending'
);