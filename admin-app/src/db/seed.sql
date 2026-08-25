-- =============================================================================
-- MAHA-SKILL TRACK SEED DATA SCRIPT (EXACT DATA MATCHING DESIGN)
-- =============================================================================

-- 1. Seed Trainee Priya Sharma
INSERT INTO trainees (
    id, trainee_id, full_name, email, phone, dob, gender, aadhaar_masked,
    address, district, state, pincode, avatar_url, profile_completion_pct,
    highest_education, board_university, year_of_passing, education_percentage,
    skills, about_me
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'TRN123456',
    'Priya Sharma',
    'priya.sharma@example.com',
    '+91 98765 43210',
    '2002-05-15',
    'Female',
    'XXXX-XXXX-1234',
    '123, Shivaji Nagar, Pune, Maharashtra - 411005',
    'Pune',
    'Maharashtra',
    '411005',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    85,
    '12th (Science)',
    'Maharashtra State Board',
    2020,
    78.60,
    ARRAY['Tailoring', 'Stitching', 'Pattern Making', 'Fabric Knowledge', 'Embroidery', 'Machine Operation'],
    'I am passionate about tailoring and fashion designing. I have completed my training and now running my own tailoring business. I love creating new designs and delivering quality work to my customers.'
) ON CONFLICT (email) DO NOTHING;

-- 2. Seed Training Programs & Enrollments
INSERT INTO training_programs (id, title, sector, duration_months, provider_name) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Advanced Apparel & Fashion Tailoring Masterclass', 'Apparel & Fashion', 3, 'Maharashtra State Skill Development Society (MSSDS)')
ON CONFLICT DO NOTHING;

INSERT INTO trainee_enrollments (trainee_id, program_id, enrolled_date, completed_date, certified_date, certificate_id, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-04-10', '2024-06-30', '2024-07-15', 'MS-CERT-982145', 'certified')
ON CONFLICT DO NOTHING;

-- 3. Seed Self-Employment Overview
INSERT INTO trainee_employment (
    trainee_id, status, business_name, business_type, start_date, location, monthly_income_range, exact_monthly_income, is_verified
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'self_employed',
    'Priya Stitch Works',
    'Tailoring Services',
    '2024-08-01',
    'Pune, Maharashtra',
    '₹10,000 - ₹20,000',
    16500.00,
    true
) ON CONFLICT DO NOTHING;

-- 4. Seed Follow-ups (3M, 6M, 12M)
INSERT INTO trainee_followups (
    trainee_id, milestone, milestone_label, scheduled_date, submitted_date, status, business_status, income_range, remarks
) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '3_months', '3 Months Follow-up', '2024-11-20', '2024-11-20', 'completed', 'active', '₹5,000 - ₹10,000', 'Business is going well. Getting regular customers.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '6_months', '6 Months Follow-up', '2025-02-20', '2025-02-20', 'completed', 'active', '₹10,000 - ₹20,000', 'Increased client base and income.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '12_months', '12 Months Follow-up', '2025-08-20', NULL, 'upcoming', NULL, NULL, 'Pending')
ON CONFLICT DO NOTHING;

-- 5. Seed Top Skill Gaps
INSERT INTO top_skill_gaps (skill_name, sector, demand_gap, demand_growth_pct) VALUES
('Electric Vehicle Technician', 'Automotive', -4250, 35.0),
('Industrial Automation', 'Advanced Manufacturing', -3870, 28.0),
('Data Analytics', 'IT & ITeS', -3400, 24.0),
('Cloud Computing', 'IT & ITeS', -2980, 22.0),
('Solar Panel Technician', 'Renewable Energy', -2760, 30.0)
ON CONFLICT (skill_name) DO NOTHING;

-- 6. Seed District Stats
INSERT INTO district_employment_stats (district_name, state_name, employed_count, total_trainees, employment_rate_pct, avg_salary) VALUES
('Pune', 'Maharashtra', 245680, 310000, 79.2, 21500),
('Mumbai', 'Maharashtra', 210450, 270000, 77.9, 24000),
('Nagpur', 'Maharashtra', 125840, 180000, 69.9, 17200),
('Nashik', 'Maharashtra', 105230, 150000, 70.1, 16800),
('Aurangabad', 'Maharashtra', 98750, 140000, 70.5, 16200)
ON CONFLICT (district_name) DO NOTHING;

-- 7. Seed Recommended Opportunities
INSERT INTO recommended_opportunities (title, category, provider_scheme, description, icon_type) VALUES
('Digital Marketing Advanced Course', 'Online Course', 'Online Course', 'Learn social commerce, customer acquisition, and local SEO for retail businesses.', 'course'),
('Government Scheme for Entrepreneurs', 'PMEGP Scheme', 'PMEGP Scheme', 'Collateral-free subsidized credit facility for micro enterprises and tailoring units.', 'scheme'),
('Join Local Business Network', 'Connect & Grow', 'Connect & Grow', 'Collaborate with local boutiques, raw fabric suppliers, and wholesale buyers.', 'network')
ON CONFLICT DO NOTHING;

-- 8. Seed Notifications
INSERT INTO trainee_notifications (trainee_id, title, message, notification_date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Your 3 Months follow-up has been recorded successfully.', 'Thank you for updating your business status.', '2024-11-20'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'New course Advanced Tailoring Techniques is available.', 'Check out newly added advanced pattern making modules.', '2024-12-05'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Your next follow-up is due on 20 Jun 2025.', 'Reminder to complete your 12 Months longitudinal milestone.', '2025-05-20')
ON CONFLICT DO NOTHING;

-- 9. Seed AI Insight
INSERT INTO ai_policy_insights (insight_text, target_sector, target_districts) VALUES
('The demand for Electric Vehicle Technicians has increased by 35% in the last 6 months, but trained candidates are only 12% of the demand in Pune and Nashik districts.', 'Automotive / EV', ARRAY['Pune', 'Nashik'])
ON CONFLICT DO NOTHING;
