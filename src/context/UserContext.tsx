'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export interface TraineeProfile {
  id: string;
  user_id?: string;
  trainee_id: string;
  username?: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  aadhaar_masked: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  avatar_url?: string;
  profile_completion_pct: number;
  is_active: boolean;
  highest_education?: string;
  board_university?: string;
  year_of_passing?: number | null;
  education_percentage?: number | null;
  skills: string[];
  about_me?: string;
  privacy_hash?: string;
  created_at: string;
}

export interface TraineeEmployment {
  id?: string;
  trainee_id?: string;
  status: 'employed' | 'self_employed' | 'apprenticeship' | 'job_seeking' | 'not_employed';
  company_name?: string;
  designation?: string;
  joining_date?: string;
  monthly_salary?: number;
  business_name?: string;
  business_type?: string;
  business_category?: string;
  business_status?: 'active' | 'scaling' | 'struggling' | 'closed' | 'transitioning';
  establishment_date?: string;
  monthly_revenue?: number;
  monthly_profit?: number;
  monthly_income_range?: string;
  udyam_number?: string;
  gst_number?: string;
  business_address?: string;
  employees_count?: number;
  verified_by_admin?: boolean;
}

export interface TraineeFollowup {
  id: string;
  trainee_id: string;
  milestone: '3_months' | '6_months' | '12_months' | '18_months' | '24_months';
  due_date: string;
  completed_date?: string;
  status: 'scheduled' | 'completed' | 'upcoming' | 'overdue' | 'pending';
  current_status?: string;
  current_income_range?: string;
  job_satisfaction_score?: number;
  skill_utilization_score?: number;
  remarks?: string;
}

export interface TraineeEnrollment {
  id: string;
  trainee_id: string;
  program_id: string;
  enrolled_date: string;
  completed_date?: string;
  certified_date?: string;
  certificate_id?: string;
  status: string;
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
  language: 'en' | 'mr' | 'hi';
  setLanguage: (lang: 'en' | 'mr' | 'hi') => void;
  refreshData: () => Promise<void>;
  updateProfile: (data: Partial<TraineeProfile>) => Promise<boolean>;
  updateEmployment: (data: Partial<TraineeEmployment>) => Promise<boolean>;
  submitFollowup: (milestone: string, surveyData: any) => Promise<boolean>;
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
  const [language, setLanguage] = useState<'en' | 'mr' | 'hi'>('en');
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

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

      // If not yet in table, provision clean new record from auth metadata
      if (!traineeData) {
        const username = session.user.user_metadata?.username || userEmail?.split('@')[0];
        const fullName = session.user.user_metadata?.full_name || username?.replace(/[._]/g, ' ');
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        
        const { data: createdTrainee, error: createErr } = await supabase
          .from('trainees')
          .insert({
            user_id: session.user.id,
            email: userEmail,
            username: username,
            full_name: fullName,
            trainee_id: `TRN-${randomDigits}`,
            phone: '',
            dob: '2000-01-01',
            gender: 'Prefer not to say',
            aadhaar_masked: '',
            address: '',
            district: 'Maharashtra',
            state: 'Maharashtra',
            pincode: '',
            skills: [],
            about_me: '',
            is_active: true,
            profile_completion_pct: 30
          })
          .select()
          .single();

        if (!createErr && createdTrainee) {
          traineeData = createdTrainee;
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

        // 5. Fetch Real Notifications for Trainee or Global
        const { data: notifData } = await supabase
          .from('trainee_notifications')
          .select('*')
          .or(`trainee_id.eq.${traineeData.id},trainee_id.is.null`)
          .order('created_at', { ascending: false });

        setNotifications(notifData || []);

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
    loadUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserData();
      } else {
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
      const { error } = await supabase
        .from('trainees')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const updateEmployment = async (data: Partial<TraineeEmployment>): Promise<boolean> => {
    if (!profile) return false;
    try {
      if (employment?.id) {
        const { error } = await supabase
          .from('trainee_employment')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', employment.id);

        if (error) throw error;
        setEmployment((prev) => (prev ? { ...prev, ...data } : null));
      } else {
        const { data: newEmp, error } = await supabase
          .from('trainee_employment')
          .insert({
            trainee_id: profile.id,
            status: data.status || 'self_employed',
            business_name: data.business_name || '',
            business_type: data.business_type || '',
            business_category: data.business_category || 'Micro Enterprise',
            business_status: data.business_status || 'active',
            monthly_revenue: data.monthly_revenue || 0,
            monthly_profit: data.monthly_profit || 0,
            udyam_number: data.udyam_number || '',
            gst_number: data.gst_number || '',
            business_address: data.business_address || '',
            employees_count: data.employees_count || 1,
            verified_by_admin: false,
          })
          .select()
          .single();

        if (error) throw error;
        if (newEmp) setEmployment(newEmp);
      }
      return true;
    } catch (err) {
      console.error('Error updating employment details:', err);
      return false;
    }
  };

  const submitFollowup = async (milestone: string, surveyData: any): Promise<boolean> => {
    if (!profile) return false;
    try {
      const existing = followups.find((f) => f.milestone === milestone);
      if (existing) {
        const { error } = await supabase
          .from('trainee_followups')
          .update({
            status: 'completed',
            completed_date: new Date().toISOString().split('T')[0],
            current_status: surveyData.current_status || 'self_employed',
            current_income_range: surveyData.current_income_range || '',
            job_satisfaction_score: surveyData.job_satisfaction_score || 5,
            skill_utilization_score: surveyData.skill_utilization_score || 5,
            remarks: surveyData.remarks || '',
            survey_data_json: surveyData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('trainee_followups')
          .insert({
            trainee_id: profile.id,
            milestone: milestone as any,
            due_date: new Date().toISOString().split('T')[0],
            completed_date: new Date().toISOString().split('T')[0],
            status: 'completed',
            current_status: surveyData.current_status || 'self_employed',
            current_income_range: surveyData.current_income_range || '',
            job_satisfaction_score: surveyData.job_satisfaction_score || 5,
            skill_utilization_score: surveyData.skill_utilization_score || 5,
            remarks: surveyData.remarks || '',
            survey_data_json: surveyData,
          });

        if (error) throw error;
      }
      await loadUserData();
      return true;
    } catch (err) {
      console.error('Error submitting followup survey:', err);
      return false;
    }
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
        refreshData: loadUserData,
        updateProfile,
        updateEmployment,
        submitFollowup,
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
