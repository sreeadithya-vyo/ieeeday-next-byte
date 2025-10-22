-- Create user_roles table to match the application code expectations
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  chapter text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role, chapter)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('elite_master', 'super_admin')
  )
);

-- Policy: Only elite_master and super_admin can modify roles
CREATE POLICY "Only admins can modify roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('elite_master', 'super_admin')
  )
);

-- Insert the requested role assignments
INSERT INTO public.user_roles (user_id, role, chapter)
VALUES 
  ('77613b22-1bc1-40c1-8dc7-943421836e89', 'elite_master', NULL),
  ('c500239e-66d6-43cb-8546-69489f9a2adb', 'event_admin', 'APS'),
  ('d8d10443-649f-43b6-b213-1b4045102e4c', 'event_admin', 'CS'),
  ('1acb4f06-3374-4fec-ad55-cb67aa1e7053', 'event_admin', 'SPS'),
  ('edee477b-943b-408c-bb5d-5f3d520fd202', 'event_admin', 'PROCOM')
ON CONFLICT (user_id, role, chapter) DO UPDATE
SET role = EXCLUDED.role, chapter = EXCLUDED.chapter;