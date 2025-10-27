-- Fix the payments RLS policy to use auth.uid() instead of current_setting
DROP POLICY IF EXISTS "Users can view own payments" ON payments;

CREATE POLICY "Users can view own payments"
ON payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM registrations r
    WHERE r.id = payments.registration_id
    AND r.user_id = auth.uid()
  )
);