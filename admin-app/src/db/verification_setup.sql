-- 1. Update Trainee Employment table for Document Proofs
ALTER TABLE public.trainee_employment 
ADD COLUMN IF NOT EXISTS proof_file_url TEXT,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending';

-- 2. Create the Storage Bucket for Verifications
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS Policies
-- Allow Trainees to upload their own documents (we'll just use permissive for prototype)
DROP POLICY IF EXISTS "Public Verification Uploads" ON storage.objects;
CREATE POLICY "Public Verification Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'verifications');

DROP POLICY IF EXISTS "Public Verification Reads" ON storage.objects;
CREATE POLICY "Public Verification Reads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'verifications');
