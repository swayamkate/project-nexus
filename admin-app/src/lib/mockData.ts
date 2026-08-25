import { 
  Skill, 
  RoleCatalog, 
  Course, 
  Profile, 
  EmploymentRecord, 
  WageProgressionLog, 
  AttritionLog, 
  SelfEmploymentValidation, 
  InterviewInsight,
  AutomatedFollowup 
} from '@/types/database';

export const mockSkills: Skill[] = [
  {
    id: 'sk-1',
    name: 'Next.js & React 19',
    slug: 'react-nextjs',
    category: 'technical',
    description: 'Server actions, App Router, SSR, and reactive state management',
    difficulty_level: 3,
    market_demand_index: 0.96,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sk-2',
    name: 'TypeScript & Type Safety',
    slug: 'typescript',
    category: 'technical',
    description: 'Generic types, discriminated unions, and scalable codebases',
    difficulty_level: 3,
    market_demand_index: 0.92,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sk-3',
    name: 'PostgreSQL & Database Design',
    slug: 'postgresql',
    category: 'technical',
    description: 'Schema normalization, indexing, RLS, and query execution plans',
    difficulty_level: 4,
    market_demand_index: 0.94,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sk-4',
    name: 'Solar PV System Installation',
    slug: 'solar-pv-install',
    category: 'domain_knowledge',
    description: 'Rooftop stringing, inverter sizing, grid synchronization, and safety',
    difficulty_level: 4,
    market_demand_index: 0.95,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sk-5',
    name: 'EV Battery Management & Diagnostics',
    slug: 'ev-battery-diag',
    category: 'technical',
    description: 'High voltage BMS inspection, CAN communication, thermal safety',
    difficulty_level: 4,
    market_demand_index: 0.98,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sk-6',
    name: 'Precision CNC Machining & G-Code',
    slug: 'cnc-machining',
    category: 'technical',
    description: 'CAD/CAM toolpath generation, 4-axis mill operation, tolerance measurement',
    difficulty_level: 3,
    market_demand_index: 0.88,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sk-7',
    name: 'Data Analytics & Python BI',
    slug: 'python-data-analytics',
    category: 'technical',
    description: 'Pandas ETL pipelines, statistical modeling, executive dashboards',
    difficulty_level: 3,
    market_demand_index: 0.91,
    created_at: new Date().toISOString(),
  }
];

export const mockRoles: RoleCatalog[] = [
  {
    id: 'role-1',
    title: 'Full Stack Web Developer',
    industry: 'Information Technology',
    average_starting_salary: 45000,
    growth_rate_pct: 18.5,
    typical_learning_hours: 140,
    description: 'Builds end-to-end resilient web applications, modern APIs, and responsive UIs for fast-growing enterprises.',
    created_at: new Date().toISOString(),
    skills: [
      { skill: mockSkills[0], required_proficiency: 4, is_mandatory: true },
      { skill: mockSkills[1], required_proficiency: 4, is_mandatory: true },
      { skill: mockSkills[2], required_proficiency: 3, is_mandatory: true },
    ]
  },
  {
    id: 'role-2',
    title: 'Solar PV Project Technician',
    industry: 'Clean Energy & Utilities',
    average_starting_salary: 32000,
    growth_rate_pct: 15.0,
    typical_learning_hours: 90,
    description: 'Specializes in solar array installation, DC/AC cabling, power inverter synchronization, and safety compliance.',
    created_at: new Date().toISOString(),
    skills: [
      { skill: mockSkills[3], required_proficiency: 4, is_mandatory: true },
      { skill: mockSkills[2], required_proficiency: 2, is_mandatory: false }
    ]
  },
  {
    id: 'role-3',
    title: 'EV Powertrain & BMS Diagnostic Specialist',
    industry: 'Automotive & Mobility',
    average_starting_salary: 38000,
    growth_rate_pct: 22.0,
    typical_learning_hours: 110,
    description: 'Diagnoses high-voltage battery packs, cell balancing modules, and CAN bus sensors in electric mobility platforms.',
    created_at: new Date().toISOString(),
    skills: [
      { skill: mockSkills[4], required_proficiency: 4, is_mandatory: true }
    ]
  },
  {
    id: 'role-4',
    title: 'Data Analyst & Business Intelligence Associate',
    industry: 'Finance & Analytics',
    average_starting_salary: 42000,
    growth_rate_pct: 16.5,
    typical_learning_hours: 100,
    description: 'Synthesizes enterprise data logs, predicts churn, and automates operational KPI reporting.',
    created_at: new Date().toISOString(),
    skills: [
      { skill: mockSkills[6], required_proficiency: 4, is_mandatory: true },
      { skill: mockSkills[2], required_proficiency: 3, is_mandatory: true }
    ]
  },
  {
    id: 'role-5',
    title: 'Advanced CNC Machining Operator',
    industry: 'Manufacturing & Aerospace',
    average_starting_salary: 29000,
    growth_rate_pct: 12.0,
    typical_learning_hours: 85,
    description: 'Programs and operates high-precision multi-axis CNC machines adhering to aerospace micro-tolerances.',
    created_at: new Date().toISOString(),
    skills: [
      { skill: mockSkills[5], required_proficiency: 4, is_mandatory: true }
    ]
  }
];

