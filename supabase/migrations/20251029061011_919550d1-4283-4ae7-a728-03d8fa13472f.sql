-- Add team member support to registrations table
ALTER TABLE public.registrations
ADD COLUMN team_size integer,
ADD COLUMN team_members jsonb DEFAULT '[]'::jsonb,
ADD COLUMN team_leader_name text;

-- Add comment for documentation
COMMENT ON COLUMN public.registrations.team_members IS 'Array of team member objects with name, email, phone fields';
COMMENT ON COLUMN public.registrations.team_size IS 'Maximum allowed team size for the event (1-4)';
COMMENT ON COLUMN public.registrations.team_leader_name IS 'Name of the team leader';