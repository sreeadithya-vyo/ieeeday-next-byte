-- Make user_id nullable in registrations table to allow non-authenticated registrations
ALTER TABLE public.registrations 
ALTER COLUMN user_id DROP NOT NULL;

-- Add transaction_id field to registrations table
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS transaction_id text;

-- Update RLS policies to allow unauthenticated users to create registrations
DROP POLICY IF EXISTS "Users can create registrations" ON public.registrations;

CREATE POLICY "Anyone can create registrations"
ON public.registrations
FOR INSERT
TO public
WITH CHECK (true);

-- Update RLS policy to allow viewing own registrations by email
DROP POLICY IF EXISTS "Users can view own registrations" ON public.registrations;

CREATE POLICY "Users can view own registrations by email or user_id"
ON public.registrations
FOR SELECT
TO public
USING (
  auth.uid() = user_id 
  OR participant_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Delete existing role for this user if any, then insert new one
DELETE FROM public.user_roles WHERE user_id = 'e7e0f3ce-1cbf-46cc-8e9e-68c2c8607faa';

-- Assign user as PROCOM chapter admin
INSERT INTO public.user_roles (user_id, role, chapter)
VALUES ('e7e0f3ce-1cbf-46cc-8e9e-68c2c8607faa', 'event_admin', 'PROCOM');