import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { MilestoneSurveySchema, MilestoneSurveyInput } from '@/lib/schemas';

export interface UseLongitudinalSurveyReturn {
  submitting: boolean;
  toastMsg: string | null;
  submitSurvey: (milestone: string, surveyData: Partial<MilestoneSurveyInput>) => Promise<boolean>;
  clearToast: () => void;
}

export function useLongitudinalSurvey(): UseLongitudinalSurveyReturn {
  const { submitFollowup } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const clearToast = useCallback(() => setToastMsg(null), []);

  const submitSurvey = useCallback(async (milestone: string, surveyData: Partial<MilestoneSurveyInput>): Promise<boolean> => {
    setSubmitting(true);
    try {
      const payload = {
        milestone: milestone as any,
        current_status: surveyData.current_status || 'Self-Employed / Boutique Owner',
        current_income_range: surveyData.current_income_range || '₹20,000 – ₹35,000',
        job_satisfaction_score: surveyData.job_satisfaction_score || 5,
        skill_utilization_score: surveyData.skill_utilization_score || 5,
        remarks: surveyData.remarks || 'Recorded via trainee self-assessment portal.'
      };

      const validated = MilestoneSurveySchema.safeParse(payload);
      if (!validated.success) {
        setToastMsg(`Validation Error: ${validated.error.issues[0]?.message}`);
        setSubmitting(false);
        return false;
      }

      const success = await submitFollowup(milestone, validated.data);
      if (success) {
        setToastMsg(`✅ ${milestone} Longitudinal Survey submitted successfully!`);
      } else {
        setToastMsg('Failed to submit survey. Please try again.');
      }
      setSubmitting(false);
      return success;
    } catch (err: any) {
      setToastMsg(`Error: ${err.message || 'Unknown error'}`);
      setSubmitting(false);
      return false;
    }
  }, [submitFollowup]);

  return {
    submitting,
    toastMsg,
    submitSurvey,
    clearToast
  };
}
