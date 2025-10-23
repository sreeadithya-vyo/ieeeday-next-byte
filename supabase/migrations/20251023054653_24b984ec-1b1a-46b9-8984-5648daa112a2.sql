-- Add registration_amount column to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS registration_amount numeric DEFAULT 200;

-- Set registration_amount to 200 for all existing events
UPDATE public.events 
SET registration_amount = 200 
WHERE registration_amount IS NULL;