import { useState, useCallback } from 'react';
import { useUser, TraineeProfile } from '@/context/UserContext';
import { TraineeProfileSchema, TraineeProfileInput } from '@/lib/schemas';

export interface UseTraineeProfileReturn {
  profile: TraineeProfile | null;
  loading: boolean;
  saving: boolean;
  toastMsg: string | null;
  saveProfile: (input: Partial<TraineeProfileInput>) => Promise<boolean>;
  addSkill: (newSkill: string) => Promise<boolean>;
  removeSkill: (skillToRemove: string) => Promise<boolean>;
  clearToast: () => void;
}

export function useTraineeProfile(): UseTraineeProfileReturn {
  const { profile, updateProfile, loading } = useUser();
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const clearToast = useCallback(() => setToastMsg(null), []);

  const saveProfile = useCallback(async (input: Partial<TraineeProfileInput>): Promise<boolean> => {
    setSaving(true);
    try {
      // Validate merged profile data
      const mergedData = {
        ...profile,
        ...input,
        full_name: input.full_name || profile?.full_name || 'Trainee',
        email: input.email || profile?.email || 'trainee@mahaskill.in'
      };

      const validated = TraineeProfileSchema.partial().safeParse(mergedData);
      if (!validated.success) {
        const errorMsg = validated.error.issues[0]?.message || 'Validation failed';
        setToastMsg(`Validation Error: ${errorMsg}`);
        setSaving(false);
        return false;
      }

      const success = await updateProfile(input);
      if (success) {
        setToastMsg('Profile updated successfully!');
      } else {
        setToastMsg('Failed to update profile. Please try again.');
      }
      setSaving(false);
      return success;
    } catch (err: any) {
      setToastMsg(`Error: ${err.message || 'Unknown error'}`);
      setSaving(false);
      return false;
    }
  }, [profile, updateProfile]);

  const addSkill = useCallback(async (newSkill: string): Promise<boolean> => {
    const trimmed = newSkill.trim();
    if (!trimmed || !profile) return false;
    if (profile.skills?.includes(trimmed)) {
      setToastMsg('Skill already exists in your profile.');
      return false;
    }
    const updatedSkills = [...(profile.skills || []), trimmed];
    return saveProfile({ skills: updatedSkills });
  }, [profile, saveProfile]);

  const removeSkill = useCallback(async (skillToRemove: string): Promise<boolean> => {
    if (!profile) return false;
    const updatedSkills = (profile.skills || []).filter(s => s !== skillToRemove);
    return saveProfile({ skills: updatedSkills });
  }, [profile, saveProfile]);

  return {
    profile,
    loading,
    saving,
    toastMsg,
    saveProfile,
    addSkill,
    removeSkill,
    clearToast
  };
}
