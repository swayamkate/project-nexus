-- Migration 016: Complete RLS & Melawa Registrations Access Fix

BEGIN;

-- 1. Melawa Registrations Policies
ALTER TABLE public.melawa_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trainees read own melawa registrations" ON public.melawa_registrations;
DROP POLICY IF EXISTS "Trainees register for melawas" ON public.melawa_registrations;
DROP POLICY IF EXISTS "Admins manage all melawa registrations" ON public.melawa_registrations;
DROP POLICY IF EXISTS "Public read melawa registrations" ON public.melawa_registrations;

CREATE POLICY "Trainees read own melawa registrations" ON public.melawa_registrations 
  FOR SELECT TO anon, authenticated 
  USING (true);

CREATE POLICY "Trainees register for melawas" ON public.melawa_registrations 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admins manage all melawa registrations" ON public.melawa_registrations 
  FOR ALL TO authenticated 
  USING (is_admin()) 
  WITH CHECK (is_admin());

-- 2. Communication Broadcasts Policies
ALTER TABLE public.communication_broadcasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage communication broadcasts" ON public.communication_broadcasts;
DROP POLICY IF EXISTS "Public read broadcasts" ON public.communication_broadcasts;

CREATE POLICY "Public read broadcasts" ON public.communication_broadcasts 
  FOR SELECT TO anon, authenticated 
  USING (true);

CREATE POLICY "Admins manage communication broadcasts" ON public.communication_broadcasts 
  FOR ALL TO authenticated 
  USING (is_admin()) 
  WITH CHECK (is_admin());

-- 3. DBT Disbursements Policies
ALTER TABLE public.dbt_disbursements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read dbt disbursements" ON public.dbt_disbursements;
DROP POLICY IF EXISTS "Admins manage dbt disbursements" ON public.dbt_disbursements;
DROP POLICY IF EXISTS "Trainees view own dbt" ON public.dbt_disbursements;

CREATE POLICY "Public read dbt disbursements" ON public.dbt_disbursements 
  FOR SELECT TO anon, authenticated 
  USING (true);

CREATE POLICY "Admins manage dbt disbursements" ON public.dbt_disbursements 
  FOR ALL TO authenticated 
  USING (is_admin()) 
  WITH CHECK (is_admin());

-- 4. Enable RLS and public read on Analytics and Fraud Audit Tables
ALTER TABLE public.curriculum_gap_analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read curriculum gaps" ON public.curriculum_gap_analyses;
CREATE POLICY "Public read curriculum gaps" ON public.curriculum_gap_analyses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write curriculum gaps" ON public.curriculum_gap_analyses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.trade_demand_forecasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read trade forecasts" ON public.trade_demand_forecasts;
CREATE POLICY "Public read trade forecasts" ON public.trade_demand_forecasts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write trade forecasts" ON public.trade_demand_forecasts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.document_fraud_checks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read fraud checks" ON public.document_fraud_checks;
CREATE POLICY "Admins read fraud checks" ON public.document_fraud_checks FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE public.trainee_profile_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read profile audit logs" ON public.trainee_profile_audit_logs;
CREATE POLICY "Admins read profile audit logs" ON public.trainee_profile_audit_logs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

COMMIT;
