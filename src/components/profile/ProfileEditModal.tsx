'use client';

import React from 'react';
import { X, Loader2, Save } from 'lucide-react';

interface ProfileEditModalProps {
  activeModal: 'all' | 'personal' | 'education' | 'skills' | 'about' | 'avatar' | null;
  onClose: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
  sampleAvatars: string[];
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  activeModal,
  onClose,
  formData,
  setFormData,
  onSave,
  saving,
  sampleAvatars,
}) => {
  if (!activeModal) return null;

  return (
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
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          
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
                  <label className="text-xs text-slate-500 block mb-1">Unique Username (@handle)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-slate-400 text-xs font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={formData.username || ''}
                      onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none font-mono"
                      placeholder="username"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">One username per person only</span>
                </div>

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
                    onChange={e => setFormData({ ...formData, year_of_passing: parseInt(e.target.value) || 2020 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1">Score / Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.education_percentage || 75}
                    onChange={e => setFormData({ ...formData, education_percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Me Field */}
          {(activeModal === 'all' || activeModal === 'about') && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Professional Bio / About Me</h4>
              <textarea
                rows={4}
                value={formData.about_me || ''}
                onChange={e => setFormData({ ...formData, about_me: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none resize-none leading-relaxed"
                placeholder="Write a brief overview of your skills, background, and career goals..."
              />
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
