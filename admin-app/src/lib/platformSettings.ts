import { z } from 'zod';

/**
 * Central registry of every admin-customizable platform setting.
 * Keys map 1:1 to rows in public.platform_settings (see
 * src/db/migrations/006_platform_settings.sql). The admin Settings page,
 * the /api/settings route, and both frontends all read from this file so
 * defaults never drift between apps.
 */

export const SETTING_TYPES = {
  'general.app_name': z.string().min(1).max(80),
  'general.tagline': z.string().max(200),
  'general.support_email': z.string().email(),

  'branding.primary_color': z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #2563eb'),
  'branding.accent_color': z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #0ea5e9'),
  'branding.login_headline': z.string().max(120),
  'branding.banner_enabled': z.boolean(),
  'branding.banner_text': z.string().max(300),

  'localization.enabled_languages': z.array(z.enum(['en', 'hi', 'mr'])).min(1),
  'localization.default_language': z.enum(['en', 'hi', 'mr']),

  'surveys.milestones_months': z.array(z.number().int().min(1).max(60)).min(1).max(10),
  'surveys.reminder_days_before': z.number().int().min(0).max(60),
  'surveys.escalation_days_after': z.number().int().min(1).max(90),
  'surveys.enable_whatsapp': z.boolean(),
  'surveys.enable_sms': z.boolean(),
  'surveys.sms_template': z.string().min(1).max(480),

  'security.session_timeout_minutes': z.number().int().min(15).max(10080),
  'security.require_2fa_superadmins': z.boolean(),
  'security.password_min_length': z.number().int().min(6).max(64),
  'security.max_login_attempts': z.number().int().min(3).max(20),

  'features.employers_portal': z.boolean(),
  'features.voice_surveys': z.boolean(),
  'features.community_hub': z.boolean(),
  'features.self_employment': z.boolean(),
} as const;

export type SettingKey = keyof typeof SETTING_TYPES;
export type SettingsMap = { [K in SettingKey]: z.infer<(typeof SETTING_TYPES)[K]> };

export const DEFAULT_SETTINGS: SettingsMap = {
  'general.app_name': 'Nexus',
  'general.tagline': 'Empowering Vocational Futures through Zero-PII Longitudinal Tracking',
  'general.support_email': 'support@nexus.gov.in',

  'branding.primary_color': '#2563eb',
  'branding.accent_color': '#0ea5e9',
  'branding.login_headline': 'Skilling Outcomes & Longitudinal Tracking',
  'branding.banner_enabled': false,
  'branding.banner_text': '',

  'localization.enabled_languages': ['en', 'hi', 'mr'],
  'localization.default_language': 'en',

  'surveys.milestones_months': [3, 6, 12, 24],
  'surveys.reminder_days_before': 7,
  'surveys.escalation_days_after': 14,
  'surveys.enable_whatsapp': true,
  'surveys.enable_sms': true,
  'surveys.sms_template': 'Nexus: Your vocational follow-up check-in is due. Submit at {portal}',

  'security.session_timeout_minutes': 1440,
  'security.require_2fa_superadmins': true,
  'security.password_min_length': 8,
  'security.max_login_attempts': 5,

  'features.employers_portal': true,
  'features.voice_surveys': false,
  'features.community_hub': true,
  'features.self_employment': true,
};

export function categoryOf(key: SettingKey): string {
  return key.split('.')[0];
}

/** Validate a partial patch from the client. Returns only known, valid keys. */
export function validateSettingsPatch(
  patch: Record<string, unknown>
): { valid: Partial<SettingsMap>; errors: string[] } {
  const valid: Partial<SettingsMap> = {};
  const errors: string[] = [];

  for (const [key, value] of Object.entries(patch)) {
    const schema = (SETTING_TYPES as Record<string, z.ZodType | undefined>)[key];
    if (!schema) {
      errors.push(`Unknown setting key: ${key}`);
      continue;
    }
    const result = schema.safeParse(value);
    if (!result.success) {
      errors.push(`${key}: ${result.error.issues[0]?.message ?? 'invalid value'}`);
      continue;
    }
    (valid as Record<string, unknown>)[key] = result.data;
  }

  return { valid, errors };
}

/**
 * Keys that are safe to expose to the public (anon) trainee portal.
 * Security internals and survey dispatch config stay admin-only.
 */
export const PUBLIC_SETTING_KEYS: SettingKey[] = [
  'general.app_name',
  'general.tagline',
  'general.support_email',
  'branding.primary_color',
  'branding.accent_color',
  'branding.login_headline',
  'branding.banner_enabled',
  'branding.banner_text',
  'localization.enabled_languages',
  'localization.default_language',
  'surveys.milestones_months',
  'features.employers_portal',
  'features.voice_surveys',
  'features.community_hub',
  'features.self_employment',
];
