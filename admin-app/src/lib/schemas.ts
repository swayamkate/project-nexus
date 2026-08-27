import { z } from 'zod';

// ==========================================
// 1. TRAINEE PROFILE SCHEMA
// ==========================================
export const TraineeProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  aadhaar_masked: z.string().optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  district: z.string().min(2).max(100).default('Pune'),
  state: z.string().default('Maharashtra'),
  pincode: z.string().optional().or(z.literal('')),
  highest_education: z.string().max(100).optional().or(z.literal('')),
  board_university: z.string().max(150).optional().or(z.literal('')),
  year_of_passing: z.number().int().optional().nullable(),
  education_percentage: z.number().optional().nullable(),
  skills: z.array(z.string()).default([]),
  about_me: z.string().max(1000).optional().or(z.literal('')),
  avatar_url: z.string().url().optional().or(z.literal(''))
});

export type TraineeProfileInput = z.infer<typeof TraineeProfileSchema>;

// ==========================================
// 2. VERIFICATION REVIEW SCHEMA (ADMIN)
// ==========================================
export const VerificationReviewSchema = z.object({
  verification_id: z.string().uuid('Invalid verification UUID'),
  status: z.enum(['approved', 'rejected']),
  admin_notes: z.string().max(500).optional()
});

export type VerificationReviewInput = z.infer<typeof VerificationReviewSchema>;

// ==========================================
// 3. TRAINING PROGRAM SCHEMA (ADMIN)
// ==========================================
export const TrainingProgramSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  sector: z.string().min(2).max(100),
  duration_months: z.number().int().positive().max(36),
  provider_name: z.string().min(2).max(150),
  description: z.string().max(1000).optional().or(z.literal(''))
});

export type TrainingProgramInput = z.infer<typeof TrainingProgramSchema>;

// ==========================================
// 4. PROMO / SUBSIDY CODE SCHEMA (ADMIN)
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
// 5. CAPITAL GRANT DISBURSEMENT SCHEMA (ADMIN)
// ==========================================
export const DisburseGrantSchema = z.object({
  scheme_id: z.string().uuid('Invalid scheme UUID'),
  amount: z.number().positive('Disbursement amount must be greater than 0'),
  beneficiary_name: z.string().min(2).max(150)
});

export type DisburseGrantInput = z.infer<typeof DisburseGrantSchema>;

// ==========================================
// 6. CREATE SUB-ADMIN SCHEMA (ADMIN)
// ==========================================
export const CreateAdminSchema = z.object({
  email: z.string().email('Valid email is required'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'district_officer', 'evaluator', 'superadmin']).default('admin'),
  district: z.string().default('All Districts')
});

export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;
