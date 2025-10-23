-- Fix infinite recursion in user_roles RLS policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can modify roles" ON user_roles;

-- Keep the simple policy that allows users to view their own roles
-- This policy already exists and works fine: "Users can view own roles"

-- Create a non-recursive policy for admins to view all roles
-- Using a security definer function to break the recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = is_admin.user_id
    AND role IN ('elite_master', 'super_admin')
  );
END;
$$;

-- Now create the admin policies using the function
CREATE POLICY "Admins can view all roles"
ON user_roles
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can modify roles"
ON user_roles
FOR ALL
USING (public.is_admin(auth.uid()));
