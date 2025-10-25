-- Add IEEE membership fields to registrations table
ALTER TABLE public.registrations 
ADD COLUMN is_ieee_member boolean DEFAULT false,
ADD COLUMN ieee_member_id text;