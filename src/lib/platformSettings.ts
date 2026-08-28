'use client';

import { createPublicClient } from '@/lib/supabaseBrowser';

/**
 * Public subset of the admin-configurable platform settings, mirrored from
 * admin-app/src/lib/platformSettings.ts. The main portal is a static export,
 * so values are fetched client-side with the anon key and fall back to these
 * defaults when the platform_settings table is missing (migration not yet
 * applied) or the request fails.
 */

export const PUBLIC_SETTING_KEYS = [
  'general.app_name',
  'general.tagline',
  'general.support_email',
  'branding.primary_color',
  'branding.accent_color',
  'branding.login_headline',
  'branding.theme_mode',
  'analytics.show_personal_wage_chart',
  'analytics.show_district_benchmarks',
  'analytics.show_skill_gaps',
  'analytics.wage_chart_title',
  'analytics.benchmark_title',
  'analytics.skill_gap_title',
  'branding.banner_enabled',
  'branding.banner_text',
  'localization.enabled_languages',
  'localization.default_language',
  'surveys.milestones_months',
  'features.employers_portal',
  'features.voice_surveys',
  'features.community_hub',
  'features.self_employment',
] as const;

export type PublicSettingKey = (typeof PUBLIC_SETTING_KEYS)[number];

export interface PublicPlatformSettings {
  'general.app_name': string;
  'general.tagline': string;
  'general.support_email': string;
  'branding.primary_color': string;
  'branding.accent_color': string;
  'branding.login_headline': string;
  'branding.theme_mode': 'system' | 'light' | 'dark';
  'analytics.show_personal_wage_chart': boolean;
  'analytics.show_district_benchmarks': boolean;
  'analytics.show_skill_gaps': boolean;
  'analytics.wage_chart_title': string;
  'analytics.benchmark_title': string;
  'analytics.skill_gap_title': string;
  'branding.banner_enabled': boolean;
  'branding.banner_text': string;
  'localization.enabled_languages': string[];
  'localization.default_language': string;
  'surveys.milestones_months': number[];
  'features.employers_portal': boolean;
  'features.voice_surveys': boolean;
  'features.community_hub': boolean;
  'features.self_employment': boolean;
}

export const DEFAULT_PUBLIC_SETTINGS: PublicPlatformSettings = {
  'general.app_name': 'Nexus',
  'general.tagline': 'Empowering Vocational Futures through Zero-PII Longitudinal Tracking',
  'general.support_email': 'support@nexus.gov.in',
  'branding.primary_color': '#2563eb',
  'branding.accent_color': '#0ea5e9',
  'branding.login_headline': 'Skilling Outcomes & Longitudinal Tracking',
  'branding.theme_mode': 'system',
  'analytics.show_personal_wage_chart': true,
  'analytics.show_district_benchmarks': true,
  'analytics.show_skill_gaps': true,
  'analytics.wage_chart_title': 'Longitudinal Wage Progression Trajectory',
  'analytics.benchmark_title': 'District Labor Deficit Matrix',
  'analytics.skill_gap_title': 'High-Demand Skill Shortages',
  'branding.banner_enabled': false,
  'branding.banner_text': '',
  'localization.enabled_languages': ['en', 'hi', 'mr'],
  'localization.default_language': 'en',
  'surveys.milestones_months': [3, 6, 12, 24],
  'features.employers_portal': true,
  'features.voice_surveys': false,
  'features.community_hub': true,
  'features.self_employment': true,
};

/**
 * Fetches stored settings overrides. Resolves with defaults merged on top
 * of any stored rows; never throws.
 */
export async function fetchPublicSettings(): Promise<PublicPlatformSettings> {
  const settings: PublicPlatformSettings = { ...DEFAULT_PUBLIC_SETTINGS };
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('platform_settings')
      .select('key, value')
      .in('key', PUBLIC_SETTING_KEYS as unknown as string[]);

    if (error || !data) return settings;

    for (const row of data) {
      if (Object.prototype.hasOwnProperty.call(settings, row.key)) {
        (settings as unknown as Record<string, unknown>)[row.key] = row.value;
      }
    }
  } catch {
    // Network or table-missing: defaults are already in place.
  }
  return settings;
}
