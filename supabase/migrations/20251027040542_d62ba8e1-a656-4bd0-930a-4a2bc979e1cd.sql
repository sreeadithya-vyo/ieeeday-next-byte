-- Make payment-proofs bucket public so images can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-proofs';

-- Ensure proper RLS policies for viewing payment proofs
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own payment proofs" ON storage.objects;

-- Allow authenticated users to view all payment proofs in this bucket
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to upload to payment-proofs bucket
CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.role() = 'authenticated'
);