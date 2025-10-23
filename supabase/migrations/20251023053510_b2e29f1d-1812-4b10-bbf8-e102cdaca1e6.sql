-- Storage policies to allow anonymous uploads to the 'payment-proofs' bucket and allow viewing for verification
-- Idempotent creation using DO blocks

-- Allow INSERT (upload) by anon and authenticated users to 'payment-proofs' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Allow upload to payment-proofs (anon & auth)'
  ) THEN
    CREATE POLICY "Allow upload to payment-proofs (anon & auth)"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'payment-proofs');
  END IF;
END $$;

-- Allow SELECT (read) by anon and authenticated users for 'payment-proofs' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Allow read payment-proofs (anon & auth)'
  ) THEN
    CREATE POLICY "Allow read payment-proofs (anon & auth)"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'payment-proofs');
  END IF;
END $$;
