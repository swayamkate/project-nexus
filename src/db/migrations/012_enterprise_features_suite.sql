-- Migration 012: Enterprise AI Workforce, Security Checks & Rozgar Melawa Engines
-- Nexus Platform (SSDM 2026 - Problem Statement 135)

BEGIN;

-- 1. Real Job Market Vacancies Aggregator (Feature 8)
CREATE TABLE IF NOT EXISTS public.job_market_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  trade_specialization text NOT NULL,
  company_name text NOT NULL,
  district text NOT NULL,
  state text DEFAULT 'Maharashtra',
  min_salary numeric NOT NULL,
  max_salary numeric NOT NULL,
  vacancies_count integer DEFAULT 1,
  requirements text[] DEFAULT '{}',
  source_portal text DEFAULT 'Maharashtra State Employment Exchange',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. State Rozgar Melawa Events & Job Fairs (Feature 61)
CREATE TABLE IF NOT EXISTS public.rozgar_melawas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_title text NOT NULL,
  district text NOT NULL,
  venue_address text NOT NULL,
  event_date date NOT NULL,
  start_time text DEFAULT '09:00 AM',
  end_time text DEFAULT '05:00 PM',
  participating_employers_count integer DEFAULT 10,
  target_trades text[] DEFAULT '{}',
  available_openings integer DEFAULT 100,
  registered_candidates_count integer DEFAULT 0,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- 3. Melawa Candidate Registrations & Verifiable QR Entry Passes (Features 22, 42)
CREATE TABLE IF NOT EXISTS public.melawa_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  melawa_id uuid REFERENCES public.rozgar_melawas(id) ON DELETE CASCADE,
  trainee_id uuid REFERENCES public.trainees(id) ON DELETE CASCADE,
  qr_pass_token text UNIQUE NOT NULL,
  registration_status text DEFAULT 'registered' CHECK (registration_status IN ('registered', 'attended', 'offered', 'rejected')),
  spot_interviews_count integer DEFAULT 0,
  check_in_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 4. Trainee Profile History & Granular Version Audit Trail (Feature 40)
CREATE TABLE IF NOT EXISTS public.trainee_profile_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id uuid REFERENCES public.trainees(id) ON DELETE CASCADE,
  changed_by text NOT NULL,
  field_name text NOT NULL,
  old_value text,
  new_value text,
  created_at timestamptz DEFAULT now()
);

-- 5. Automated Document Fraud & Tampering Scanner (Feature 38)
CREATE TABLE IF NOT EXISTS public.document_fraud_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id uuid REFERENCES public.verifications(id) ON DELETE CASCADE,
  trainee_id uuid REFERENCES public.trainees(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  tamper_score_pct numeric DEFAULT 0,
  anomaly_flags text[] DEFAULT '{}',
  verification_hash text NOT NULL,
  is_suspicious boolean DEFAULT false,
  scanned_at timestamptz DEFAULT now()
);

-- 6. 5-Year Automated Vocational Trade Demand Forecasting (Feature 10)
CREATE TABLE IF NOT EXISTS public.trade_demand_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_name text UNIQUE NOT NULL,
  sector text NOT NULL,
  current_demand_2026 integer NOT NULL,
  projected_demand_2030 integer NOT NULL,
  growth_rate_pct numeric NOT NULL,
  priority_level text NOT NULL CHECK (priority_level IN ('Critical', 'High', 'Steady')),
  drivers text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 7. Automated Curriculum Gap & Missing Industry Competencies Analyzer (Feature 3)
CREATE TABLE IF NOT EXISTS public.curriculum_gap_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_name text UNIQUE NOT NULL,
  current_nsqf_level integer NOT NULL,
  industry_missing_competencies text[] DEFAULT '{}',
  industry_demand_pct numeric NOT NULL,
  recommendations text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed Real Maharashtra Baseline Vacancies (Feature 8)
INSERT INTO public.job_market_vacancies (title, trade_specialization, company_name, district, min_salary, max_salary, vacancies_count, requirements, source_portal)
VALUES
  ('Junior Solar PV Plant Technician', 'Solar PV Installation & Grid Integration', 'Tata Power Renewable Microgrid', 'Pune', 22000, 28000, 45, ARRAY['Rooftop Solar PV Installation', 'Inverter Wiring', 'Net Metering Safety'], 'MIDC Bhosari Exchange'),
  ('CNC VMC Programmer & Operator', 'CNC Precision Machining & VMC Programming', 'Bharat Forge Ltd', 'Pune', 25000, 32000, 60, ARRAY['CNC Programming', 'VMC Tooling', 'Quality Metrology'], 'Chakan Automotive Belt'),
  ('EV Battery Pack Assembly Technician', 'EV Lithium-Ion Battery Diagnostics & Servicing', 'Mahindra Electric Mobility', 'Nashik', 24000, 30000, 35, ARRAY['Lithium-Ion Safety', 'Cell Balancing', 'BMS Wiring'], 'MIDC Ambad Hub'),
  ('Industrial Apparel Quality Inspector', 'Industrial Apparel Manufacturing & Quality Control', 'Raymond Apparel Ltd', 'Thane', 18000, 23000, 80, ARRAY['Industrial Sewing', 'Stitch Quality', 'Fabric Inspection'], 'Thane-Belapur Corridor'),
  ('Corporate Accounts Assistant (Tally Prime)', 'GST Digital Invoicing & Corporate Tally Prime', 'Kalyani Steels Financial Services', 'Aurangabad', 20000, 26000, 25, ARRAY['Tally Prime', 'GST E-Way Invoicing', 'TDS Reconciliation'], 'Waluj Industrial Area'),
  ('Automotive Electrical Diagnostics Specialist', 'Automotive Electrician & Sensor Diagnostics', 'Bajaj Auto Ltd', 'Aurangabad', 23000, 29000, 50, ARRAY['OBD-II Scanning', 'CAN-Bus Diagnostics', 'Starter Motor Repair'], 'Waluj Auto Hub'),
  ('Refrigeration & Industrial HVAC Technician', 'Commercial HVAC & Cold Chain Refrigeration', 'Voltas Industrial Solutions', 'Nagpur', 21000, 27000, 30, ARRAY['HVAC Brazing', 'Chiller Maintenance', 'Refrigerant Recovery'], 'MIHAN SEZ Logistics Hub')
