-- Migration 013: Complete SIH Problem Statement PS-135 Alignment
-- Longitudinal Tracking, Multi-Identifier Resolver, Consent Ledger, and Provider Accountability

BEGIN;

-- 1. Extend public.trainees with Multi-Identifier Enclave & Consent Ledger
ALTER TABLE public.trainees
  ADD COLUMN IF NOT EXISTS alt_phone text,
  ADD COLUMN IF NOT EXISTS guardian_phone text,
  ADD COLUMN IF NOT EXISTS apaar_id text,
  ADD COLUMN IF NOT EXISTS digilocker_id text,
  ADD COLUMN IF NOT EXISTS naps_apprentice_id text,
  ADD COLUMN IF NOT EXISTS consent_data_sharing boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS consent_longitudinal_tracking boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS consent_epfo_verification boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS migration_status text DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS current_residence_district text;

-- 2. Extend public.trainee_employment with Training Relevance & Contract Stability
ALTER TABLE public.trainee_employment
  ADD COLUMN IF NOT EXISTS training_relevance text DEFAULT 'direct_match',
  ADD COLUMN IF NOT EXISTS contract_type text DEFAULT 'permanent',
  ADD COLUMN IF NOT EXISTS employer_gstin text,
  ADD COLUMN IF NOT EXISTS is_employer_verified boolean DEFAULT true;

-- 3. Extend public.training_programs with Accountability & Performance Ratings
ALTER TABLE public.training_programs
  ADD COLUMN IF NOT EXISTS accountability_rating numeric DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS retention_rate_6m_pct numeric DEFAULT 85.0,
  ADD COLUMN IF NOT EXISTS avg_wage_lift_inr numeric DEFAULT 12000,
  ADD COLUMN IF NOT EXISTS remedial_status text DEFAULT 'good_standing';

-- Update Baseline Training Programs with realistic SIH accountability metrics
UPDATE public.training_programs
SET 
  accountability_rating = 4.8,
  retention_rate_6m_pct = 91.5,
  avg_wage_lift_inr = 14500,
  remedial_status = 'good_standing'
WHERE sector ILIKE '%Automotive%' OR sector ILIKE '%Renewable%' OR title ILIKE '%Solar%';

UPDATE public.training_programs
SET 
  accountability_rating = 4.6,
  retention_rate_6m_pct = 88.0,
  avg_wage_lift_inr = 13200,
  remedial_status = 'good_standing'
WHERE sector ILIKE '%Manufacturing%' OR title ILIKE '%CNC%';

UPDATE public.training_programs
SET 
  accountability_rating = 4.3,
  retention_rate_6m_pct = 81.0,
  avg_wage_lift_inr = 9500,
  remedial_status = 'good_standing'
WHERE sector ILIKE '%Apparel%' OR sector ILIKE '%Garment%';

-- Seed Multi-Identifier & Consent Data for existing trainees
UPDATE public.trainees
SET
  alt_phone = COALESCE(alt_phone, '+91 9820011223'),
  guardian_phone = COALESCE(guardian_phone, '+91 9422033445'),
  apaar_id = COALESCE(apaar_id, 'APAAR-2026-9842-1049'),
  digilocker_id = COALESCE(digilocker_id, 'DL-MAHA-SKILL-849201'),
  naps_apprentice_id = COALESCE(naps_apprentice_id, 'NAPS-MAHA-2026-00482'),
  consent_data_sharing = true,
  consent_longitudinal_tracking = true,
  consent_epfo_verification = true,
  migration_status = 'local',
  current_residence_district = COALESCE(district, 'Pune');

COMMIT;
