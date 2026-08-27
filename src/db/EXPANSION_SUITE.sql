-- ============================================================================
-- NEXUS PLATFORM EXPANSION SUITE: GOALS, ROADMAPS, COURSES, ASSESSMENTS & INTERVIEWS
-- ============================================================================

BEGIN;

-- 1. Trainee Career Goals & Skill Gap Analysis
CREATE TABLE IF NOT EXISTS public.trainee_career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  target_role VARCHAR(150) NOT NULL,
  target_days INTEGER NOT NULL DEFAULT 90,
  target_salary INTEGER NOT NULL DEFAULT 30000,
  current_level VARCHAR(50) NOT NULL DEFAULT 'Beginner',
  weekly_hours INTEGER NOT NULL DEFAULT 10,
  skills_acquired JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills_gap JSONB NOT NULL DEFAULT '[]'::jsonb,
  readiness_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  wage_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.00,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_trainee_goal UNIQUE(trainee_id)
);

-- 2. External Courses Catalog (NPTEL, Coursera, Swayam, Skill India Digital, MSSDS)
CREATE TABLE IF NOT EXISTS public.external_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'NPTEL', 'Coursera', 'Swayam', 'Skill India', 'MSSDS', 'edX'
  provider VARCHAR(150) NOT NULL, -- 'IIT Bombay', 'DeepLearning.AI', 'NSDC', 'Google', 'IBM'
  sector VARCHAR(100) NOT NULL,
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  estimated_hours INTEGER NOT NULL DEFAULT 20,
  nsqf_level INTEGER DEFAULT 4,
  skill_tags TEXT[] NOT NULL DEFAULT '{}',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT true,
  has_certificate BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Trainee Course Enrollments & Progress Tracking
CREATE TABLE IF NOT EXISTS public.trainee_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.external_courses(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed'
  progress_pct INTEGER NOT NULL DEFAULT 0,
  target_completion_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_trainee_course UNIQUE(trainee_id, course_id)
);

-- 4. Interactive Skill Assessments & Question Banks
CREATE TABLE IF NOT EXISTS public.skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  trade_sector VARCHAR(100) NOT NULL,
  skill_level VARCHAR(50) NOT NULL DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  total_questions INTEGER NOT NULL DEFAULT 10,
  passing_score_pct INTEGER NOT NULL DEFAULT 70,
  badge_name VARCHAR(100) NOT NULL DEFAULT 'Certified Skill Specialist',
  questions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Assessment Submissions & Badges Earned
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.skill_assessments(id) ON DELETE CASCADE,
  score_pct NUMERIC(5,2) NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  badge_earned VARCHAR(100),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Interview Preparation & Community-Submitted Questions
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_sector VARCHAR(100) NOT NULL,
  target_role VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) NOT NULL DEFAULT 'Industry General',
  question_text TEXT NOT NULL,
  sample_answer TEXT NOT NULL,
  key_points TEXT[] NOT NULL DEFAULT '{}',
  difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
  category VARCHAR(50) NOT NULL DEFAULT 'Technical', -- 'Technical', 'Behavioral', 'Practical / Workshop', 'HR'
  submitted_by_trainee_id UUID REFERENCES public.trainees(id) ON DELETE SET NULL,
  submitted_by_name VARCHAR(100) NOT NULL DEFAULT 'Industry Verified Expert',
  is_approved BOOLEAN NOT NULL DEFAULT true,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. N-Day Step-by-Step Action Roadmaps
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  target_role VARCHAR(150) NOT NULL,
  target_days INTEGER NOT NULL DEFAULT 90,
  phases_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  overall_progress_pct INTEGER NOT NULL DEFAULT 0,
  is_ai_generated BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_trainee_roadmap UNIQUE(trainee_id)
);

-- ============================================================================
-- ZERO-TRUST RLS POLICIES FOR EXPANSION TABLES
-- ============================================================================

ALTER TABLE public.trainee_career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;

-- Drop old policies if existing
DROP POLICY IF EXISTS "Trainees read own career goal" ON public.trainee_career_goals;
DROP POLICY IF EXISTS "Trainees write own career goal" ON public.trainee_career_goals;
DROP POLICY IF EXISTS "Admins manage all career goals" ON public.trainee_career_goals;

