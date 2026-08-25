export type UserRole = 'trainee' | 'employer' | 'evaluator' | 'admin';
export type EmploymentType = 'permanent' | 'temporary' | 'contract' | 'self_employed' | 'unemployed' | 'internship';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'flagged';
export type AttritionReason = 
  | 'voluntary_upskilling'
  | 'layoff'
  | 'contract_expired'
  | 'removed_no_reason'
  | 'compensation'
  | 'work_environment'
  | 'health_personal'
  | 'relocation'
  | 'business_failure'
  | 'other';

export type FollowupChannel = 'whatsapp' | 'sms' | 'email' | 'in_app';
export type FollowupStatus = 'scheduled' | 'sent' | 'delivered' | 'responded' | 'failed' | 'expired';

export interface Profile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  privacy_hash: string;
  state: string;
  district: string;
  pincode?: string;
  gender?: string;
  education_level?: string;
  baseline_income: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: 'technical' | 'soft_skill' | 'domain_knowledge' | 'tool_proficiency' | 'certification';
  description?: string;
  difficulty_level: number;
  market_demand_index: number;
  created_at: string;
}

export interface RoleCatalog {
  id: string;
  title: string;
  industry: string;
  average_starting_salary: number;
  growth_rate_pct: number;
  typical_learning_hours: number;
  description?: string;
  created_at: string;
  skills?: {
    skill: Skill;
    required_proficiency: number;
    is_mandatory: boolean;
  }[];
}

export interface TraineeSkill {
  id: string;
  trainee_id: string;
  skill_id: string;
  proficiency_level: number;
  is_verified: boolean;
  verified_at?: string;
  badge_certificate_url?: string;
  skill?: Skill;
}

export interface TraineeTarget {
  id: string;
  trainee_id: string;
  target_role_id: string;
  target_company_name?: string;
  daily_study_hours: number;
  skill_gap_percentage: number;
  estimated_days_to_goal: number;
  status: string;
  created_at: string;
  role?: RoleCatalog;
}

export interface Course {
  id: string;
  title: string;
  provider_name: string;
  duration_hours: number;
  skills_covered: { skill_name: string; proficiency_gain: number }[];
  badge_hash?: string;
  course_url?: string;
  verification_standard?: string;
}

export interface EmploymentRecord {
  id: string;
  trainee_id: string;
  company_name: string;
  job_title: string;
  employment_type: EmploymentType;
  is_current: boolean;
  start_date: string;
  end_date?: string;
  starting_monthly_wage: number;
  current_monthly_wage: number;
  currency: string;
  state?: string;
  district?: string;
  verification_status: VerificationStatus;
  offer_letter_url?: string;
  created_at: string;
}

export interface WageProgressionLog {
  id: string;
  employment_record_id: string;
  trainee_id: string;
  recorded_at: string;
  monthly_wage: number;
  wage_increment_pct: number;
  verified: boolean;
  proof_doc_url?: string;
}

export interface AttritionLog {
  id: string;
  employment_record_id: string;
  trainee_id: string;
  exit_date: string;
  tenure_days: number;
  primary_reason: AttritionReason;
  specific_explanation?: string;
  was_severance_paid: boolean;
  next_expected_step?: string;
  created_at: string;
}

export interface SelfEmploymentValidation {
  id: string;
  trainee_id: string;
  business_name: string;
  business_type: string;
  trade_license_number?: string;
  gst_udyam_tax_id?: string;
  business_identity_doc_url?: string;
  proof_of_income_type?: string;
  proof_of_income_doc_url?: string;
  reported_monthly_revenue: number;
  verified_monthly_revenue?: number;
  portfolio_url?: string;
  upwork_profile_url?: string;
  fiverr_profile_url?: string;
  freelance_platform_rating?: number;
  verification_status: VerificationStatus;
  reviewer_notes?: string;
  created_at: string;
  references?: ClientReference[];
}

export interface ClientReference {
  id: string;
  self_employment_id: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  client_phone?: string;
  work_scope_description?: string;
  invoice_amount?: number;
  reference_letter_url?: string;
  is_verified: boolean;
  created_at: string;
}

export interface InterviewInsight {
  id: string;
  company_name: string;
  role_title: string;
  author_privacy_hash: string;
  difficulty_rating: number;
  interview_outcome: string;
  questions_asked: string[];
  hiring_process_review: string;
  recommended_skills: string[];
  is_anonymous: boolean;
  upvotes: number;
  created_at: string;
}

export interface AutomatedFollowup {
  id: string;
  trainee_id: string;
  checkpoint_milestone: 'M+1' | 'M+3' | 'M+6' | 'M+12';
  channel: FollowupChannel;
  phone_number: string;
  scheduled_for: string;
  sent_at?: string;
  status: FollowupStatus;
  trigger_message_body: string;
  response_received_at?: string;
  raw_response_text?: string;
  parsed_employment_status?: EmploymentType;
  parsed_current_wage?: number;
  parsed_attrition_reason?: AttritionReason;
  created_at: string;
}
