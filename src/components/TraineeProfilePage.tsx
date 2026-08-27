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
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { ProfileHeroHeader } from './profile/ProfileHeroHeader';
import { ProfileEditModal } from './profile/ProfileEditModal';
import { ProfileSkillsModal } from './profile/ProfileSkillsModal';

interface TraineeProfilePageProps {
  onNavigate: (section: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile, loading: userLoading } = useUser();
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'all' | 'personal' | 'education' | 'skills' | 'about' | 'avatar' | null>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || user?.email?.split('@')[0] || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        dob: profile.dob || '2000-01-01',
        gender: profile.gender || 'Not specified',
        aadhaar_masked: profile.aadhaar_masked || 'XXXX-XXXX-XXXX',
        address: profile.address || '',
        district: profile.district || 'Maharashtra',
        state: profile.state || 'Maharashtra',
        pincode: profile.pincode || '',
        avatar_url: profile.avatar_url || '',
        highest_education: profile.highest_education || 'Secondary / Higher Secondary',
        board_university: profile.board_university || '',
        year_of_passing: profile.year_of_passing || null,
        education_percentage: profile.education_percentage || null,
        skills: profile.skills || [],
        about_me: profile.about_me || '',
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
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Snehal&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=ffd5dc'
  ];

  if (userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-700">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
        <span className="font-semibold text-sm">Loading your profile...</span>
      </div>
    );
  }

  const age = calculateAge(formData.dob);
  const formattedDob = formatDOB(formData.dob);
  const completionPct = profile?.profile_completion_pct || 85;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">View and manage your personal information</p>
        </div>
        <button
          onClick={() => setActiveModal('all')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
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
                <span className="font-bold text-slate-800 text-sm">{formData.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Gender</span>
                <span className="font-semibold text-slate-800">{formData.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <span className="font-semibold text-slate-800">{formattedDob}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Aadhaar Number</span>
                <span className="font-mono font-bold text-slate-800">{formData.aadhaar_masked}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-semibold text-slate-800">{formData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Phone Number</span>
                <span className="font-semibold text-slate-800">{formData.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Address</span>
                <span className="font-semibold text-slate-800">{formData.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">District</span>
                <span className="font-semibold text-slate-800">{formData.district}</span>
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
                <span className="font-semibold text-slate-800">{formData.board_university}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Year of Passing</span>
                <span className="font-semibold text-slate-800">{formData.year_of_passing}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Percentage</span>
                <span className="font-bold text-emerald-600">{formData.education_percentage}%</span>
              </div>
            </div>
          </div>

          {/* Skills Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Skills</h3>
              </div>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Manage Skills
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium block">Your Top Skills</span>

            <div className="flex flex-wrap gap-2 pt-1">
              {(formData.skills || []).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* About Me Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">About Me</h3>
              </div>
              <button
                onClick={() => setActiveModal('about')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Edit
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {formData.about_me}
            </p>
          </div>

        </div>

        {/* Right 1 Col: Quick Links Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Quick Links</h3>
            
            <div className="space-y-1">
              {[
                { label: 'Training Details', icon: GraduationCap, target: 'training-details' },
                { label: 'Certifications', icon: Award, target: 'certifications' },
                { label: 'Employment Status', icon: Briefcase, target: 'employment-status' },
                { label: 'Follow-up History', icon: Calendar, target: 'follow-ups' },
                { label: 'Documents', icon: FileText, target: 'documents' },
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
              <h4 className="font-bold text-xs">Nexus Verified Record</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your profile is verified on the Nexus Skilling Registry with authenticated credentials.
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

    </div>
  );
};