export const mockCourses: Course[] = [
  {
    id: 'c-1',
    title: 'NSDC Certified Full Stack Next.js & Serverless Systems',
    provider_name: 'National Skill Development Corporation (NSDC)',
    duration_hours: 50,
    skills_covered: [
      { skill_name: 'Next.js & React 19', proficiency_gain: 3 },
      { skill_name: 'TypeScript & Type Safety', proficiency_gain: 2 }
    ],
    badge_hash: 'NX-NSDC-FS-2026',
    verification_standard: 'NSDC_Level_5',
    course_url: 'https://nsdcindia.org/courses/fs-web-2026'
  },
  {
    id: 'c-2',
    title: 'Industrial Rooftop & Grid-Tied Solar Installation',
    provider_name: 'National Institute of Solar Energy (NISE)',
    duration_hours: 40,
    skills_covered: [
      { skill_name: 'Solar PV System Installation', proficiency_gain: 4 }
    ],
    badge_hash: 'NX-NISE-SOLAR-2026',
    verification_standard: 'Skill_India_Gov',
    course_url: 'https://nise.res.in/solar-cert-course'
  },
  {
    id: 'c-3',
    title: 'EV Battery Management & High Voltage Safety',
    provider_name: 'Automotive Skills Development Council (ASDC)',
    duration_hours: 45,
    skills_covered: [
      { skill_name: 'EV Battery Management & Diagnostics', proficiency_gain: 4 }
    ],
    badge_hash: 'NX-ASDC-EV-2026',
    verification_standard: 'ASDC_Level_4',
    course_url: 'https://asdc.org.in/ev-powertrain'
  },
  {
    id: 'c-4',
    title: 'PostgreSQL Architecture, Indexing & Query Tuning',
    provider_name: 'Database Architecture Foundation',
    duration_hours: 30,
    skills_covered: [
      { skill_name: 'PostgreSQL & Database Design', proficiency_gain: 3 }
    ],
    badge_hash: 'NX-PG-DBA-2026',
    verification_standard: 'Industry_Standard',
    course_url: 'https://dbfoundation.org/pg-perf'
  }
];

export const mockTraineeProfile: Profile = {
  id: 'tr-101',
  email: 'arjun.sharma@nexus.in',
  full_name: 'Arjun Sharma',
  phone: '+91 98765 43210',
  role: 'trainee',
  privacy_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  state: 'Maharashtra',
  district: 'Pune',
  pincode: '411014',
  gender: 'Male',
  education_level: 'Diploma in Computer Engineering',
  baseline_income: 12000,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  created_at: '2025-06-15T10:00:00Z',
  updated_at: new Date().toISOString(),
};

