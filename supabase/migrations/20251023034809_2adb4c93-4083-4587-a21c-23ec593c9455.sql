-- Phase 1: Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_any_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('elite_master', 'super_admin', 'event_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_chapter(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT chapter
  FROM public.user_roles
  WHERE user_id = _user_id AND role = 'event_admin'
  LIMIT 1
$$;

-- Phase 2: Drop problematic recursive policies
DROP POLICY IF EXISTS "Only admins can modify roles" ON public.roles;
DROP POLICY IF EXISTS "Only admins can modify users" ON public.users;
DROP POLICY IF EXISTS "Only admins can modify chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.registrations;

-- Phase 3: Create new safe policies using security definer functions
CREATE POLICY "Only admins can modify roles" ON public.roles
FOR ALL
USING (public.has_role(auth.uid(), 'elite_master') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only admins can modify users" ON public.users
FOR ALL
USING (public.has_role(auth.uid(), 'elite_master') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only admins can modify chapters" ON public.chapters
FOR ALL
USING (public.has_role(auth.uid(), 'elite_master') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage events" ON public.events
FOR ALL
USING (
  public.has_role(auth.uid(), 'elite_master') 
  OR public.has_role(auth.uid(), 'super_admin')
  OR (
    public.has_role(auth.uid(), 'event_admin')
    AND chapter_id IN (
      SELECT id FROM chapters WHERE code = public.get_user_chapter(auth.uid())
    )
  )
);

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT
USING (
  public.has_role(auth.uid(), 'elite_master')
  OR public.has_role(auth.uid(), 'super_admin')
  OR (
    public.has_role(auth.uid(), 'event_admin')
    AND resource_type = 'event'
    AND resource_id IN (
      SELECT id::text FROM events 
      WHERE chapter_id IN (
        SELECT id FROM chapters WHERE code = public.get_user_chapter(auth.uid())
      )
    )
  )
);

CREATE POLICY "Admins can view all registrations" ON public.registrations
FOR SELECT
USING (public.is_any_admin(auth.uid()));

-- Phase 4: Add missing RLS policies for user operations
CREATE POLICY "Users can create registrations" ON public.registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending registrations" ON public.registrations
FOR UPDATE
USING (auth.uid() = user_id AND status = 'submitted');

CREATE POLICY "Admins can update registrations" ON public.registrations
FOR UPDATE
USING (public.is_any_admin(auth.uid()));

CREATE POLICY "Users can create payments" ON public.payments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM registrations 
    WHERE id = registration_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update payments" ON public.payments
FOR UPDATE
USING (public.is_any_admin(auth.uid()));

-- Phase 5: Clean up duplicate events (keeping most recent for each title+chapter)
DELETE FROM events
WHERE id IN (
  SELECT id FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY title, chapter_id ORDER BY created_at DESC) as rn
    FROM events
  ) t
  WHERE rn > 1
);