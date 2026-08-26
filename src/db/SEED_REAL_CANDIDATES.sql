DO $$
DECLARE
    t1_id UUID := gen_random_uuid();
    t2_id UUID := gen_random_uuid();
    t3_id UUID := gen_random_uuid();
    t4_id UUID := gen_random_uuid();
    t5_id UUID := gen_random_uuid();
    prog_tailoring UUID;
    prog_solar UUID;
    prog_it UUID;
    prog_ev UUID;
BEGIN
    SELECT id INTO prog_tailoring FROM public.training_programs WHERE title LIKE '%Tailoring%' LIMIT 1;
    SELECT id INTO prog_solar FROM public.training_programs WHERE title LIKE '%Solar%' LIMIT 1;
    SELECT id INTO prog_it FROM public.training_programs WHERE title LIKE '%Web Development%' LIMIT 1;
    SELECT id INTO prog_ev FROM public.training_programs WHERE title LIKE '%Electric Vehicle%' LIMIT 1;

    -- Trainee 1: Priya Sharma (Pune)
    INSERT INTO public.trainees (
        id, trainee_id, username, full_name, email, phone, dob, gender, address, district, state,
        highest_education, board_university, year_of_passing, education_percentage,
        skills, about_me, profile_completion_pct, is_active
    ) VALUES (
        t1_id, 'TRN-847291', 'priya_sharma', 'Priya Sharma', 'priya.sharma@mahaskill.in', '+91 98231 45678', '2002-05-14', 'Female',
        'Flat 402, Shivajinagar', 'Pune', 'Maharashtra',
        '12th Standard (Arts)', 'Maharashtra State Board', 2020, 81.40,
        ARRAY['Boutique Tailoring', 'Pattern Design', 'Digital Payments', 'ONDC Selling'],
        'Certified garment specialist and founder of Priya Designer Boutique. Empowering 4 local artisans through custom apparel manufacturing.', 90, true
    ) ON CONFLICT (email) DO NOTHING;

    INSERT INTO public.trainee_employment (
        trainee_id, status, business_name, business_type, business_category, business_status, establishment_date,
        monthly_revenue, monthly_profit, udyam_number, gst_number, business_address, employees_count, verified_by_admin
    ) VALUES (
        t1_id, 'self_employed', 'Priya Designer Boutique', 'Micro Enterprise', 'Apparel & Fashion', 'active', '2023-08-15',
        45000.00, 18500.00, 'UDYAM-MH-26-0048291', '27ABCDE1234F1Z5', 'Shop 12, FC Road, Pune', 4, true
    ) ON CONFLICT DO NOTHING;

    IF prog_tailoring IS NOT NULL THEN
        INSERT INTO public.trainee_enrollments (trainee_id, program_id, enrolled_date, completed_date, certified_date, status, grade)
        VALUES (t1_id, prog_tailoring, '2023-01-10', '2023-04-10', '2023-04-15', 'certified', 'A+')
        ON CONFLICT DO NOTHING;
    END IF;

    INSERT INTO public.verifications (trainee_id, document_type, document_name, document_url, status, reviewed_by, reviewed_at)
    VALUES (t1_id, 'udyam', 'Udyam Registration Certificate - Priya Boutique.pdf', 'https://api.avishkark.in/storage/v1/object/public/docs/udyam_sample.pdf', 'approved', 'admin@nexus.com', NOW())
    ON CONFLICT DO NOTHING;

    INSERT INTO public.trainee_followups (trainee_id, milestone, due_date, completed_date, status, current_status, current_income_range, income_growth_pct, job_satisfaction_score)
    VALUES (t1_id, '6_months', '2023-10-15', '2023-10-12', 'completed', 'self_employed', '₹35,000 - ₹50,000', 45.00, 5)
    ON CONFLICT DO NOTHING;

    -- Trainee 2: Rahul Deshmukh (Nagpur)
    INSERT INTO public.trainees (
        id, trainee_id, username, full_name, email, phone, dob, gender, address, district, state,
        highest_education, board_university, year_of_passing, education_percentage,
        skills, about_me, profile_completion_pct, is_active
    ) VALUES (
        t2_id, 'TRN-519284', 'rahul_solar', 'Rahul Deshmukh', 'rahul.deshmukh@mahaskill.in', '+91 97654 32109', '2001-09-20', 'Male',
        'Plot 18, Wardha Road', 'Nagpur', 'Maharashtra',
        'ITI Electrical', 'MSBTE Maharashtra', 2021, 79.20,
        ARRAY['Solar Rooftop PV', 'Inverter Diagnostics', 'High-Voltage Safety', 'Grid Sync'],
        'Grid solar installation specialist certified under NISE with experience in commercial rooftop installations across Vidarbha.', 85, true
    ) ON CONFLICT (email) DO NOTHING;

    INSERT INTO public.trainee_employment (
        trainee_id, status, company_name, designation, joining_date, monthly_salary, verified_by_admin
    ) VALUES (
        t2_id, 'employed', 'Mahagenco Green Energy Solutions', 'Lead Solar Technician', '2023-06-01', 28500.00, true
    ) ON CONFLICT DO NOTHING;

    IF prog_solar IS NOT NULL THEN
        INSERT INTO public.trainee_enrollments (trainee_id, program_id, enrolled_date, completed_date, certified_date, status, grade)
        VALUES (t2_id, prog_solar, '2023-02-01', '2023-05-30', '2023-06-05', 'certified', 'A')
        ON CONFLICT DO NOTHING;
    END IF;

    INSERT INTO public.verifications (trainee_id, document_type, document_name, document_url, status, reviewed_by, reviewed_at)
    VALUES (t2_id, 'offer_letter', 'Offer Letter & Salary Slip - Mahagenco.pdf', 'https://api.avishkark.in/storage/v1/object/public/docs/offer_sample.pdf', 'approved', 'admin@nexus.com', NOW())
    ON CONFLICT DO NOTHING;

    -- Trainee 3: Snehal Patil (Nashik)
    INSERT INTO public.trainees (
        id, trainee_id, username, full_name, email, phone, dob, gender, address, district, state,
        highest_education, board_university, year_of_passing, education_percentage,
        skills, about_me, profile_completion_pct, is_active
    ) VALUES (
        t3_id, 'TRN-639102', 'snehal_tech', 'Snehal Patil', 'snehal.patil@mahaskill.in', '+91 94230 87654', '2000-11-08', 'Female',
        'College Road, Nashik', 'Nashik', 'Maharashtra',
        'B.Sc Computer Science', 'Savitribai Phule Pune University', 2022, 84.50,
        ARRAY['Full-Stack Development', 'PostgreSQL', 'Cloud Infrastructure', 'REST APIs'],
        'Building next-generation digital tools and agri-commerce solutions for farmers and rural self-help groups in North Maharashtra.', 95, true
    ) ON CONFLICT (email) DO NOTHING;

    INSERT INTO public.trainee_employment (
        trainee_id, status, business_name, business_type, business_category, business_status, establishment_date,
        monthly_revenue, monthly_profit, udyam_number, employees_count, verified_by_admin
    ) VALUES (
        t3_id, 'self_employed', 'Patil Cloud Consulting', 'Sole Proprietorship', 'IT & Digital Services', 'active', '2023-09-01',
        65000.00, 42000.00, 'UDYAM-MH-15-0063910', 2, true
    ) ON CONFLICT DO NOTHING;

    -- Trainee 4: Amit Gaikwad (Chhatrapati Sambhajinagar)
    INSERT INTO public.trainees (
        id, trainee_id, username, full_name, email, phone, dob, gender, address, district, state,
        highest_education, board_university, year_of_passing, education_percentage,
        skills, about_me, profile_completion_pct, is_active
    ) VALUES (
        t4_id, 'TRN-392817', 'amit_ev', 'Amit Gaikwad', 'amit.gaikwad@mahaskill.in', '+91 98901 23456', '2003-02-28', 'Male',
        'CIDCO N-4', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Maharashtra',
        '10th Standard + ITI Mechanic', 'Maharashtra Vocational Board', 2022, 76.80,
        ARRAY['EV Powertrain', 'Lithium Battery Repair', 'BMS Calibration', 'Motor Controllers'],
        'Certified EV service technician operating independent two-wheeler EV repair hub funded under PM Mudra Shishu grant.', 80, true
    ) ON CONFLICT (email) DO NOTHING;

    INSERT INTO public.trainee_employment (
        trainee_id, status, business_name, business_type, business_category, business_status, establishment_date,
        monthly_revenue, monthly_profit, employees_count, verified_by_admin
    ) VALUES (
        t4_id, 'self_employed', 'Gaikwad EV Service Center', 'Partnership', 'Automotive Services', 'active', '2024-01-15',
        38000.00, 16000.00, 2, false
    ) ON CONFLICT DO NOTHING;

    -- Pending document for Amit Gaikwad
    INSERT INTO public.verifications (trainee_id, document_type, document_name, document_url, status)
    VALUES (t4_id, 'bank_statement', 'Mudra Loan Sanction Letter - Bank of Maharashtra.pdf', 'https://api.avishkark.in/storage/v1/object/public/docs/mudra_sample.pdf', 'pending')
    ON CONFLICT DO NOTHING;

    -- Trainee 5: Kavita Jadhav (Thane)
    INSERT INTO public.trainees (
        id, trainee_id, username, full_name, email, phone, dob, gender, address, district, state,
        highest_education, board_university, year_of_passing, education_percentage,
        skills, about_me, profile_completion_pct, is_active
    ) VALUES (
        t5_id, 'TRN-741920', 'kavita_thane', 'Kavita Jadhav', 'kavita.jadhav@mahaskill.in', '+91 98190 65432', '1999-07-19', 'Female',
        'Ghodbunder Road', 'Thane', 'Maharashtra',
        'Diploma in Textile Technology', 'Government Polytechnic Thane', 2020, 88.30,
        ARRAY['Textile Quality Testing', 'Industrial Sewing', 'Merchandising', 'Export Standards'],
        'Textile quality supervisor and owner of Thane Stitchworks, exporting eco-friendly fabric bags and apparel.', 90, true
    ) ON CONFLICT (email) DO NOTHING;

    INSERT INTO public.trainee_employment (
        trainee_id, status, business_name, business_type, business_category, business_status, establishment_date,
        monthly_revenue, monthly_profit, udyam_number, employees_count, verified_by_admin
    ) VALUES (
        t5_id, 'self_employed', 'Thane Stitchworks', 'Private Limited', 'Textiles & Garments', 'active', '2023-04-10',
        92000.00, 31000.00, 'UDYAM-MH-33-0074192', 6, true
    ) ON CONFLICT DO NOTHING;

    -- Pending document for Kavita Jadhav
    INSERT INTO public.verifications (trainee_id, document_type, document_name, document_url, status)
    VALUES (t5_id, 'gst', 'GST Registration Certificate - Thane Stitchworks.pdf', 'https://api.avishkark.in/storage/v1/object/public/docs/gst_sample.pdf', 'pending')
    ON CONFLICT DO NOTHING;

END $$;
