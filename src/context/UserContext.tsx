'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { Language, getTranslation } from '@/lib/i18n';
import { fetchPublicSettings } from '@/lib/platformSettings';
import { mutateDb } from '@/lib/traineeApi';

export interface TraineeProfile {
  id: string;
  user_id?: string;
  trainee_id: string;
  username?: string;
  full_name: string;
  email: string;
  phone?: string;
  alt_phone?: string;
  guardian_phone?: string;
  apaar_id?: string;
  digilocker_id?: string;
  naps_apprentice_id?: string;
  consent_data_sharing?: boolean;
  consent_longitudinal_tracking?: boolean;
  consent_epfo_verification?: boolean;
  migration_status?: string;
  current_residence_district?: string;
  dob?: string;
  gender?: string;
  aadhaar_masked?: string;
  address?: string;
  district?: string;
  state?: string;
  pincode?: string;
  avatar_url?: string;
  profile_completion_pct?: number;
  is_active?: boolean;
  highest_education?: string;
  board_university?: string;
  year_of_passing?: number | null;
  education_percentage?: number | null;
  skills?: string[];
  about_me?: string;
  privacy_hash?: string;
  is_verified?: boolean;
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TraineeEmployment {
  id: string;
  trainee_id: string;
  status: 'wage_employed' | 'self_employed' | 'unemployed' | 'higher_studies' | 'employed' | 'not_employed' | 'apprenticeship' | string;
  
  // Wage Employment Attributes
  company_name?: string;
  designation?: string;
  joining_date?: string;
  monthly_salary?: number;
  offer_letter_url?: string;
  work_location?: string;
  training_relevance?: string;
  contract_type?: string;
  employer_gstin?: string;
  is_employer_verified?: boolean;
  pf_esic_number?: string;
  appreciation_details?: string;
  monthly_income_range?: string;
  
  // Self-Employment Attributes
  business_name?: string;
  business_type?: string;
  business_category?: string;
  business_status?: string;
  establishment_date?: string;
  monthly_revenue?: number;
  monthly_profit?: number;
  udyam_number?: string;
  gst_number?: string;
  business_address?: string;
  employees_count?: number;
  employee_count?: number;
  udyam_reg_number?: string;
  
  // Unemployed Reason Attributes
  unemployed_reason?: string;
  unemployed_perspective?: string;
  target_workforce_timeline?: string;
  support_needed?: string;
  
  verified_by_admin?: boolean;
  verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TraineeEnrollment {
  id: string;
  trainee_id: string;
  program_id: string;
  enrolled_date: string;
  completed_date?: string;
  certified_date?: string;
  certificate_id?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'certified' | 'dropped';
  grade?: string;
  training_programs?: {
    id: string;
    title: string;
    sector: string;
    duration_months: number;
    provider_name: string;
    description?: string;
  };
}

export interface TraineeFollowup {
  id: string;
  trainee_id: string;
  milestone: '3_months' | '6_months' | '12_months' | '18_months' | '24_months';
  due_date: string;
  completed_date?: string;
  status: string;
  current_status?: string;
  current_income_range?: string;
  job_satisfaction_score?: number;
  skill_utilization_score?: number;
  remarks?: string;
  survey_data_json?: any;
}

export interface RecommendedOpportunity {
  id: string;
  title: string;
  category: string;
  provider: string;
  link_url?: string;
  description?: string;
  target_skills?: string[];
  is_active: boolean;
}

interface UserContextType {
  user: any | null;
  profile: TraineeProfile | null;
  employment: TraineeEmployment | null;
  enrollments: TraineeEnrollment[];
  followups: TraineeFollowup[];
  notifications: any[];
  opportunities: RecommendedOpportunity[];
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateProfile: (data: Partial<TraineeProfile>) => Promise<boolean>;
  updateEmployment: (data: Partial<TraineeEmployment>) => Promise<boolean>;
  submitFollowup: (milestone: string, surveyData: any) => Promise<boolean>;
  mutateDb: typeof mutateDb;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<TraineeProfile | null>(null);
  const [employment, setEmployment] = useState<TraineeEmployment | null>(null);
  const [enrollments, setEnrollments] = useState<TraineeEnrollment[]>([]);
  const [followups, setFollowups] = useState<TraineeFollowup[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<RecommendedOpportunity[]>([]);
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const loadLanguage = async () => {
      const savedLang = typeof window !== 'undefined'
        ? localStorage.getItem('nexus_language') as Language | null
        : null;
      if (savedLang && ['en', 'mr', 'hi'].includes(savedLang)) {
        if (active) setLanguageState(savedLang);
        return;
      }
      const settings = await fetchPublicSettings();
      const defaultLang = settings['localization.default_language'] || 'en';
      if (active && ['en', 'mr', 'hi'].includes(defaultLang)) {
        setLanguageState(defaultLang as Language);
      }
    };
    loadLanguage();
    return () => { active = false; };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_language', lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const loadUserData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        setUser(null);
        setProfile(null);
        setEmployment(null);
        setEnrollments([]);
        setFollowups([]);
        setNotifications([]);
        setOpportunities([]);
        setLoading(false);
        return;
      }

      setUser(session.user);
      const userEmail = session.user.email || '';

      // 1. Fetch Real Trainee Profile
      let { data: traineeData } = await supabase
        .from('trainees')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      // If not yet in table, provision clean new record from auth metadata via mutateDb
      if (!traineeData) {
        const username = session.user.user_metadata?.username || userEmail?.split('@')[0];
        const fullName = session.user.user_metadata?.full_name || username?.replace(/[._]/g, ' ');
        const { data: createdTrainee, error: createErr } = await mutateDb({
          action: 'insert',
          table: 'trainees',
          payload: {
            user_id: session.user.id,
            email: userEmail,
            username: username,
            full_name: fullName,
            phone: session.user.user_metadata?.phone || '',
            dob: session.user.user_metadata?.dob || null,
            gender: session.user.user_metadata?.gender || null,
            aadhaar_masked: '',
            address: '',
            district: session.user.user_metadata?.district || null,
            state: session.user.user_metadata?.state || null,
            pincode: '',
            skills: [],
            about_me: '',
            is_active: true,
            profile_completion_pct: 35
          }
        });

        if (!createErr && createdTrainee && createdTrainee[0]) {
          traineeData = createdTrainee[0];
        }
      }

      if (traineeData) {
        setProfile(traineeData);

        // 2. Fetch Real Employment Record
        const { data: empData } = await supabase
          .from('trainee_employment')
          .select('*')
          .eq('trainee_id', traineeData.id)
          .maybeSingle();

        setEmployment(empData || null);

        // 3. Fetch Real Enrollments & Programs
        const { data: enrData } = await supabase
          .from('trainee_enrollments')
          .select('*, training_programs(*)')
          .eq('trainee_id', traineeData.id);

        setEnrollments(enrData || []);

        // 4. Fetch Real Followups
        const { data: folData } = await supabase
          .from('trainee_followups')
          .select('*')
          .eq('trainee_id', traineeData.id)
          .order('due_date', { ascending: true });

        setFollowups(folData || []);

        // 5. Fetch Real Notifications for Trainee or Global (Filtering out expired notifications)
        const { data: notifData } = await supabase
          .from('trainee_notifications')
          .select('*')
          .or(`trainee_id.eq.${traineeData.id},trainee_id.is.null`)
          .order('created_at', { ascending: false });

        const activeNotifs = (notifData || []).filter((n: any) => {
          if (!n.expires_at) return true;
          return new Date(n.expires_at).getTime() > Date.now();
        });

        setNotifications(activeNotifs);

        // 6. Fetch Real Recommended Opportunities
        const { data: oppData } = await supabase
          .from('recommended_opportunities')
          .select('*')
          .eq('is_active', true)
          .limit(6);

        setOpportunities(oppData || []);
      }
    } catch (err) {
      console.error('Error loading user profile context:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let lastUserId: string | null = null;

    loadUserData().then(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        lastUserId = session?.user?.id || null;
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || session.user.id !== lastUserId) {
          lastUserId = session.user.id;
          loadUserData();
        }
      } else {
        lastUserId = null;
        setUser(null);
        setProfile(null);
        setEmployment(null);
        setEnrollments([]);
        setFollowups([]);
        setNotifications([]);
        setOpportunities([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData, supabase]);

  const updateProfile = async (data: Partial<TraineeProfile>): Promise<boolean> => {
    if (!profile) return false;
    try {
      if (data.username) {
        data.username = data.username.toLowerCase().trim().replace(/[^a-z0-9_.]/g, '');
        if (data.username !== profile.username) {
          const { data: existing } = await supabase
            .from('trainees')
            .select('id')
            .eq('username', data.username)
            .neq('id', profile.id)
            .maybeSingle();
          if (existing) {
            alert('This username is already claimed by another trainee. Please choose a unique username.');
            return false;
          }
        }
      }

      // Calculate real completion percentage based on filled profile attributes
      const merged = { ...profile, ...data };
      let filledCount = 0;
      const keyFields = ['full_name', 'email', 'phone', 'dob', 'gender', 'address', 'district', 'highest_education', 'board_university', 'about_me'];
      keyFields.forEach(f => { if ((merged as any)[f]) filledCount++; });
      if (merged.skills && merged.skills.length > 0) filledCount += 2;
      const completionPct = Math.min(100, Math.max(35, Math.round((filledCount / (keyFields.length + 2)) * 100)));
      data.profile_completion_pct = completionPct;

      const { error } = await mutateDb({
        action: 'update',
        table: 'trainees',
        payload: {
          ...data,
          updated_at: new Date().toISOString(),
        },
        match: { id: profile.id }
      });

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      return false;
    }
  };

  const updateEmployment = async (data: Partial<TraineeEmployment>): Promise<boolean> => {
    if (!profile) return false;
    try {
      // 1. Sanitize payload fields for Postgres compatibility
      const sanitizedPayload: Record<string, any> = {
        trainee_id: profile.id,
        status: data.status || 'not_employed',
        updated_at: new Date().toISOString(),
      };

      if (employment?.id || data.id) {
        sanitizedPayload.id = data.id || employment?.id;
      }

      // Wage employment fields
      if (data.company_name !== undefined) sanitizedPayload.company_name = data.company_name?.trim() || null;
      if (data.designation !== undefined) sanitizedPayload.designation = data.designation?.trim() || null;
      if (data.joining_date !== undefined) sanitizedPayload.joining_date = data.joining_date?.trim() ? data.joining_date.trim() : null;
      if (data.monthly_salary !== undefined) sanitizedPayload.monthly_salary = isNaN(Number(data.monthly_salary)) ? 0 : Number(data.monthly_salary);
      if (data.work_location !== undefined) sanitizedPayload.work_location = data.work_location?.trim() || null;
      if (data.pf_esic_number !== undefined) sanitizedPayload.pf_esic_number = data.pf_esic_number?.trim() || null;
      if (data.training_relevance !== undefined) sanitizedPayload.training_relevance = data.training_relevance || 'direct_match';
      if (data.contract_type !== undefined) sanitizedPayload.contract_type = data.contract_type || 'permanent';
      if (data.offer_letter_url !== undefined) sanitizedPayload.offer_letter_url = data.offer_letter_url?.trim() || null;
      if (data.employer_gstin !== undefined) sanitizedPayload.employer_gstin = data.employer_gstin?.trim() || null;

      // Self employment fields
      if (data.business_name !== undefined) sanitizedPayload.business_name = data.business_name?.trim() || null;
      if (data.business_type !== undefined) sanitizedPayload.business_type = data.business_type?.trim() || null;
      if (data.business_category !== undefined) sanitizedPayload.business_category = data.business_category || 'Services';
      if (data.business_status !== undefined) sanitizedPayload.business_status = data.business_status || 'active';
      if (data.establishment_date !== undefined) sanitizedPayload.establishment_date = data.establishment_date?.trim() ? data.establishment_date.trim() : null;
      if (data.monthly_revenue !== undefined) sanitizedPayload.monthly_revenue = isNaN(Number(data.monthly_revenue)) ? 0 : Number(data.monthly_revenue);
      if (data.monthly_profit !== undefined) sanitizedPayload.monthly_profit = isNaN(Number(data.monthly_profit)) ? 0 : Number(data.monthly_profit);
      if (data.monthly_income_range !== undefined) sanitizedPayload.monthly_income_range = data.monthly_income_range?.trim() || null;
      if (data.udyam_number !== undefined) sanitizedPayload.udyam_number = data.udyam_number?.trim() || null;
      if (data.udyam_reg_number !== undefined) sanitizedPayload.udyam_reg_number = data.udyam_reg_number?.trim() || null;
      if (data.gst_number !== undefined) sanitizedPayload.gst_number = data.gst_number?.trim() || null;
      if (data.employees_count !== undefined) sanitizedPayload.employees_count = isNaN(Number(data.employees_count)) ? 0 : Number(data.employees_count);
      if (data.employee_count !== undefined) sanitizedPayload.employee_count = isNaN(Number(data.employee_count)) ? 0 : Number(data.employee_count);
      if (data.business_address !== undefined) sanitizedPayload.business_address = data.business_address?.trim() || null;

      // Unemployed / Seeking fields
      if (data.unemployed_reason !== undefined) sanitizedPayload.unemployed_reason = data.unemployed_reason || null;
      if (data.unemployed_perspective !== undefined) sanitizedPayload.unemployed_perspective = data.unemployed_perspective?.trim() || null;
      if (data.target_workforce_timeline !== undefined) sanitizedPayload.target_workforce_timeline = data.target_workforce_timeline || null;
      if (data.support_needed !== undefined) sanitizedPayload.support_needed = data.support_needed || null;
      if (data.appreciation_details !== undefined) sanitizedPayload.appreciation_details = data.appreciation_details?.trim() || null;

      // 2. Perform safe, resilient update or insert
      let resultData: any = null;
      let error: any = null;

      if (employment?.id || data.id) {
        const updateRes = await mutateDb({
          action: 'update',
          table: 'trainee_employment',
          payload: sanitizedPayload,
          match: { id: data.id || employment?.id }
        });
        resultData = updateRes.data;
        error = updateRes.error;
      } else {
        // Query if an existing row exists for this trainee
        const { data: existing } = await supabase
          .from('trainee_employment')
          .select('id')
          .eq('trainee_id', profile.id)
          .maybeSingle();

        if (existing?.id) {
          const updateRes = await mutateDb({
            action: 'update',
            table: 'trainee_employment',
            payload: sanitizedPayload,
            match: { id: existing.id }
          });
          resultData = updateRes.data;
          error = updateRes.error;
        } else {
          const insertRes = await mutateDb({
            action: 'insert',
            table: 'trainee_employment',
            payload: sanitizedPayload
          });
          resultData = insertRes.data;
          error = insertRes.error;
        }
      }

      if (error) throw error;

      // 3. Reliably update React context state with saved or merged record
      const savedRecord = (resultData && resultData[0]) ? resultData[0] : { ...(employment || {}), ...sanitizedPayload };
      setEmployment(savedRecord as TraineeEmployment);
      return true;
    } catch (err) {
      console.error('Failed to update employment details:', err);
      return false;
    }
  };

  const submitFollowup = async (milestone: string, surveyData: any): Promise<boolean> => {
    if (!profile) return false;
    try {
      const existing = followups.find(f => f.milestone === milestone);
      const payload = {
        trainee_id: profile.id,
        milestone,
        status: 'completed',
        completed_date: new Date().toISOString().split('T')[0],
        current_status: surveyData.current_status || surveyData.status || 'Active',
        current_income_range: surveyData.current_income_range || surveyData.income_range || '₹0 (Unemployed / In Training)',
        job_satisfaction_score: Number(surveyData.job_satisfaction_score ?? surveyData.satisfaction ?? 5),
        additional_support_needed: surveyData.remarks || surveyData.additional_support_needed || '',
        survey_data_json: surveyData,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await mutateDb({
          action: 'update',
          table: 'trainee_followups',
          payload,
          match: { id: existing.id }
        });
        if (error) throw error;
      } else {
        const { error } = await mutateDb({
          action: 'insert',
          table: 'trainee_followups',
          payload
        });
        if (error) throw error;
      }

      await loadUserData();
      return true;
    } catch (err) {
      console.error('Failed to submit followup milestone:', err);
      return false;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await mutateDb({
        action: 'update',
        table: 'trainee_notifications',
        payload: { is_read: true },
        match: { id }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!profile) return;
    try {
      await mutateDb({
        action: 'update',
        table: 'trainee_notifications',
        payload: { is_read: true },
        match: { trainee_id: profile.id }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const refreshData = async () => {
    await loadUserData();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setEmployment(null);
    setEnrollments([]);
    setFollowups([]);
    setNotifications([]);
    setOpportunities([]);
    router.push('/login');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        employment,
        enrollments,
        followups,
        notifications,
        opportunities,
        loading,
        language,
        setLanguage,
        t,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshData,
        updateProfile,
        updateEmployment,
        submitFollowup,
        mutateDb,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
