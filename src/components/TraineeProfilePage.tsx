'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Edit3, GraduationCap, 
  Sparkles, Camera, FileText, Award, Briefcase, Save, X, Loader2, Plus, CheckCircle2, Shield
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface TraineeProfilePageProps {
  onNavigate: (section: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile, loading: userLoading } = useUser();
  const [formData, setFormData] = useState<any>({});
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        dob: profile.dob || '2000-01-01',
        gender: profile.gender || 'Not Specified',
        address: profile.address || '',
        district: profile.district || '',
        state: profile.state || 'Maharashtra',
        pincode: profile.pincode || '',
        highest_education: profile.highest_education || '',
        board_university: profile.board_university || '',
        year_of_passing: profile.year_of_passing || 2022,
        education_percentage: profile.education_percentage || 0,
        skills: profile.skills || [],
        about_me: profile.about_me || '',
      });
    }
  }, [profile, user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const currentSkills = formData.skills || [];
    if (!currentSkills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...currentSkills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter((s: string) => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const success = await updateProfile(formData);
    setSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-2" />
        <span>Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/30 flex-shrink-0">
            {(formData.full_name || user?.email || 'T').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{formData.full_name || 'Trainee Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                {profile?.trainee_id || 'ID Pending'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{formData.email}</p>
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-emerald-400 pt-1">
              <Shield className="w-4 h-4" />
              <span>Zero-PII Privacy Enclave Hash: <span className="font-mono text-slate-400">{profile?.privacy_hash?.slice(0, 12)}...</span></span>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Profile changes saved directly to Supabase PostgreSQL database!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Details */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={formData.full_name || ''}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Avishkar Kedar"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Gender</label>
              <select
                value={formData.gender || 'Not Specified'}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Not Specified">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address & District Location */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>District & Regional Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">District</label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Pune, Nagpur, Nashik"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">State</label>
              <input
                type="text"
                value={formData.state || 'Maharashtra'}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode || ''}
                onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="411005"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-400 block mb-1">Complete Residential Address</label>
              <textarea
                rows={2}
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Street address, building, locality..."
              />
            </div>
          </div>
        </div>

        {/* Education & Skills */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Education & Core Competencies</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Highest Qualification</label>
              <input
                type="text"
                value={formData.highest_education || ''}
                onChange={e => setFormData({ ...formData, highest_education: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. 12th Standard, ITI Diploma, B.Tech"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Board / University / Institute</label>
              <input
                type="text"
                value={formData.board_university || ''}
                onChange={e => setFormData({ ...formData, board_university: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Maharashtra State Board"
              />
            </div>
          </div>

          {/* Dynamic Skills Tags */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-400 block mb-2">Skills & Certifications</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(formData.skills || []).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-lg"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-400 hover:text-rose-400 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(e); } }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Type a skill (e.g. Machine Stitching, Solar Diagnostics, Electric Wiring) and press Add..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* About Me */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Career Summary / Bio</label>
            <textarea
              rows={3}
              value={formData.about_me || ''}
              onChange={e => setFormData({ ...formData, about_me: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="Brief description of your skills, career goals, or self-employed enterprise..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center space-x-2 disabled:opacity-60 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile to Database</span>
          </button>
        </div>
      </form>
    </div>
  );
};