export const mockEmploymentTimeline: EmploymentRecord[] = [
  {
    id: 'emp-1',
    trainee_id: 'tr-101',
    company_name: 'QuickTech Services',
    job_title: 'Junior Web Trainee (Contract)',
    employment_type: 'temporary',
    is_current: false,
    start_date: '2025-07-01',
    end_date: '2025-10-31',
    starting_monthly_wage: 15000,
    current_monthly_wage: 15000,
    currency: 'INR',
    state: 'Maharashtra',
    district: 'Pune',
    verification_status: 'verified',
    created_at: '2025-07-01T09:00:00Z'
  },
  {
    id: 'emp-2',
    trainee_id: 'tr-101',
    company_name: 'Apex Digital Solutions',
    job_title: 'Associate Full Stack Developer',
    employment_type: 'permanent',
    is_current: true,
    start_date: '2025-11-15',
    starting_monthly_wage: 32000,
    current_monthly_wage: 42000,
    currency: 'INR',
    state: 'Maharashtra',
    district: 'Pune',
    verification_status: 'verified',
    created_at: '2025-11-15T09:00:00Z'
  }
];

export const mockWageLogs: WageProgressionLog[] = [
  { id: 'w-1', employment_record_id: 'emp-1', trainee_id: 'tr-101', recorded_at: '2025-07-01', monthly_wage: 15000, wage_increment_pct: 0, verified: true },
  { id: 'w-2', employment_record_id: 'emp-2', trainee_id: 'tr-101', recorded_at: '2025-11-15', monthly_wage: 32000, wage_increment_pct: 113.3, verified: true },
  { id: 'w-3', employment_record_id: 'emp-2', trainee_id: 'tr-101', recorded_at: '2026-03-01', monthly_wage: 37000, wage_increment_pct: 15.6, verified: true },
  { id: 'w-4', employment_record_id: 'emp-2', trainee_id: 'tr-101', recorded_at: '2026-08-01', monthly_wage: 42000, wage_increment_pct: 13.5, verified: true },
];

export const mockAttritionLogs: AttritionLog[] = [
  {
    id: 'att-1',
    employment_record_id: 'emp-1',
    trainee_id: 'tr-101',
    exit_date: '2025-10-31',
    tenure_days: 122,
    primary_reason: 'contract_expired',
    specific_explanation: 'Fixed-term 4-month skilling internship completed with positive recommendation.',
    was_severance_paid: false,
    next_expected_step: 'Secured full-time permanent role at Apex Digital Solutions',
    created_at: '2025-10-31T18:00:00Z'
  },
  {
    id: 'att-2',
    employment_record_id: 'emp-99',
    trainee_id: 'tr-802',
    exit_date: '2026-02-15',
    tenure_days: 74,
    primary_reason: 'removed_no_reason',
    specific_explanation: 'Abrupt verbal termination without performance evaluation notice or 30-day salary.',
    was_severance_paid: false,
    next_expected_step: 'Re-entering skill mapping portal for solar technician certification',
    created_at: '2026-02-15T10:00:00Z'
  },
  {
    id: 'att-3',
    employment_record_id: 'emp-98',
    trainee_id: 'tr-803',
    exit_date: '2026-05-20',
    tenure_days: 210,
    primary_reason: 'compensation',
    specific_explanation: 'Market standard was 35k; employer refused milestone review despite 100% SLA completion.',
    was_severance_paid: true,
    next_expected_step: 'Transitioned to verified self-employment / freelance contracts',
    created_at: '2026-05-20T12:00:00Z'
  }
];

