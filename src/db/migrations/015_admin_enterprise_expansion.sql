-- Migration 015: Admin Enterprise Expansion (Broadcast Hub, ITI Infrastructure Auditor, DBT Stipend Ledger)

BEGIN;

-- 1. Create Broadcasts & Communication Logs Table
CREATE TABLE IF NOT EXISTS public.communication_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel VARCHAR(50) NOT NULL, -- 'whatsapp', 'sms', 'email'
  template_name VARCHAR(100) NOT NULL,
  recipient_count INT NOT NULL DEFAULT 0,
  target_district VARCHAR(100) DEFAULT 'All Maharashtra',
  target_milestone VARCHAR(50) DEFAULT 'All Milestones',
  message_preview TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Delivered', -- 'Delivered', 'Sent', 'Failed', 'Scheduled'
  gateway_used VARCHAR(100) DEFAULT 'CDAC Mobile Seva / NIC SMS Gateway',
  dispatched_by VARCHAR(255) DEFAULT 'State SuperAdmin (admin@avishkark.in)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed communication broadcasts
INSERT INTO public.communication_broadcasts (
  channel, template_name, recipient_count, target_district, target_milestone, message_preview, status, gateway_used
) VALUES 
('whatsapp', '3M_MILESTONE_SURVEY', 1420, 'Pune', '3M', 'नमस्ते Avishkar, महाराष्ट्र राज्य कौशल्य विकास मिशन (MSSDS). तुमचे 3 महिन्यांचे कौशल्य परिणाम सर्वेक्षण पूर्ण करा: https://sih2026.avishkark.in/dashboard', 'Delivered', 'Meta WhatsApp Business Cloud API'),
('sms', 'ROZGAR_MELAWA_INVITE', 3850, 'Nashik', 'Unemployed Queue', 'Govt of Maharashtra: Rozgar Melawa Job Fair at ITI Nashik on 15th Sep. Download your QR Pass at https://sih2026.avishkark.in', 'Delivered', 'CDAC Mobile Seva (NIC Govt Gateway)'),
('whatsapp', '6M_WAGE_LIFT_AUDIT', 980, 'Chhatrapati Sambhajinagar', '6M', 'Update your current monthly wage & MSME Udyam status to claim your verified skill credential badge.', 'Delivered', 'Meta WhatsApp Business Cloud API'),
('sms', 'DBT_STIPEND_DISBURSED', 2140, 'Nagpur', 'All Milestones', 'Your monthly vocational skill stipend of Rs. 3,500 has been credited via APBS/PFMS directly to your bank account.', 'Delivered', 'NIC SMS Gateway (MeitY)');

-- 2. Create Training Centers & ITI Infrastructure Table
CREATE TABLE IF NOT EXISTS public.training_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_code VARCHAR(100) UNIQUE NOT NULL,
  center_name VARCHAR(255) NOT NULL,
  center_type VARCHAR(100) NOT NULL, -- 'Government ITI', 'MSSDS Accredited Center', 'Corporate Industry Center'
  district VARCHAR(100) NOT NULL,
  taluka VARCHAR(100) NOT NULL,
  principal_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  nsqf_lab_rating INT NOT NULL DEFAULT 5, -- 1 to 5
  biometric_compliance_pct INT NOT NULL DEFAULT 95,
  equipment_readiness_pct INT NOT NULL DEFAULT 92,
  active_batches INT NOT NULL DEFAULT 6,
  total_capacity INT NOT NULL DEFAULT 240,
  accreditation_status VARCHAR(50) NOT NULL DEFAULT 'Valid', -- 'Valid', 'Under Audit', 'Expiring'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed ITI & Center Directory
