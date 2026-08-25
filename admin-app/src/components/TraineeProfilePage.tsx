'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  User, Mail, Phone, Calendar, MapPin, Edit3, ChevronRight, GraduationCap, 
  Sparkles, Camera, FileText, Award, Briefcase, CalendarClock, Save, X, Loader2 
} from 'lucide-react';

interface TraineeProfilePageProps {
  onNavigate: (section: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch trainee data based on email
    const { data, error } = await supabase
      .from('trainees')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (data) {
      setProfile(data);
      setFormData(data);
    } else {
      // If user doesn't exist in trainees, init blank form
      setFormData({
        full_name: '',
        email: session.user.email,
        phone: '',
        dob: '2000-01-01',
        gender: 'Female',
        address: '',
        district: '',
        highest_education: '',
        skills: [],
        about_me: '',
      });
      setIsEditing(true);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const payload = {
      ...formData,
      email: session.user.email, // ensure email isn't overridden
    };

    if (profile?.id) {
      // Update existing
      await supabase.from('trainees').update(payload).eq('id', profile.id);
    } else {
      // Insert new
      const { data } = await supabase.from('trainees').insert(payload).select().single();
      if (data) setProfile(data);
    }
    
    await fetchProfile();
    setIsEditing(false);
    setSaving(false);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim());
    setFormData({ ...formData, skills: skillsArray });
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">My Profile</h2>
          <p className="text-xs text-slate-400">View and manage your personal information</p>
        </div>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={() => { setIsEditing(false); setFormData(profile); }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-white mb-4">Edit Profile Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <input type="text" value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Phone</label>
              <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Date of Birth</label>
              <input type="date" value={formData.dob || ''} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Gender</label>
              <select value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Address</label>
              <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">District</label>
              <input type="text" value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Highest Education</label>
              <input type="text" value={formData.highest_education || ''} onChange={e => setFormData({...formData, highest_education: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Skills (Comma separated)</label>
              <input type="text" value={(formData.skills || []).join(', ')} onChange={handleSkillChange} placeholder="e.g. Tailoring, Data Analysis" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">About Me</label>
              <textarea rows={4} value={formData.about_me || ''} onChange={e => setFormData({...formData, about_me: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Display Mode - Hero Card */}
          <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-md"
                  />
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
                    <h3 className="text-xl font-bold text-white">{profile?.full_name || 'Anonymous'}</h3>
                    <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      {profile?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 font-medium">Trainee ID: <span className="text-blue-400 font-mono font-bold">{profile?.trainee_id || 'PENDING'}</span></p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 pt-1">
                    <div className="flex items-center space-x-2"><Mail className="w-3.5 h-3.5 text-slate-500" /><span>{profile?.email}</span></div>
                    <div className="flex items-center space-x-2"><Phone className="w-3.5 h-3.5 text-slate-500" /><span>{profile?.phone || '-'}</span></div>
                    <div className="flex items-center space-x-2"><Calendar className="w-3.5 h-3.5 text-slate-500" /><span>{profile?.dob || '-'}</span></div>
                    <div className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span>{profile?.district || '-'}</span></div>
                  </div>
                </div>
              </div>

              {/* Profile Completion Box */}
              <div className="w-full lg:w-72 bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Profile Completion</span>
                  <span className="font-bold text-emerald-400">{profile?.profile_completion_pct || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${profile?.profile_completion_pct || 0}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">Complete your profile to get better opportunities</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-8 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 text-slate-100 border-b border-slate-800/80 pb-3">
                <User className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div><span className="text-slate-500 text-[11px] block">Full Name</span><span className="font-bold text-slate-200">{profile?.full_name || '-'}</span></div>
                <div><span className="text-slate-500 text-[11px] block">Gender</span><span className="font-bold text-slate-200">{profile?.gender || '-'}</span></div>
                <div><span className="text-slate-500 text-[11px] block">Aadhaar Number</span><span className="font-mono font-bold text-slate-200">{profile?.aadhaar_masked || 'XXXX-XXXX-XXXX'}</span></div>
                <div><span className="text-slate-500 text-[11px] block">Address</span><span className="font-medium text-slate-200">{profile?.address || '-'}</span></div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-4 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-white text-sm">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { id: 'training-details', label: 'Training Details', icon: GraduationCap },
                  { id: 'certifications', label: 'Certifications', icon: Award },
                  { id: 'employment-status', label: 'Employment Status', icon: Briefcase },
                  { id: 'follow-ups', label: 'Follow-up History', icon: CalendarClock },
                ].map(link => (
                  <button key={link.id} onClick={() => onNavigate(link.id)} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-200 text-xs font-semibold transition">
                    <div className="flex items-center space-x-2.5"><link.icon className="w-4 h-4 text-blue-400" /><span>{link.label}</span></div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education */}
            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-100 border-b border-slate-800/80 pb-3">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Education Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-500 text-[11px] block">Highest Education</span><span className="font-bold text-slate-200">{profile?.highest_education || '-'}</span></div>
                <div><span className="text-slate-500 text-[11px] block">Board / University</span><span className="font-bold text-slate-200">{profile?.board_university || '-'}</span></div>
                <div><span className="text-slate-500 text-[11px] block">Year of Passing</span><span className="font-bold text-slate-200">{profile?.year_of_passing || '-'}</span></div>
                <div><span className="text-slate-500 text-[11px] block">Percentage</span><span className="font-bold text-slate-200">{profile?.education_percentage || '-'}%</span></div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-100 border-b border-slate-800/80 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.length ? profile.skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">{skill}</span>
                )) : <span className="text-slate-500 text-xs">No skills listed.</span>}
              </div>
            </div>
          </div>

          <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-slate-100 border-b border-slate-800/80 pb-3">
              <User className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm">About Me</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{profile?.about_me || 'No bio provided.'}</p>
          </div>
        </>
      )}
    </div>
  );
};
