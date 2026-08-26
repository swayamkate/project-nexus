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
  highest_education: string;
  board_university: string;
  year_of_passing: number;
  education_percentage: number;
  skills: string[];
  about_me: string;
  privacy_hash: string;
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
    title: string;
    sector: string;
    duration_months: number;
    provider_name: string;
  };
}

interface UserContextType {
  user: any | null;
  profile: TraineeProfile | null;
  employment: TraineeEmployment | null;
  enrollments: TraineeEnrollment[];
  followups: TraineeFollowup[];
  notifications: any[];
  loading: boolean;
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
        setLoading(false);
        return;
      }

      setUser(session.user);
      const userEmail = session.user.email;

      // 1. Fetch Trainee Profile
      let { data: traineeData } = await supabase
        .from('trainees')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      // If not yet in table, auto-provision
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
            is_active: true,
            profile_completion_pct: 35
          })
          .select()
          .single();

        if (!createErr && createdTrainee) {
          traineeData = createdTrainee;
        }
      }

      if (traineeData) {
        setProfile(traineeData);

        // 2. Fetch Employment Record
        const { data: empData } = await supabase
          .from('trainee_employment')
          .select('*')
          .eq('trainee_id', traineeData.id)
          .maybeSingle();
        if (empData) setEmployment(empData);

        // 3. Fetch Enrollments & Programs
        const { data: enrData } = await supabase
          .from('trainee_enrollments')
          .select('*, training_programs(*)')
          .eq('trainee_id', traineeData.id);
        if (enrData) setEnrollments(enrData as any);

        // 4. Fetch Followups
        const { data: folData } = await supabase
          .from('trainee_followups')
          .select('*')
          .eq('trainee_id', traineeData.id)
          .order('due_date', { ascending: true });
        if (folData) setFollowups(folData as any);

        // 5. Fetch Notifications
        const { data: notifData } = await supabase
          .from('trainee_notifications')
          .select('*')
          .eq('trainee_id', traineeData.id)
          .order('created_at', { ascending: false });
        if (notifData) setNotifications(notifData);
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
      // Recalculate profile completion percentage dynamically
      let filledFields = 0;
      const keyFields = ['full_name', 'phone', 'dob', 'gender', 'district', 'highest_education', 'skills', 'about_me'];
      const merged = { ...profile, ...data };
      keyFields.forEach(f => {
        if (f === 'skills' && Array.isArray(merged.skills) && merged.skills.length > 0) filledFields++;
        else if ((merged as any)[f]) filledFields++;
      });
      const pct = Math.min(100, Math.round((filledFields / keyFields.length) * 100));

      const { data: updated, error } = await supabase
        .from('trainees')
        .update({ ...data, profile_completion_pct: pct, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      if (updated) {
        setProfile(updated);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      alert('Failed to save profile: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const updateEmployment = async (data: Partial<TraineeEmployment>): Promise<boolean> => {
    if (!profile) return false;
    try {
      if (employment?.id) {
        const { data: updated, error } = await supabase
          .from('trainee_employment')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', employment.id)
          .select()
          .single();
        if (error) throw error;
        if (updated) setEmployment(updated);
      } else {
        const { data: created, error } = await supabase
          .from('trainee_employment')
          .insert({
            trainee_id: profile.id,
            status: data.status || 'self_employed',
            ...data
          })
          .select()
          .single();
        if (error) throw error;
        if (created) setEmployment(created);
      }
      return true;
    } catch (err: any) {
      console.error('Failed to update employment details:', err);
      alert('Failed to save business details: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const submitFollowup = async (milestone: string, surveyData: any): Promise<boolean> => {
    if (!profile) return false;
    try {
      const { error } = await supabase
        .from('trainee_followups')
        .insert({
          trainee_id: profile.id,
          milestone: milestone as any,
          due_date: new Date().toISOString().split('T')[0],
          completed_date: new Date().toISOString().split('T')[0],
          status: 'completed',
          current_status: surveyData.current_status || 'self_employed',
          current_income_range: surveyData.current_income_range || '₹15,000 - ₹25,000',
          job_satisfaction_score: surveyData.job_satisfaction_score || 5,
          skill_utilization_score: surveyData.skill_utilization_score || 5,
          additional_support_needed: surveyData.additional_support_needed || '',
          survey_channel: 'web_portal',
          survey_data_json: surveyData
        });

      if (error) throw error;
      await loadUserData();
      return true;
    } catch (err: any) {
      console.error('Failed to submit survey:', err);
      alert('Failed to record survey: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setEmployment(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <UserContext.Provider value={{
      user,
      profile,
      employment,
      enrollments,
      followups,
      notifications,
      loading,
      refreshData: loadUserData,
      updateProfile,
      updateEmployment,
      submitFollowup,
      signOut
    }}>
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