INSERT INTO public.training_centers (
  center_code, center_name, center_type, district, taluka, principal_name, contact_phone, contact_email, nsqf_lab_rating, biometric_compliance_pct, equipment_readiness_pct, active_batches, total_capacity, accreditation_status
) VALUES 
('ITI-PUN-001', 'Government Industrial Training Institute (Aundh)', 'Government ITI', 'Pune', 'Haveli', 'Dr. S. K. Mahajan', '+91 20 25881234', 'iti.aundh@mahaskill.gov.in', 5, 98, 96, 14, 480, 'Valid'),
('ITI-NSK-002', 'Government ITI & Mechatronics Center (Satpur MIDC)', 'Government ITI', 'Nashik', 'Nashik', 'Prof. V. R. Kulkarni', '+91 253 2351234', 'iti.satpur@mahaskill.gov.in', 5, 95, 91, 10, 350, 'Valid'),
('ITI-CSN-003', 'Chhatrapati Sambhajinagar EV Diagnostic Hub (Waluj)', 'MSSDS Accredited Center', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Gangapur', 'Er. Rajesh Deshmukh', '+91 240 2554321', 'waluj.ev@mahaskill.gov.in', 4, 92, 88, 8, 280, 'Valid'),
('ITI-NGP-004', 'Government ITI & Solar Technology Center', 'Government ITI', 'Nagpur', 'Nagpur Urban', 'Smt. Anjali Bapat', '+91 712 2567890', 'iti.nagpur@mahaskill.gov.in', 5, 97, 94, 12, 420, 'Valid'),
('ITI-THN-005', 'Thane Industrial Automation & Robotics Center', 'Corporate Industry Center', 'Thane', 'Thane', 'Mr. Amitav Roy', '+91 22 25809876', 'thane.robotics@mahaskill.gov.in', 5, 99, 98, 9, 300, 'Valid'),
('ITI-KOL-006', 'Kolhapur Foundry & Precision CNC Institute (Shiroli)', 'Government ITI', 'Kolhapur', 'Hatkanangle', 'Er. D. B. Patil', '+91 231 2605432', 'iti.shiroli@mahaskill.gov.in', 4, 94, 89, 7, 250, 'Valid')
ON CONFLICT (center_code) DO NOTHING;

-- 3. Create Direct Benefit Transfer (DBT) & Stipend Disbursement Table
CREATE TABLE IF NOT EXISTS public.dbt_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id VARCHAR(100) UNIQUE NOT NULL, -- PFMS / NPCI transaction reference
  trainee_name VARCHAR(255) NOT NULL,
  trainee_email VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  scheme_name VARCHAR(150) NOT NULL, -- 'NAPS Monthly Stipend', 'PMEGP Tool-Kit Grant', 'MSSDS Post-Placement Allowance'
  disbursed_amount NUMERIC(12, 2) NOT NULL,
  bank_name VARCHAR(150) NOT NULL,
  masked_account_number VARCHAR(50) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Success', -- 'Success', 'Processing', 'Bank Rejected', 'Re-Initiated'
  payment_mode VARCHAR(50) NOT NULL DEFAULT 'APBS / PFMS',
  disbursed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed DBT records
INSERT INTO public.dbt_disbursements (
  transaction_id, trainee_name, trainee_email, district, scheme_name, disbursed_amount, bank_name, masked_account_number, ifsc_code, payment_status, payment_mode
) VALUES 
('PFMS-2026-MAHA-948201', 'Avishkar Kedar', 'avishkar.kedar@mahaskill.in', 'Pune', 'PMEGP Micro-Enterprise Tool-Kit Grant', 25000.00, 'State Bank of India (Bhosari)', 'XXXX-XXXX-4821', 'SBIN0001234', 'Success', 'APBS / Direct Treasury'),
('PFMS-2026-MAHA-948202', 'Rahul Deshmukh', 'rahul.deshmukh@mahaskill.in', 'Nagpur', 'NAPS Monthly Apprentice Allowance', 3500.00, 'Bank of Maharashtra', 'XXXX-XXXX-9102', 'MAHB0000456', 'Success', 'APBS / PFMS'),
('PFMS-2026-MAHA-948203', 'Snehal Patil', 'snehal.patil@mahaskill.in', 'Nashik', 'MSSDS Post-Placement Retention Allowance', 4000.00, 'HDFC Bank (Satpur)', 'XXXX-XXXX-3341', 'HDFC0000240', 'Success', 'APBS / PFMS'),
('PFMS-2026-MAHA-948204', 'Amit Gaikwad', 'amit.gaikwad@mahaskill.in', 'Aurangabad (Chhatrapati Sambhajinagar)', 'PMEGP Micro-Enterprise Tool-Kit Grant', 20000.00, 'Union Bank of India', 'XXXX-XXXX-7729', 'UBIN0530018', 'Success', 'APBS / Direct Treasury'),
('PFMS-2026-MAHA-948205', 'Kavita Jadhav', 'kavita.jadhav@mahaskill.in', 'Thane', 'NAPS Monthly Apprentice Allowance', 3500.00, 'Canara Bank (Thane West)', 'XXXX-XXXX-6150', 'CNRB0001122', 'Success', 'APBS / PFMS')
ON CONFLICT (transaction_id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.communication_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dbt_disbursements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins manage communication broadcasts" ON public.communication_broadcasts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins manage training centers" ON public.training_centers FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Read training centers" ON public.training_centers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage dbt disbursements" ON public.dbt_disbursements FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

COMMIT;
