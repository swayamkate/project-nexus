-- =============================================================================
-- NEXUS: PS-135 SEED DATA FOR DEMO & HACKATHON EVALUATION
-- =============================================================================

-- 1. Insert Skills Taxonomy
INSERT INTO skills (name, slug, category, description, difficulty_level, market_demand_index) VALUES
('Next.js & React', 'react-nextjs', 'technical', 'Modern full-stack web application development', 3, 0.95),
('PostgreSQL & Database Design', 'postgresql', 'technical', 'Relational database schema modeling and SQL optimization', 3, 0.90),
('TypeScript', 'typescript', 'technical', 'Type-safe programming for scalable applications', 3, 0.92),
('Solar PV System Installation', 'solar-pv-install', 'domain_knowledge', 'Grid-tied and off-grid solar photovoltaic installation standards', 4, 0.94),
('EV Battery Diagnostics', 'ev-battery-diag', 'technical', 'High-voltage safety and battery management system testing', 4, 0.96),
('CNC Machine Programming & Operation', 'cnc-machining', 'technical', 'G-code programming and precision CNC turning/milling', 3, 0.88),
('Data Analytics with Python', 'python-data-analytics', 'technical', 'Pandas, NumPy, and business intelligence visualization', 3, 0.91),
('Healthcare Patient Vitals & Care', 'nursing-patient-care', 'domain_knowledge', 'Clinical vitals monitoring and emergency triage care', 2, 0.89),
('Quality Assurance & Testing', 'qa-testing', 'technical', 'Automated and manual software verification', 2, 0.85),
('Digital Marketing & SEO', 'digital-marketing', 'domain_knowledge', 'Search engine optimization and performance marketing', 2, 0.82)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Target Roles Catalog
INSERT INTO roles_catalog (title, industry, average_starting_salary, growth_rate_pct, typical_learning_hours, description) VALUES
('Full Stack Web Developer', 'Information Technology', 45000.00, 18.50, 140, 'Designs and deploys scalable web applications and REST APIs'),
('Solar PV Project Technician', 'Renewable Energy', 32000.00, 15.00, 90, 'Installs and maintains rooftop and industrial solar power plants'),
('Electric Vehicle (EV) Service Specialist', 'Automotive', 38000.00, 22.00, 110, 'Diagnoses electric vehicle powertrains and battery management systems'),
('Data Analyst & BI Associate', 'Analytics & Finance', 42000.00, 16.00, 100, 'Transforms operational datasets into actionable executive insights'),
('Precision CNC Operator', 'Advanced Manufacturing', 28000.00, 11.50, 80, 'Operates multi-axis CNC machines for aerospace and auto components')
ON CONFLICT (title) DO NOTHING;

-- 3. Link Roles to Required Skills
INSERT INTO role_skill_requirements (role_id, skill_id, required_proficiency, is_mandatory, weight)
SELECT r.id, s.id, 4, true, 1.2
FROM roles_catalog r, skills s
WHERE r.title = 'Full Stack Web Developer' AND s.slug IN ('react-nextjs', 'typescript', 'postgresql')
ON CONFLICT DO NOTHING;

INSERT INTO role_skill_requirements (role_id, skill_id, required_proficiency, is_mandatory, weight)
SELECT r.id, s.id, 4, true, 1.0
FROM roles_catalog r, skills s
WHERE r.title = 'Solar PV Project Technician' AND s.slug IN ('solar-pv-install')
ON CONFLICT DO NOTHING;

INSERT INTO role_skill_requirements (role_id, skill_id, required_proficiency, is_mandatory, weight)
SELECT r.id, s.id, 4, true, 1.0
FROM roles_catalog r, skills s
WHERE r.title = 'Electric Vehicle (EV) Service Specialist' AND s.slug IN ('ev-battery-diag')
ON CONFLICT DO NOTHING;

INSERT INTO role_skill_requirements (role_id, skill_id, required_proficiency, is_mandatory, weight)
SELECT r.id, s.id, 4, true, 1.0
FROM roles_catalog r, skills s
WHERE r.title = 'Data Analyst & BI Associate' AND s.slug IN ('python-data-analytics', 'postgresql')
ON CONFLICT DO NOTHING;

-- 4. Verified Courses Catalog
INSERT INTO courses_catalog (title, provider_name, duration_hours, verification_standard, badge_hash, course_url) VALUES
('Full Stack Next.js & Cloud Masterclass', 'NSDC Tech Academy', 45, 'NSDC_Level_5', 'nx-badge-fs-2026', 'https://nsdc.gov.in/course/fs-nextjs'),
('Industrial Solar Power Installation & Safety', 'National Institute of Solar Energy (NISE)', 40, 'Skill_India_Gov', 'nx-badge-solar-2026', 'https://nise.res.in/solar-cert'),
('EV Powertrain & BMS Specialist Certification', 'Automotive Skills Development Council', 50, 'ASDC_Certified', 'nx-badge-ev-2026', 'https://asdc.org.in/ev-cert'),
('PostgreSQL Advanced Query & Schema Design', 'Database Excellence Institute', 30, 'Industry_Standard', 'nx-badge-db-2026', 'https://dbexcellence.org/pg-cert')
ON CONFLICT DO NOTHING;

-- 5. Seed Interview Insights (Glassdoor Style)
INSERT INTO interview_insights (company_name, role_title, author_privacy_hash, difficulty_rating, interview_outcome, questions_asked, hiring_process_review, recommended_skills, upvotes) VALUES
('Tata Power Solar', 'Solar PV Project Technician', 'hash_trainee_8921_anon', 3, 'Offer Accepted', 
 '["Explain the difference between MPPT and PWM charge controllers", "How do you calculate inverter sizing for a 10kW 3-phase grid-tied system?", "What are OSHA safety measures for rooftop rigging?"]'::jsonb,
 'Technical round with senior engineer focused heavily on real-world installation safety standards and inverter troubleshooting. Offer came within 4 days.',
 ARRAY['Solar PV System Installation', 'Electrical Safety'], 14),

('Infosys Digital', 'Full Stack Web Developer', 'hash_trainee_4129_anon', 4, 'Offer Accepted',
 '["Explain server components vs client components in Next.js App Router", "How do you prevent SQL injection in parameterized PostgreSQL queries?", "Optimize a large React table rendering 10,000 rows."]'::jsonb,
 'Round 1 was live coding in TypeScript and Next.js. Round 2 was system design on database indexing and state management.',
 ARRAY['Next.js & React', 'TypeScript', 'PostgreSQL & Database Design'], 28),

('Ola Electric', 'Electric Vehicle (EV) Service Specialist', 'hash_trainee_3312_anon', 3, 'Offer Accepted',
 '["What are the critical symptoms of thermal runaway in Lithium-ion cells?", "How do you inspect CAN bus communication between BMS and MCU?"]'::jsonb,
 'Hands-on practical test in diagnostic lab followed by manager interview. Very supportive panel.',
 ARRAY['EV Battery Diagnostics', 'CAN Bus Troubleshooting'], 19);