DROP POLICY IF EXISTS "Public read external courses" ON public.external_courses;
DROP POLICY IF EXISTS "Admins manage external courses" ON public.external_courses;

DROP POLICY IF EXISTS "Trainees read own course enrollments" ON public.trainee_course_enrollments;
DROP POLICY IF EXISTS "Trainees write own course enrollments" ON public.trainee_course_enrollments;
DROP POLICY IF EXISTS "Admins manage all course enrollments" ON public.trainee_course_enrollments;

DROP POLICY IF EXISTS "Public read active skill assessments" ON public.skill_assessments;
DROP POLICY IF EXISTS "Admins manage skill assessments" ON public.skill_assessments;

DROP POLICY IF EXISTS "Trainees read own assessment submissions" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Trainees create assessment submissions" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Admins read all assessment submissions" ON public.assessment_submissions;

DROP POLICY IF EXISTS "Public read approved interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Authenticated trainees submit interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Admins manage interview questions" ON public.interview_questions;

DROP POLICY IF EXISTS "Trainees read own roadmap" ON public.career_roadmaps;
DROP POLICY IF EXISTS "Trainees write own roadmap" ON public.career_roadmaps;
DROP POLICY IF EXISTS "Admins manage all roadmaps" ON public.career_roadmaps;

-- RLS: trainee_career_goals
CREATE POLICY "Trainees read own career goal" ON public.trainee_career_goals
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees write own career goal" ON public.trainee_career_goals
  FOR ALL TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin())
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

-- RLS: external_courses
CREATE POLICY "Public read external courses" ON public.external_courses
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage external courses" ON public.external_courses
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS: trainee_course_enrollments
CREATE POLICY "Trainees read own course enrollments" ON public.trainee_course_enrollments
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees write own course enrollments" ON public.trainee_course_enrollments
  FOR ALL TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin())
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

-- RLS: skill_assessments
CREATE POLICY "Public read active skill assessments" ON public.skill_assessments
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage skill assessments" ON public.skill_assessments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS: assessment_submissions
CREATE POLICY "Trainees read own assessment submissions" ON public.assessment_submissions
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees create assessment submissions" ON public.assessment_submissions
  FOR INSERT TO authenticated
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins read all assessment submissions" ON public.assessment_submissions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS: interview_questions
CREATE POLICY "Public read approved interview questions" ON public.interview_questions
  FOR SELECT TO anon, authenticated
  USING (is_approved = true OR public.is_admin());

CREATE POLICY "Authenticated trainees submit interview questions" ON public.interview_questions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage interview questions" ON public.interview_questions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS: career_roadmaps
CREATE POLICY "Trainees read own roadmap" ON public.career_roadmaps
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees write own roadmap" ON public.career_roadmaps
  FOR ALL TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin())
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

-- Ensure user_roles has Avishkar0 as superadmin
INSERT INTO public.user_roles (user_id, email, username, role)
SELECT id, email, 'Avishkar0', 'superadmin'::public.user_role
FROM auth.users
WHERE email = 'avishkarkedar@gmail.com'
ON CONFLICT (email) DO UPDATE SET role = 'superadmin'::public.user_role, username = 'Avishkar0', user_id = EXCLUDED.user_id;

-- ============================================================================
-- SEED INITIAL AUTHENTIC COURSES, ASSESSMENTS, QUESTIONS & GOALS
-- ============================================================================