export const mockSelfEmployment: SelfEmploymentValidation[] = [
  {
    id: 'se-1',
    trainee_id: 'tr-304',
    business_name: 'SolarSphere Energy Solutions',
    business_type: 'Sole Proprietorship / CleanTech Agency',
    trade_license_number: 'MH-TL-2025-88412',
    gst_udyam_tax_id: 'UDYAM-MH-26-0049182',
    business_identity_doc_url: 'https://docs.nexus.in/proofs/udyam-solarsphere.pdf',
    proof_of_income_type: 'GST-3B & Bank Statement (Quarterly)',
    proof_of_income_doc_url: 'https://docs.nexus.in/proofs/gst3b-solarsphere-q1.pdf',
    reported_monthly_revenue: 78000,
    verified_monthly_revenue: 72500,
    portfolio_url: 'https://solarsphere.in',
    upwork_profile_url: 'https://upwork.com/freelancers/~019882aef',
    freelance_platform_rating: 4.9,
    verification_status: 'verified',
    reviewer_notes: 'GST returns cross-verified with bank credit deposits. 3 commercial solar installations confirmed with client references.',
    created_at: '2026-01-10T14:30:00Z',
    references: [
      {
        id: 'ref-1',
        self_employment_id: 'se-1',
        client_name: 'Vikram Joshi',
        client_company: 'Sahyadri Agro Processing Ltd',
        client_email: 'vikram.j@sahyadriagro.com',
        client_phone: '+91 94220 18273',
        work_scope_description: 'Installation of 25kW rooftop solar PV array with hybrid inverter synchronization.',
        invoice_amount: 340000,
        is_verified: true,
        created_at: '2026-01-15T11:00:00Z'
      }
    ]
  },
  {
    id: 'se-2',
    trainee_id: 'tr-502',
    business_name: 'PixelCraft Digital Freelance Studio',
    business_type: 'Freelance Frontend Consultant',
    trade_license_number: 'KA-FREELANCE-9901',
    gst_udyam_tax_id: 'UDYAM-KR-03-009182',
    reported_monthly_revenue: 65000,
    verified_monthly_revenue: 61000,
    portfolio_url: 'https://github.com/freelance-coder',
    upwork_profile_url: 'https://upwork.com/freelancers/~pixelcraft',
    fiverr_profile_url: 'https://fiverr.com/pixelcraft_ui',
    freelance_platform_rating: 4.95,
    verification_status: 'verified',
    reviewer_notes: 'Top Rated Upwork badge verified via API webhook. Steady inflow across 8 global clients.',
    created_at: '2026-02-18T10:00:00Z'
  }
];

export const mockInterviewInsights: InterviewInsight[] = [
  {
    id: 'int-1',
    company_name: 'Tata Power Solar',
    role_title: 'Solar PV Project Technician',
    author_privacy_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    difficulty_rating: 3,
    interview_outcome: 'Offer Accepted',
    questions_asked: [
      'Explain the difference between MPPT and PWM charge controllers in grid systems.',
      'How do you calculate wire gauge sizing for DC voltage drop under 2%?',
      'What are the OSHA safety standards for rooftop harness rigging?'
    ],
    hiring_process_review: 'Round 1 was a practical test on wiring schemas. Round 2 was a situational interview with the site safety director. Very constructive and transparent timeline.',
    recommended_skills: ['Solar PV System Installation', 'Electrical Safety Standards'],
    is_anonymous: true,
    upvotes: 24,
    created_at: '2026-04-12T16:00:00Z'
  },
  {
    id: 'int-2',
    company_name: 'Infosys Digital',
    role_title: 'Full Stack Web Developer',
    author_privacy_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    difficulty_rating: 4,
    interview_outcome: 'Offer Accepted',
    questions_asked: [
      'How does React 19 Server Components affect bundle size vs Client Components?',
      'Write a PostgreSQL query with CTE to calculate month-over-month wage retention.',
      'Explain optimistic UI updates with Next.js Server Actions.'
    ],
    hiring_process_review: '2 live coding rounds + 1 system architecture discussion. Evaluators look for clean TypeScript types and relational database design understanding.',
    recommended_skills: ['Next.js & React 19', 'TypeScript & Type Safety', 'PostgreSQL & Database Design'],
    is_anonymous: true,
    upvotes: 41,
    created_at: '2026-05-02T11:20:00Z'
  },
  {
    id: 'int-3',
    company_name: 'Ola Electric',
    role_title: 'EV Powertrain & BMS Diagnostic Specialist',
    author_privacy_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    difficulty_rating: 4,
    interview_outcome: 'Offer Accepted',
    questions_asked: [
      'What voltage delta triggers passive cell balancing in a 72V pack?',
      'How do you decode CAN bus error frames with an oscilloscope?'
    ],
    hiring_process_review: 'Hands-on lab diagnostic test where they introduced an artificial BMS fault and asked me to isolate the failed cell sensor.',
    recommended_skills: ['EV Battery Management & Diagnostics', 'CAN Protocol'],
    is_anonymous: true,
    upvotes: 18,
    created_at: '2026-06-18T09:40:00Z'
  }
];

