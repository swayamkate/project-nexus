'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Award, 
  Briefcase, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  TrendingUp, 
  MapPin,
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { validatePhone, validateApaar } from '@/lib/validators';
import { ProfileHeroHeader } from './profile/ProfileHeroHeader';
import { ProfileEditModal } from './profile/ProfileEditModal';
import { ProfileSkillsModal } from './profile/ProfileSkillsModal';
import { ResumeDossierModal } from './ResumeDossierModal';
import { EmploymentStatusModal } from './profile/EmploymentStatusModal';

interface TraineeProfilePageProps {
  onNavigate: (section: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({ onNavigate }) => {
  const { user, profile, employment, enrollments, updateProfile, loading: userLoading } = useUser();
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'all' | 'personal' | 'education' | 'skills' | 'about' | 'avatar' | null>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);
  const [formData, setFormData] = useState<any>({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    dob: '2002-05-15',
    gender: 'Not specified',
    aadhaar_masked: 'XXXX-XXXX-XXXX',
    address: '',
    district: '',
    state: 'Maharashtra',
    pincode: '',
    avatar_url: '',
    highest_education: 'Secondary / Higher Secondary',
    board_university: 'Maharashtra State Board',
    year_of_passing: 2023,
    education_percentage: 75,
    skills: [],
    about_me: '',
  });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile || user) {
      setFormData({
        full_name: profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Candidate',
        username: profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'candidate',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || user?.user_metadata?.phone || '',
        dob: profile?.dob || user?.user_metadata?.dob || '2002-05-15',
        gender: profile?.gender || user?.user_metadata?.gender || 'Not specified',
        aadhaar_masked: profile?.aadhaar_masked || 'XXXX-XXXX-XXXX',
        address: profile?.address || '',
        district: profile?.district || user?.user_metadata?.district || 'Pune',
        state: profile?.state || user?.user_metadata?.state || 'Maharashtra',
        pincode: profile?.pincode || '',
        avatar_url: profile?.avatar_url || '',
        highest_education: profile?.highest_education || 'Higher Secondary (12th)',
        board_university: profile?.board_university || 'Maharashtra State Board',
        year_of_passing: profile?.year_of_passing || 2023,
        education_percentage: profile?.education_percentage || 78,
        skills: profile?.skills && profile.skills.length > 0 ? profile.skills : ['Apparel & Garment Construction', 'Pattern Making'],
        about_me: profile?.about_me || 'Enthusiastic vocational candidate committed to advancing state trade operations and skill excellence.',
      });
    }
  }, [profile, user]);

  const calculateAge = (dobString: string) => {
    if (!dobString) return '22';
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

  const formatDOB = (dobString: string) => {
    if (!dobString) return '15 May 2002';
    try {
      const d = new Date(dobString);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dobString;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.alt_phone && formData.phone && formData.alt_phone.trim() === formData.phone.trim()) {
      alert('Alternate phone number cannot be identical to your primary phone number.');
      return;
    }

    if (formData.alt_phone?.trim()) {
      const pCheck = validatePhone(formData.alt_phone.trim());
      if (!pCheck.valid) {
        alert(pCheck.error || 'Invalid alternate phone format.');
        return;
      }
    }

    if (formData.guardian_phone?.trim()) {
      const gCheck = validatePhone(formData.guardian_phone.trim());
      if (!gCheck.valid) {
        alert(gCheck.error || 'Invalid parent/guardian phone format.');
        return;
      }
    }

    if (formData.apaar_id?.trim()) {
      const aCheck = validateApaar(formData.apaar_id.trim());
      if (!aCheck.valid) {
        alert(aCheck.error || 'Invalid APAAR ID format.');
        return;
      }
    }

    setSaving(true);
    const success = await updateProfile(formData);
    setSaving(false);
    if (success) {
      setActiveModal(null);
      setToastMsg('Profile updated and synchronized successfully!');
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleAddSkill = (newSkill: string) => {
    const current = formData.skills || [];
    if (!current.includes(newSkill)) {
      const updated = [...current, newSkill];
      setFormData({ ...formData, skills: updated });
      updateProfile({ skills: updated });
      setToastMsg(`Added "${newSkill}" to your verified skills!`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = (formData.skills || []).filter((s: string) => s !== skill);
    setFormData({ ...formData, skills: updated });
    updateProfile({ skills: updated });
    setToastMsg(`Removed "${skill}".`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const sampleAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avishkar&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Snehal&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=ffd5dc'
  ];

  const age = calculateAge(formData.dob);
  const formattedDob = formatDOB(formData.dob);

  const calculateDynamicCompletionPct = () => {
    let score = 0;
    if (formData.full_name?.trim()) score += 15;
    if (formData.email?.trim()) score += 15;
    if (formData.phone?.trim()) score += 15;
    if (formData.dob) score += 10;
    if (formData.gender) score += 5;
    if (formData.highest_education) score += 10;
    if (formData.district) score += 10;
    if (formData.skills?.length > 0) score += 10;
    if (employment?.status) score += 10;
    return Math.min(100, score);
  };

  const completionPct = calculateDynamicCompletionPct();

  // Skeleton state while context is initially loading
  if (userLoading && !profile && !formData.full_name) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-48" />
        <div className="h-44 bg-white border border-slate-200 rounded-2xl p-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-white border border-slate-200 rounded-2xl" />
            <div className="h-48 bg-white border border-slate-200 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-white border border-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800 animate-in fade-in-50">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Trainee Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">View and manage your authenticated credentials, vocational skills, and CV</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowResumeModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Generate Verified CV</span>
          </button>

          <button
            onClick={() => setActiveModal('all')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Top Profile Hero Card */}
      <ProfileHeroHeader
        formData={formData}
        profile={profile}
        age={age}
        formattedDob={formattedDob}
        completionPct={completionPct}
        onOpenModal={setActiveModal}
      />

      {/* Middle 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Personal Information</h3>
              </div>
              <button
                onClick={() => setActiveModal('personal')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Full Name</span>
                <span className="font-bold text-slate-800 text-sm">{formData.full_name || 'Candidate Name'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Gender</span>
                <span className="font-semibold text-slate-800">{formData.gender || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <span className="font-semibold text-slate-800">{formattedDob} (Age {age})</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Aadhaar Number</span>
                <span className="font-mono font-bold text-slate-800">{formData.aadhaar_masked || 'XXXX-XXXX-XXXX'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-semibold text-slate-800">{formData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Phone Number</span>
                <span className="font-semibold text-slate-800">{formData.phone || '+91 98XXX XXXXX'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Address</span>
                <span className="font-semibold text-slate-800">{formData.address || 'Maharashtra, India'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">District & State</span>
                <span className="font-semibold text-slate-800">{formData.district || 'Pune'}, {formData.state || 'Maharashtra'}</span>
              </div>
            </div>
          </div>

          {/* Education Details Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Education Details</h3>
              </div>
              <button
                onClick={() => setActiveModal('education')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Highest Education</span>
                <span className="font-bold text-slate-800 text-sm">{formData.highest_education}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Board / University</span>
                <span className="font-semibold text-slate-800">{formData.board_university || 'Maharashtra State Board'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Year of Passing</span>
                <span className="font-semibold text-slate-800">{formData.year_of_passing || '2023'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Percentage / Grade</span>
                <span className="font-bold text-emerald-600">{formData.education_percentage ? `${formData.education_percentage}%` : 'First Class'}</span>
              </div>
            </div>
          </div>

          {/* Skills Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Skills & Vocational Competencies</h3>
              </div>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Manage Skills
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium block">Verified Trade Skills</span>

            <div className="flex flex-wrap gap-2 pt-1">
              {(formData.skills || []).length > 0 ? (
                formData.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg"
                  >
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium rounded-lg">
                  No prior vocational skill / Entry-level beginner
                </span>
              )}
            </div>
          </div>

          {/* About Me Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Career Statement</h3>
              </div>
              <button
                onClick={() => setActiveModal('about')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Edit
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {formData.about_me || 'Enthusiastic vocational graduate committed to mastering trade operations and contributing to industry productivity.'}
            </p>
          </div>

        </div>

        {/* Right 1 Col: Quick Links & Employment Card */}
        <div className="space-y-6">
          
          {/* Real Employment Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Current Outcome Status</h3>
              </div>
              <button
                onClick={() => setShowEmploymentModal(true)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
              >
                Update
              </button>
            </div>

            {employment?.status === 'employed' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Wage Employed</div>
                  <div className="font-bold text-slate-900 text-sm">{employment.company_name || 'Registered Employer'}</div>
                  <div className="text-slate-600">{employment.designation || 'Technician'}</div>
                  <div className="font-bold text-emerald-600 pt-1">₹{Number(employment.monthly_salary || 0).toLocaleString()}/month</div>
                </div>
                {employment.appreciation_details && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700 block">Appreciation / Increment:</span>
                    {employment.appreciation_details}
                  </div>
                )}
              </div>
            )}

            {employment?.status === 'self_employed' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-indigo-50/70 border border-indigo-200/70 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Micro-Enterprise</div>
                  <div className="font-bold text-slate-900 text-sm">{employment.business_name || 'Self-Employed Unit'}</div>
                  <div className="text-slate-600">{employment.business_category || 'Services'} • {employment.employees_count || 1} Person Team</div>
                  <div className="font-bold text-emerald-600 pt-1">Profit: ₹{Number(employment.monthly_profit || 0).toLocaleString()}/month</div>
                </div>
                {employment.udyam_number && (
                  <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    MSME: {employment.udyam_number}
                  </div>
                )}
              </div>
            )}

            {(!employment || employment?.status === 'not_employed') && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Seeking Placement</div>
                  <div className="text-slate-700 font-semibold">
                    {employment?.unemployed_reason ? employment.unemployed_reason.replace(/_/g, ' ') : 'Looking for trade opportunities'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Timeline: {employment?.target_workforce_timeline ? employment.target_workforce_timeline.replace(/_/g, ' ') : 'Immediate'}
                  </div>
                </div>
                <button
                  onClick={() => setShowEmploymentModal(true)}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  Record Your Perspective & Needs
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Quick Links</h3>
            
            <div className="space-y-1">
              {[
                { label: 'Training Details', icon: GraduationCap, target: 'training-details' },
                { label: 'Certifications', icon: Award, target: 'certifications' },
                { label: 'Employment Status', icon: Briefcase, target: 'employment-status' },
                { label: 'Follow-up History', icon: Calendar, target: 'follow-ups' },
                { label: 'Documents Vault', icon: FileText, target: 'documents' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigate(item.target)}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Badge Box */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-blue-700">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-xs">
                {profile?.is_verified ? 'SSDM Official Verified Trainee' : 'CareerLoop Verified Record'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {profile?.is_verified
                ? `Verified by State Evaluator ${profile.verified_by || ''} on ${profile.verified_at ? new Date(profile.verified_at).toLocaleDateString('en-IN') : 'Recent'}.`
                : 'Your profile is enrolled on the CareerLoop Skilling Registry with authenticated credentials.'}
            </p>
          </div>
        </div>

      </div>

      {/* Modular Profile Edit Modal */}
      <ProfileEditModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        saving={saving}
        sampleAvatars={sampleAvatars}
      />

      {/* Modular Skills Modal */}
      <ProfileSkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        skills={formData.skills || []}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
      />

      {/* Resume Dossier Generator Modal */}
      <ResumeDossierModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        profile={profile}
        employment={employment}
        enrollments={enrollments}
      />

      {/* Employment Status Modal */}
      <EmploymentStatusModal
        isOpen={showEmploymentModal}
        onClose={() => setShowEmploymentModal(false)}
      />

    </div>
  );
};