-- 1. Seed External Courses (NPTEL, Coursera, Swayam, Skill India)
INSERT INTO public.external_courses (title, platform, provider, sector, duration_weeks, estimated_hours, nsqf_level, skill_tags, url, rating, enrolled_count) VALUES
('Apparel Manufacturing & Garment Technology', 'NPTEL', 'IIT Delhi', 'Apparel & Fashion', 12, 36, 5, ARRAY['Pattern Making', 'Industrial Stitching', 'Garment Grading', 'Quality Control'], 'https://onlinecourses.nptel.ac.in/noc24_te01/preview', 4.8, 1420),
('Solar Photovoltaic Energy Systems: Design & Installation', 'Swayam', 'IIT Roorkee', 'Renewable Energy', 8, 24, 4, ARRAY['Solar PV Installation', 'Inverter Wiring', 'Grid Integration', 'Safety Protocols'], 'https://swayam.gov.in/explorer?category=Engineering_Solar', 4.9, 2850),
('Electric Vehicle Power Electronics & Battery Management', 'NPTEL', 'IIT Madras', 'Automotive & EV', 12, 40, 6, ARRAY['EV Powertrain', 'BMS Diagnostics', 'Thermal Management', 'CAN Bus'], 'https://onlinecourses.nptel.ac.in/noc24_ee12/preview', 4.7, 3190),
('Full Stack Web Development with Next.js & PostgreSQL', 'Coursera', 'Meta / Coursera Specialization', 'IT & Digital', 10, 30, 5, ARRAY['TypeScript', 'Next.js', 'PostgreSQL', 'REST APIs', 'Cloud Deployment'], 'https://www.coursera.org/specializations/meta-front-end-developer', 4.8, 8940),
('CNC Machining, Milling & Precision Metrology', 'Skill India', 'National Skill Development Corporation (NSDC)', 'Automotive & Manufacturing', 6, 20, 4, ARRAY['CNC Programming', 'G-Code', 'Vernier Caliper Metrology', 'CAD/CAM'], 'https://www.skillindiadigital.gov.in/courses', 4.6, 980),
('Micro-Enterprise Accounting, GST & Udyam Management', 'MSSDS', 'Maharashtra State Skill Development Society', 'Retail & Commerce', 4, 12, 3, ARRAY['GST Invoicing', 'Udyam Registration', 'P&L Ledger', 'Working Capital'], 'https://www.mssds.gov.in', 4.9, 1750),
('Industrial Electrical Safety & Substation Maintenance', 'Swayam', 'NITTTR Bhopal', 'Electrical & Hardware', 8, 24, 4, ARRAY['Three-Phase Wiring', 'Circuit Breakers', 'Earthing & Grounding', 'OSHA Safety'], 'https://swayam.gov.in', 4.7, 1220),
('Healthcare Assistant & Emergency First Responder', 'Skill India', 'Healthcare Sector Skill Council', 'Healthcare & Caregiving', 8, 28, 4, ARRAY['Patient Vitals', 'CPR & First Aid', 'Sterilization', 'Biomedical Waste'], 'https://www.skillindiadigital.gov.in', 4.8, 2100)
ON CONFLICT DO NOTHING;

