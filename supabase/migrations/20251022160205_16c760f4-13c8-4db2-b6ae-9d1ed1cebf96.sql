-- Add requested_role column to profiles table for role applications
ALTER TABLE public.profiles
ADD COLUMN requested_role text;

-- Add a comment explaining this is for role requests only
COMMENT ON COLUMN public.profiles.requested_role IS 'Role requested by user during signup - requires admin approval before actual role assignment';