export const mockFollowups: AutomatedFollowup[] = [
  {
    id: 'fol-1',
    trainee_id: 'tr-101',
    checkpoint_milestone: 'M+3',
    channel: 'whatsapp',
    phone_number: '+91 98765 43210',
    scheduled_for: '2026-02-15T09:00:00Z',
    sent_at: '2026-02-15T09:02:11Z',
    status: 'responded',
    trigger_message_body: 'Namaste Arjun! This is Nexus Skilling Outcomes. Are you currently employed at Apex Digital? Reply with: 1) Still Working 2) Switched Job 3) Looking for Job.',
    response_received_at: '2026-02-15T09:14:32Z',
    raw_response_text: 'Still Working as Associate Full Stack Developer. Current salary 37000.',
    parsed_employment_status: 'permanent',
    parsed_current_wage: 37000,
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'fol-2',
    trainee_id: 'tr-101',
    checkpoint_milestone: 'M+6',
    channel: 'whatsapp',
    phone_number: '+91 98765 43210',
    scheduled_for: '2026-05-15T09:00:00Z',
    sent_at: '2026-05-15T09:01:05Z',
    status: 'responded',
    trigger_message_body: 'Nexus Check-in M+6: Please confirm your current monthly compensation and employment condition.',
    response_received_at: '2026-05-15T09:45:12Z',
    raw_response_text: 'Permanent role, promoted with revised monthly pay 42000 INR.',
    parsed_employment_status: 'permanent',
    parsed_current_wage: 42000,
    created_at: '2026-05-01T00:00:00Z'
  },
  {
    id: 'fol-3',
    trainee_id: 'tr-802',
    checkpoint_milestone: 'M+1',
    channel: 'whatsapp',
    phone_number: '+91 98112 33445',
    scheduled_for: '2026-03-01T09:00:00Z',
    sent_at: '2026-03-01T09:01:44Z',
    status: 'responded',
    trigger_message_body: 'Nexus Longitudinal Check-in: How is your role going at SmartLogistics?',
    response_received_at: '2026-03-01T10:15:20Z',
    raw_response_text: 'I was removed for no reason after 2 months. Need new job placement support.',
    parsed_employment_status: 'unemployed',
    parsed_attrition_reason: 'removed_no_reason',
    created_at: '2026-02-20T00:00:00Z'
  }
];

export const mockGeospatialStats = [
  { state: 'Maharashtra', trainees: 1420, placement_rate: 84.6, avg_wage: 38400, wage_gain_pct: 168.0, permanent_ratio: 76.2 },
  { state: 'Karnataka', trainees: 1180, placement_rate: 88.2, avg_wage: 44500, wage_gain_pct: 182.5, permanent_ratio: 81.0 },
  { state: 'Tamil Nadu', trainees: 950, placement_rate: 81.5, avg_wage: 34200, wage_gain_pct: 145.0, permanent_ratio: 74.8 },
  { state: 'Gujarat', trainees: 820, placement_rate: 79.4, avg_wage: 31800, wage_gain_pct: 138.0, permanent_ratio: 71.5 },
  { state: 'Telangana', trainees: 760, placement_rate: 86.0, avg_wage: 41200, wage_gain_pct: 174.0, permanent_ratio: 79.5 },
  { state: 'Uttar Pradesh', trainees: 1350, placement_rate: 72.8, avg_wage: 26500, wage_gain_pct: 122.0, permanent_ratio: 63.4 },
  { state: 'Rajasthan', trainees: 640, placement_rate: 75.1, avg_wage: 28900, wage_gain_pct: 130.5, permanent_ratio: 68.0 },
  { state: 'Madhya Pradesh', trainees: 590, placement_rate: 70.3, avg_wage: 25400, wage_gain_pct: 115.0, permanent_ratio: 62.1 },
];