ON CONFLICT DO NOTHING;

-- Seed Real Rozgar Melawas (Feature 61)
INSERT INTO public.rozgar_melawas (event_title, district, venue_address, event_date, start_time, end_time, participating_employers_count, target_trades, available_openings, registered_candidates_count, status)
VALUES
  ('Pune Mega Industrial Rozgar Melawa 2026', 'Pune', 'Government ITI Aundh Campus, Parihar Chowk, Pune', '2026-09-15', '09:00 AM', '05:00 PM', 42, ARRAY['CNC Machining', 'Solar PV Installation', 'EV Servicing', 'Tally Accounting'], 450, 380, 'scheduled'),
  ('Nagpur MIHAN SEZ Logistics & Technical Job Fair', 'Nagpur', 'Government Polytechnic Ground, Sadar, Nagpur', '2026-09-22', '09:30 AM', '04:30 PM', 28, ARRAY['HVAC Refrigeration', 'Heavy Electrical Wiring', 'Supply Chain Logistics'], 320, 240, 'scheduled'),
  ('Aurangabad Auto-Cluster Rozgar Melawa', 'Aurangabad', 'MSME Technology Centre Indo-German Tool Room, Chikalthana', '2026-10-05', '09:00 AM', '05:00 PM', 35, ARRAY['CNC Programming', 'Automotive Electrical', 'Robotics Welding'], 380, 190, 'scheduled')
ON CONFLICT DO NOTHING;

-- Seed 5-Year Trade Demand Projections (Feature 10)
INSERT INTO public.trade_demand_forecasts (trade_name, sector, current_demand_2026, projected_demand_2030, growth_rate_pct, priority_level, drivers)
VALUES
  ('EV Battery Pack Assembly & BMS Diagnostics', 'Automotive & EV', 14500, 48000, 231.0, 'Critical', 'National Electric Mobility Mission & EV 2W/3W manufacturing expansion in Maharashtra.'),
  ('Green Hydrogen Electrolyzer Maintenance', 'Clean Energy & Chemical', 2200, 12500, 468.2, 'Critical', 'State Green Hydrogen Policy and port-side ammonia production clusters in Konkan.'),
  ('Solar Rooftop & Grid Hybrid Installation', 'Renewable Energy', 28000, 65000, 132.1, 'High', 'PM Surya Ghar Muft Bijli Yojana & massive industrial rooftop solar adoption.'),
  ('Robotic Arc Welding & Cobot Programming', 'Industrial Manufacturing', 8500, 22000, 158.8, 'High', 'Automation upgrades across Pune and Aurangabad auto component supply chains.'),
  ('Precision CNC Machining with 5-Axis VMC', 'Heavy Engineering', 19000, 34000, 78.9, 'Steady', 'Defense industrial corridor and aerospace component manufacturing in Nagpur.'),
  ('Commercial Cold Chain & Refrigeration HVAC', 'Agro-Logistics & Retail', 11000, 24000, 118.2, 'High', 'Expansion of perishable agri-warehouses and pharmaceutical cold chains.')
ON CONFLICT (trade_name) DO UPDATE SET 
  current_demand_2026 = EXCLUDED.current_demand_2026,
  projected_demand_2030 = EXCLUDED.projected_demand_2030,
  growth_rate_pct = EXCLUDED.growth_rate_pct;

-- Seed Curriculum Gap Analyses (Feature 3)
INSERT INTO public.curriculum_gap_analyses (trade_name, current_nsqf_level, industry_missing_competencies, industry_demand_pct, recommendations)
VALUES
  ('Electrician (Vocational)', 4, ARRAY['Lithium-ion BMS Safety Protocols', 'Smart Grid Inverter Sync', 'Thermal Imaging for Switchgear'], 88.5, 'Incorporate 40 hours of practical EV charger and solar micro-inverter installation in Module 4.'),
  ('Machinist & CNC Operator', 5, ARRAY['5-Axis CAM Simulation Software', 'Surface Roughness Digital Metrology', 'Cobot Load/Unload Protocols'], 92.0, 'Upgrade ITI CNC simulator labs with Mastercam/Siemens NX digital twin training.'),
  ('Fitter (Mechanical)', 4, ARRAY['Pneumatic Sensor Calibration', 'Laser Alignment Systems', 'Preventive Maintenance Digital Logs'], 76.4, 'Integrate Industry 4.0 IoT vibration monitoring sensor modules into semester 3 curriculum.'),
  ('Computer Operator & Programming (COPA)', 4, ARRAY['GST E-Invoicing Reconciliation', 'Python for Data Scraping', 'Cloud Storage & Cyber Hygeine'], 84.0, 'Add real Tally Prime cloud e-invoicing and digital compliance project modules.')
ON CONFLICT (trade_name) DO UPDATE SET 
  industry_missing_competencies = EXCLUDED.industry_missing_competencies,
  industry_demand_pct = EXCLUDED.industry_demand_pct;

COMMIT;
