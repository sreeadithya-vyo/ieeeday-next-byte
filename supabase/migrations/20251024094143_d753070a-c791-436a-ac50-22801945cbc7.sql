-- Add DELETE policy for elite_master and super_admin on registrations table
CREATE POLICY "Elite masters and super admins can delete registrations"
ON public.registrations
FOR DELETE
USING (
  has_role(auth.uid(), 'elite_master'::text) OR 
  has_role(auth.uid(), 'super_admin'::text)
);