-- 2. Seed Interactive Skill Assessments
INSERT INTO public.skill_assessments (id, title, trade_sector, skill_level, duration_minutes, total_questions, passing_score_pct, badge_name, questions_json) VALUES
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Industrial Garment Manufacturing & Quality Inspection',
  'Apparel & Fashion',
  'Intermediate',
  15,
  5,
  70,
  'Master Apparel Quality Specialist (MSSDS)',
  '[
    {
      "id": 1,
      "question": "What is the standard SPI (Stitches Per Inch) required for high-stress seams in commercial woven garment manufacturing?",
      "options": ["6 to 8 SPI", "10 to 12 SPI", "16 to 20 SPI", "24 to 28 SPI"],
      "correct_index": 1,
      "explanation": "10 to 12 SPI provides optimal tensile strength and seam elasticity without puncturing or weakening the woven fabric yarn structure.",
      "skill_tag": "Industrial Stitching"
    },
    {
      "id": 2,
      "question": "When grading a master bodice pattern from Medium to Large, what standard grade increment is typically applied to total chest circumference?",
      "options": ["1.0 cm (0.4 inch)", "2.5 cm (1.0 inch)", "5.0 cm (2.0 inches)", "10.0 cm (4.0 inches)"],
      "correct_index": 2,
      "explanation": "In standard standard apparel grading (ISO / Indian Standard), 5.0 cm (2.0 inches) is the total circumference increment across full body size steps.",
      "skill_tag": "Pattern Making"
    },
    {
      "id": 3,
      "question": "Which quality defect is characterized by puckered stitching caused by unequal thread feed tension between needle and bobbin threads?",
      "options": ["Seam Slippage", "Seam Pucker / Tension Imbalance", "Skip Stitching", "Needle Cut"],
      "correct_index": 1,
      "explanation": "Tension imbalance between upper needle tension and lower bobbin case creates seam puckering along the stitch line.",
      "skill_tag": "Quality Control"
    },
    {
      "id": 4,
      "question": "What type of seam class is standard for joining side seams of industrial shirts (French seam / Lap seam)?",
      "options": ["Class SS (Superimposed Seam)", "Class LS (Lapped Seam)", "Class BS (Bound Seam)", "Class FS (Flat Seam)"],
      "correct_index": 1,
      "explanation": "Class LS (Lapped Seams, e.g. felled seams) are used for strong side seams and jeans due to their interlocking multi-needle fold.",
      "skill_tag": "Industrial Stitching"
    },
    {
      "id": 5,
      "question": "Under AQL (Acceptable Quality Limit) 2.5 sampling standards in garment export inspection, what action is taken when defective garments exceed the rejection threshold?",
      "options": ["Ship the lot with a discount", "Reject and return the entire production lot for 100% re-inspection", "Inspect only 5 more garments", "Approve immediately"],
      "correct_index": 1,
      "explanation": "Exceeding the AQL defect limit requires immediate lot rejection and mandatory 100% re-inspection by quality assurance before re-audit.",
      "skill_tag": "Quality Control"
    }
  ]'::jsonb
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Solar PV Rooftop Installation & Inverter Diagnostics',
  'Renewable Energy',
  'Intermediate',
  15,
  5,
  70,
  'Certified Solar PV Systems Lead (Skill India)',
  '[
    {
      "id": 1,
      "question": "In Maharashtra (Western India), what is the optimal tilt angle for fixed south-facing rooftop solar photovoltaic arrays?",
      "options": ["0° (Flat)", "18° to 20° (equal to local latitude)", "45° to 50°", "80°"],
      "correct_index": 1,
      "explanation": "The optimal fixed tilt angle corresponds approximately to the latitude of Maharashtra (18°-20° North) facing True South for maximum annual irradiation.",
      "skill_tag": "Solar PV Installation"
    },
    {
      "id": 2,
      "question": "What is the purpose of bypass diodes incorporated into a solar PV module junction box?",
      "options": ["To boost system AC voltage", "To prevent hot-spot degradation and power loss caused by partial shading", "To store electricity overnight", "To step down DC voltage"],
      "correct_index": 1,
      "explanation": "Bypass diodes divert string current around shaded solar cells, preventing localized overheating (hot spots) and cell damage.",
      "skill_tag": "Solar PV Installation"
    },
    {
      "id": 3,
      "question": "Which instrument is mandatory to measure the open-circuit voltage (Voc) and short-circuit current (Isc) of a solar string before connecting to an inverter?",
      "options": ["Oscilloscope", "Digital Multimeter / True RMS Solar Clamp Meter rated CAT IV", "Hydrometer", "Tachometer"],
      "correct_index": 1,
      "explanation": "A CAT IV True-RMS multimeter/solar clamp meter rated for up to 1000V/1500V DC safely verifies string Voc and Isc.",
      "skill_tag": "Safety Protocols"
    },
    {
      "id": 4,
      "question": "According to Indian CEA regulations, what is the maximum permissible earth resistance value for solar array equipment earthing?",
      "options": ["Under 5 Ohms (preferably < 1 Ohm for dedicated system earth)", "50 Ohms", "100 Ohms", "500 Ohms"],
      "correct_index": 0,
      "explanation": "CEA safety norms require grounding resistance to remain strictly below 5 Ohms (< 1 Ohm for lightning and inverter grounding) to ensure rapid fault trip.",
      "skill_tag": "Safety Protocols"
    },
    {
      "id": 5,
      "question": "What does MPPT stand for in modern solar inverter and charge controller technology?",
      "options": ["Maximum Power Point Tracking", "Minimum Power Protection Technology", "Multi Phase Power Transfer", "Modular Power Peak Terminal"],
      "correct_index": 0,
      "explanation": "Maximum Power Point Tracking dynamically matches panel impedance to extract the maximum possible wattage under varying sunlight.",
      "skill_tag": "Inverter Wiring"
    }
  ]'::jsonb
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Full-Stack Web Development & Cloud Database Architecture',
  'IT & Digital',
  'Intermediate',
  15,
  5,
  70,
  'Full-Stack Architecture Specialist',
  '[
    {
      "id": 1,
      "question": "In PostgreSQL Row Level Security (RLS), what does the `USING` expression determine versus `WITH CHECK`?",
      "options": ["USING controls existing rows visible for read/update; WITH CHECK validates new rows inserted or modified", "USING is only for passwords", "WITH CHECK is for indexes only", "They are identical in function"],
      "correct_index": 0,
      "explanation": "USING filters rows accessible for SELECT/UPDATE/DELETE; WITH CHECK ensures inserted or updated rows satisfy security predicates.",
      "skill_tag": "PostgreSQL"
    },
    {
      "id": 2,
      "question": "Why is storing JWT access tokens in HttpOnly, Secure, SameSite=Lax cookies safer than localStorage?",
      "options": ["HttpOnly cookies cannot be read by JavaScript, preventing client-side XSS token theft", "LocalStorage is slower", "HttpOnly cookies encrypt the entire page", "LocalStorage only holds 10 bytes"],
      "correct_index": 0,
      "explanation": "HttpOnly flags prevent document.cookie access from malicious XSS scripts, protecting user sessions.",
      "skill_tag": "Cloud Deployment"
    },
    {
      "id": 3,
      "question": "In Next.js App Router, how does a Server Component differ from a Client Component (`''use client''`)?",
      "options": ["Server Components execute exclusively on the server with 0 client JS bundle footprint", "Client components are faster", "Server components cannot query databases", "Client components cannot use CSS"],
      "correct_index": 0,
      "explanation": "React Server Components render on the server, keeping backend keys and heavy libraries off the client bundle.",
      "skill_tag": "Next.js"
    },
    {
      "id": 4,
      "question": "What does a 429 Too Many Requests HTTP status code indicate?",
      "options": ["Rate limiting threshold has been exceeded by the client", "Database is deleted", "User password is invalid", "Page not found"],
      "correct_index": 0,
      "explanation": "HTTP 429 indicates that the client has sent too many requests in a given amount of time (rate limit triggered).",
      "skill_tag": "REST APIs"
    },
    {
      "id": 5,
      "question": "What is the primary advantage of database connection pooling in high-concurrency Node.js applications?",
      "options": ["Reuses persistent database connections rather than opening and tearing down expensive TCP handshakes per query", "Makes SQL queries shorter", "Prevents database backup", "Disables database locks"],
      "correct_index": 0,
      "explanation": "Connection pooling eliminates the high latency and memory overhead of creating new PostgreSQL backend processes per request.",
      "skill_tag": "PostgreSQL"
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Trade Interview Questions (Tata Motors, Raymond, Infosys, Adani Solar)
INSERT INTO public.interview_questions (trade_sector, target_role, company_name, question_text, sample_answer, key_points, difficulty, category, submitted_by_name, is_approved, upvotes) VALUES
(
  'Apparel & Fashion',
  'Senior Quality Inspector',
  'Raymond Textiles Ltd',
  'How do you identify and handle warp-way vs weft-way yarn distortion in finished suiting fabric?',
  'Warp yarns run parallel to the fabric selvedge and typically have higher twist and tensile strength. Weft yarns run across the width. I test for bow and skew distortion using a calibrated grid square. If skew exceeds 2.5%, the fabric undergoes stenter re-alignment and steam conditioning before precision cutting.',
  ARRAY['Selvedge orientation', 'Bow and Skew measurement (< 2.5%)', 'Stenter heat-setting & steam recovery'],
  'Hard',
  'Technical',
  'Sunil Kulkarni (Quality Lead)',
  true,
  24
),
(
  'Apparel & Fashion',
  'Industrial Pattern Maker',
  'Shahi Exports',
  'Explain the step-by-step process of creating a full-sleeve shirt placket with zero puckering.',
  'First, ensure precision knife cuts along the placket slit. Apply 0.5cm high-grade fusible interlining to the upper placket band. Fold and pre-crease at 160°C. Align grainline exactly at 90 degrees to cuff junction. Sew with single-needle lockstitch at 12 SPI with synchronized differential feed.',
  ARRAY['Fusible interlining', 'Pre-creasing temperature 160°C', '12 SPI lockstitch', 'Differential feed alignment'],
  'Medium',
  'Practical / Workshop',
  'Priya Sharma (MSSDS Alum)',
  true,
  41
),
(
  'Renewable Energy',
  'Solar Plant Installation Lead',
  'Adani Solar / Tata Power Solar',
  'What are the mandatory pre-commissioning safety checks you perform before energizing a 50kW commercial rooftop solar inverter?',
  '1. Verify String Polarity and open-circuit voltage (Voc) matches design within 2% across all strings.\n2. Insulation resistance test (Megger test >= 1 Megaohm at 1000V DC) between positive/negative lines and earth.\n3. AC grid phase rotation, voltage tolerance (230V/415V ± 6%), and frequency (50Hz ± 0.5Hz).\n4. Dedicated earth pit resistance < 1.0 Ohm.\n5. Fire emergency DC disconnect switch and surge protection device (SPD) status inspection.',
  ARRAY['Megger insulation test >= 1 MΩ', 'Earth resistance < 1.0 Ω', 'String Voc balance test', 'Grid synchronization parameters'],
  'Hard',
  'Technical',
  'Rajesh Mahajan (Solar Lead)',
  true,
  58
),
(
  'Automotive & EV',
  'EV Battery Service Technician',
  'Tata Passenger Electric Mobility',
  'What safety precautions and diagnostics do you take when a High Voltage (HV) interlock loop (HVIL) fault is triggered in an electric vehicle?',
  'First, don 1000V class-0 insulated safety gloves and face shield. Disconnect the 12V auxiliary battery, remove the manual High-Voltage Service Disconnect (MSD) plug, and wait 10 minutes for DC-bus capacitor discharge. Verify zero voltage (< 5V DC) with a CAT III 1000V multimeter. Then use OBD-II diagnostic scanner and oscilloscope to trace the continuity of the 5V reference HVIL circuit across connectors, battery lid, and inverter casing.',
  ARRAY['Class-0 1000V PPE', 'Manual Service Disconnect (MSD) removal', '10-min capacitor discharge verification', 'HVIL 5V continuity trace'],
  'Hard',
  'Technical',
  'Vikas Shinde (EV Technician)',
  true,
  35
),
(
  'IT & Digital',
  'Junior Full-Stack Software Engineer',
  'Infosys / TCS Digital',
  'How do you protect database APIs against unauthorized data scraping and brute-force token exhaustion?',
  'I implement layered defense: 1. Strict Row Level Security (RLS) policies tied to authenticated JWT claims. 2. Token-bucket rate limiting (e.g. 60 requests per minute per IP/user identifier). 3. Input schema sanitization with Zod. 4. Generic error messages to prevent database enumeration. 5. Server-side caching for high-traffic read endpoints.',
  ARRAY['Row Level Security', 'Token-Bucket Rate Limiting', 'Zod Payload Validation', 'XSS & SQL Injection Prevention'],
  'Medium',
  'Technical',
  'Amit Gaikwad (Nexus Trainee)',
  true,
  29
),
(
  'Retail & Commerce',
  'Micro-Enterprise Business Manager',
  'State Bank of India (MSME Desk)',
  'What are the key financial ratios a bank evaluates when reviewing a PMEGP or Mudra loan application for a boutique retail startup?',
  'Banks assess: 1. Debt Service Coverage Ratio (DSCR > 1.5), ensuring projected monthly operating profit easily covers loan EMI. 2. Current Ratio (>= 1.33:1) for working capital liquidity. 3. Break-even Point (BEP < 60% capacity). 4. Promoters margin contribution (5-10% under PMEGP). 5. Valid Udyam registration and GST track record.',
  ARRAY['DSCR > 1.5', 'Current Ratio >= 1.33', 'PMEGP Subsidy rules', 'Udyam MSME verification'],
  'Medium',
  'Behavioral',
  'Bank MSME Evaluator',
  true,
  19
)
ON CONFLICT DO NOTHING;

-- 4. Seed Default Career Goal & Roadmap for Priya Sharma
INSERT INTO public.trainee_career_goals (
  trainee_id, target_role, target_days, target_salary, current_level, weekly_hours,
  skills_acquired, skills_gap, readiness_pct, wage_multiplier, notes
) VALUES (
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'Senior Apparel Quality Specialist & Boutique Entrepreneur',
  90,
  35000,
  'Intermediate',
  12,
  '["Industrial Stitching", "Pattern Design", "Boutique Management", "Udyam Compliance"]'::jsonb,
  '["AQL 2.5 Quality Inspection", "Garment CAD Grading", "Export Merchandising", "Online E-Commerce Fulfillment"]'::jsonb,
  72.50,
  2.35,
  'Targeting state apparel export certification and expanding boutique monthly revenue past ₹40,000 within 90 days.'
) ON CONFLICT (trainee_id) DO UPDATE SET
  target_role = EXCLUDED.target_role,
  target_days = EXCLUDED.target_days,
  target_salary = EXCLUDED.target_salary,
  readiness_pct = EXCLUDED.readiness_pct,
  wage_multiplier = EXCLUDED.wage_multiplier;

-- 5. Seed Default 90-Day Roadmap for Priya Sharma
INSERT INTO public.career_roadmaps (
  trainee_id, target_role, target_days, phases_json, overall_progress_pct, is_ai_generated
) VALUES (
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'Senior Apparel Quality Specialist & Boutique Entrepreneur',
  90,
  '[
    {
      "phase_number": 1,
      "phase_title": "Phase 1: Foundation Mastery & Skill Benchmarking",
      "day_range": "Days 1 – 25",
      "objective": "Master advanced industrial sewing techniques and pass intermediate quality assessments.",
      "tasks": [
        {"id": "t1", "task": "Complete NPTEL Apparel Technology modules 1-4", "completed": true, "skill_tag": "Industrial Stitching"},
        {"id": "t2", "task": "Attempt Industrial Garment Quality Skill Assessment quiz", "completed": true, "skill_tag": "Quality Control"},
        {"id": "t3", "task": "Register Udyam certificate and link bank business account", "completed": true, "skill_tag": "Udyam Compliance"}
      ]
    },
    {
      "phase_number": 2,
      "phase_title": "Phase 2: Applied Technical Specialization",
      "day_range": "Days 26 – 55",
      "objective": "Build automated pattern grading and learn export AQL 2.5 standards.",
      "tasks": [
        {"id": "t4", "task": "Practice AQL 2.5 sampling on 50 batch garments", "completed": true, "skill_tag": "Quality Control"},
        {"id": "t5", "task": "Complete CAD pattern grading exercises", "completed": false, "skill_tag": "Pattern Design"},
        {"id": "t6", "task": "Review top 10 Raymond & Shahi Exports interview questions", "completed": false, "skill_tag": "Interview Prep"}
      ]
    },
    {
      "phase_number": 3,
      "phase_title": "Phase 3: Industry Project & Mock Interviews",
      "day_range": "Days 56 – 75",
      "objective": "Run 3 AI Mock Interview simulations and create export portfolio.",
      "tasks": [
        {"id": "t7", "task": "Simulate AI Mock Interview for Senior Quality Inspector role", "completed": false, "skill_tag": "Interview Prep"},
        {"id": "t8", "task": "Upload audited quality checklist to Documents Vault", "completed": false, "skill_tag": "Verification"},
        {"id": "t9", "task": "Submit 2 user-experienced interview questions to community desk", "completed": false, "skill_tag": "Community Q&A"}
      ]
    },
    {
      "phase_number": 4,
      "phase_title": "Phase 4: Apprenticeship, Loan Grant & Placement",
      "day_range": "Days 76 – 90",
      "objective": "Finalize PMEGP subsidy grant and interview with verified industry employers.",
      "tasks": [
        {"id": "t10", "task": "Apply for ₹1,50,000 PMEGP machinery subsidy scheme", "completed": false, "skill_tag": "Schemes"},
        {"id": "t11", "task": "Attend scheduled interviews on Nexus Employer Desk", "completed": false, "skill_tag": "Placement"},
        {"id": "t12", "task": "Achieve target ₹35,000 monthly income milestone", "completed": false, "skill_tag": "Wage Lift"}
      ]
    }
  ]'::jsonb,
  33,
  true
) ON CONFLICT (trainee_id) DO UPDATE SET
  phases_json = EXCLUDED.phases_json,
  overall_progress_pct = EXCLUDED.overall_progress_pct;

COMMIT;
