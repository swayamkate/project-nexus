import { z } from 'zod';

// ==========================================
// 1. TRAINEE PROFILE SCHEMA
// ==========================================
export const TraineeProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, 'Invalid Indian mobile number (+91 or 10 digits)').optional().or(z.literal('')),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  aadhaar_masked: z.string().regex(/^X{4}-X{4}-\d{4}$/, 'Aadhaar must be cryptographically masked (XXXX-XXXX-1234)').optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  district: z.string().min(2).max(100).optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional().or(z.literal('')),
  highest_education: z.string().max(100).optional().or(z.literal('')),
  board_university: z.string().max(150).optional().or(z.literal('')),
  year_of_passing: z.number().int().min(1970).max(2035).optional().nullable(),
  education_percentage: z.number().min(0).max(100).optional().nullable(),
  skills: z.array(z.string().min(1).max(50)).optional(),
  about_me: z.string().max(1000).optional().or(z.literal('')),
  avatar_url: z.string().url().optional().or(z.literal(''))
});

export type TraineeProfileInput = z.infer<typeof TraineeProfileSchema>;

// ==========================================
// 2. SELF-EMPLOYMENT & MSME SCHEMA
// ==========================================
export const TraineeEmploymentSchema = z.object({
  status: z.enum(['employed', 'self_employed', 'apprenticeship', 'job_seeking', 'not_employed']),
  company_name: z.string().max(150).optional().or(z.literal('')),
  designation: z.string().max(100).optional().or(z.literal('')),
  monthly_salary: z.number().nonnegative().optional().nullable(),
  business_name: z.string().max(150).optional().or(z.literal('')),
  business_type: z.string().max(100).optional().or(z.literal('')),
  business_category: z.enum(['Micro', 'Small', 'Medium', 'Unregistered']).optional(),
  business_status: z.enum(['active', 'scaling', 'struggling', 'closed', 'transitioning']).optional(),
  establishment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  monthly_revenue: z.number().nonnegative().optional(),
  monthly_profit: z.number().nonnegative().optional(),
  monthly_income_range: z.string().max(50).optional(),
  employee_count: z.number().int().nonnegative().optional(),
  udyam_reg_number: z.string().regex(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/, 'Format must be UDYAM-MH-XX-XXXXXXX').optional().or(z.literal('')),
  gst_number: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid 15-digit GSTIN').optional().or(z.literal('')),
  bank_loan_availed: z.boolean().optional(),
  bank_loan_scheme: z.string().max(100).optional().or(z.literal('')),
  loan_amount: z.number().nonnegative().optional()
});

export type TraineeEmploymentInput = z.infer<typeof TraineeEmploymentSchema>;

// ==========================================
// 3. LONGITUDINAL SURVEY MILESTONE SCHEMA
// ==========================================
export const MilestoneSurveySchema = z.object({
  milestone: z.enum(['3M', '6M', '12M', '18M', '24M']),
  current_status: z.string().min(1).max(50),
  current_income_range: z.string().min(1).max(50),
  job_satisfaction_score: z.number().int().min(1).max(5).optional(),
  skill_utilization_score: z.number().int().min(1).max(5).optional(),
  remarks: z.string().max(500).optional().or(z.literal(''))
});

export type MilestoneSurveyInput = z.infer<typeof MilestoneSurveySchema>;

// ==========================================
// 4. DOCUMENT UPLOAD & VAULT SCHEMA
// ==========================================
export const DocumentUploadSchema = z.object({
  document_name: z.string().min(2).max(150),
  document_type: z.enum(['Identity Proof', 'Education Certificate', 'Skill Credential', 'Enterprise Document', 'Bank / Mudra Proof', 'Other']),
  file_url: z.string().min(1)
});

export type DocumentUploadInput = z.infer<typeof DocumentUploadSchema>;

// ==========================================
// 5. VERIFICATION REVIEW SCHEMA (ADMIN)
// ==========================================
export const VerificationReviewSchema = z.object({
  verification_id: z.string().uuid('Invalid verification UUID'),
  status: z.enum(['approved', 'rejected']),
  admin_notes: z.string().max(500).optional()
});

export type VerificationReviewInput = z.infer<typeof VerificationReviewSchema>;

// ==========================================
// 6. TRAINING PROGRAM SCHEMA (ADMIN)
// ==========================================
export const TrainingProgramSchema = z.object({
  title: z.string().min(3).max(150),
  sector: z.string().min(2).max(100),
  duration_months: z.number().int().positive().max(36),
  provider_name: z.string().min(2).max(150),
  description: z.string().max(1000).optional().or(z.literal(''))
});

export type TrainingProgramInput = z.infer<typeof TrainingProgramSchema>;

// ==========================================
// 7. PROMO / SUBSIDY CODE SCHEMA (ADMIN)
// ==========================================
export const PromoCodeSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9_-]+$/, 'Promo code must be alphanumeric uppercase'),
  discount_type: z.enum(['percentage', 'fixed_amount']).default('percentage'),
  discount_val: z.string().min(1).max(30),
  max_uses: z.number().int().positive().default(100),
  district: z.string().default('All Districts')
});

export type PromoCodeInput = z.infer<typeof PromoCodeSchema>;

// ==========================================
// 8. CAPITAL GRANT DISBURSEMENT SCHEMA (ADMIN)
// ==========================================
export const DisburseGrantSchema = z.object({
  scheme_id: z.string().uuid('Invalid scheme UUID'),
  amount: z.number().positive('Disbursement amount must be greater than 0'),
  beneficiary_name: z.string().min(2).max(150)
});

export type DisburseGrantInput = z.infer<typeof DisburseGrantSchema>;
