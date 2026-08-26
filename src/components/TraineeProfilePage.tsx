'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  GraduationCap, 
  Sparkles, 
  Camera, 
  FileText, 
  Award, 
  Briefcase, 
  Save, 
  X, 
  Loader2, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface TraineeProfilePageProps {
  onNavigate: (section: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile, loading: userLoading } = useUser();
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'all' | 'personal' | 'education' | 'skills' | 'about' | 'avatar' | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || 'Priya Sharma',
        username: profile.username || user?.email?.split('@')[0] || 'priya_sharma',
        email: profile.email || user?.email || 'priya.sharma@example.com',
        phone: profile.phone || '+91 98765 43210',
        dob: profile.dob || '2002-05-15',
        gender: profile.gender || 'Female',
        aadhaar_masked: profile.aadhaar_masked || 'XXXX-XXXX-1234',
        address: profile.address || '123, Shivaji Nagar, Pune, Maharashtra - 411005',
        district: profile.district || 'Pune',
        state: profile.state || 'Maharashtra',
        pincode: profile.pincode || '411005',
        avatar_url: profile.avatar_url || '',
        highest_education: profile.highest_education || '12th (Science)',
        board_university: profile.board_university || 'Maharashtra State Board',
        year_of_passing: profile.year_of_passing || 2020,
        education_percentage: profile.education_percentage || 78.60,
        skills: profile.skills && profile.skills.length > 0 
          ? profile.skills 
          : ['Tailoring', 'Stitching', 'Pattern Making', 'Fabric Knowledge', 'Embroidery', 'Machine Operation'],
        about_me: profile.about_me || 'I am passionate about tailoring and fashion designing. I have completed my training and now running my own tailoring business. I love creating new designs and delivering quality work to my customers.',
      });
    }
  }, [profile, user]);

  // Calculate age helper
  const calculateAge = (dobString: string) => {
    if (!dobString) return '22';
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return isNaN(age) ? '22' : age.toString();
  };

  // Format date helper: 2002-05-15 -> 15 May 2002
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

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const current = formData.skills || [];
    if (!current.includes(newSkillInput.trim())) {
      setFormData({ ...formData, skills: [...current, newSkillInput.trim()] });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter((s: string) => s !== skill)
    });
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
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
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left: Avatar + Identity Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar with Camera Button */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt={formData.full_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-3xl font-black flex items-center justify-center">
                    {(formData.full_name || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setActiveModal('avatar')}
                className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 rounded-full shadow-md transition group-hover:scale-105 cursor-pointer"
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Core Attributes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{formData.full_name}</h2>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full">
                  Active
                </span>
              </div>
              
              <p className="text-xs text-blue-600 font-semibold font-mono">
                Trainee ID: {profile?.trainee_id || 'TRN123456'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formattedDob} ({age} Years)</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formData.district}, {formData.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Profile Completion Progress Bar */}
          <div className="w-full lg:w-72 bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Profile Completion</span>
              <span className="font-extrabold text-emerald-600">{completionPct}%</span>
            </div>
            
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${completionPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-500">Complete your profile to get better opportunities</span>
            </div>

            <button 
              onClick={() => setActiveModal('all')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Update Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

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
                onClick={() => setActiveModal('skills')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                Edit
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
              <h4 className="font-bold text-xs">MahaSkill Verified Record</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your profile is verified on the State Skilling Registry with Privacy-Preserving Zero-PII Enclaves.
            </p>
          </div>
        </div>

      </div>

      {/* Edit Modal (Universal & Sectional) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {activeModal === 'all' && 'Edit Complete Profile'}
                {activeModal === 'personal' && 'Edit Personal Information'}
                {activeModal === 'education' && 'Edit Education Details'}
                {activeModal === 'skills' && 'Manage Skills'}
                {activeModal === 'about' && 'Edit About Me'}
                {activeModal === 'avatar' && 'Change Profile Picture'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Avatar Selector Modal */}
              {activeModal === 'avatar' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-600 block">Choose an Avatar</label>
                  <div className="grid grid-cols-4 gap-3">
                    {sampleAvatars.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="avatar option"
                        onClick={() => setFormData({ ...formData, avatar_url: url })}
                        className={`w-16 h-16 rounded-full object-cover cursor-pointer border-2 transition ${
                          formData.avatar_url === url ? 'border-blue-600 ring-2 ring-blue-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mt-3 mb-1">Or paste custom image URL</label>
                    <input
                      type="url"
                      value={formData.avatar_url || ''}
                      onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {/* Personal Info Fields */}
              {(activeModal === 'all' || activeModal === 'personal') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Personal Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={formData.full_name || ''}
                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob || ''}
                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Gender</label>
                      <select
                        value={formData.gender || 'Female'}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">District</label>
                      <input
                        type="text"
                        value={formData.district || ''}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Residential Address</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Education Fields */}
              {(activeModal === 'all' || activeModal === 'education') && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Education Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Highest Qualification</label>
                      <input
                        type="text"
                        value={formData.highest_education || ''}
                        onChange={e => setFormData({ ...formData, highest_education: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Board / University</label>
                      <input
                        type="text"
                        value={formData.board_university || ''}
                        onChange={e => setFormData({ ...formData, board_university: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Year of Passing</label>
                      <input
                        type="number"
                        value={formData.year_of_passing || 2020}
                        onChange={e => setFormData({ ...formData, year_of_passing: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Percentage (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.education_percentage || 78.60}
                        onChange={e => setFormData({ ...formData, education_percentage: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Fields */}
              {(activeModal === 'all' || activeModal === 'skills') && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Skills</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.skills || []).map((s: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg flex items-center space-x-1">
                        <span>{s}</span>
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="text-blue-500 hover:text-rose-500 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={e => setNewSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                      placeholder="Add a new skill (e.g. Embroidery, Solar Diagnostics)..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* About Me Field */}
              {(activeModal === 'all' || activeModal === 'about') && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">About Me</h4>
                  <textarea
                    rows={3}
                    value={formData.about_me || ''}
                    onChange={e => setFormData({ ...formData, about_me: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                    placeholder="Write a brief summary of your passion and career trajectory..."
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
