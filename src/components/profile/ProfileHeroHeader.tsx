'use client';

import React from 'react';
import { Camera, Mail, Phone, Calendar, MapPin, Edit3 } from 'lucide-react';
import { TraineeProfile } from '@/context/UserContext';

interface ProfileHeroHeaderProps {
  formData: any;
  profile: TraineeProfile | null;
  age: string;
  formattedDob: string;
  completionPct: number;
  onOpenModal: (modalType: 'all' | 'avatar') => void;
}

export const ProfileHeroHeader: React.FC<ProfileHeroHeaderProps> = ({
  formData,
  profile,
  age,
  formattedDob,
  completionPct,
  onOpenModal,
}) => {
  return (
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
              onClick={() => onOpenModal('avatar')}
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
            
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-blue-600 font-semibold">
                ID: {profile?.trainee_id || 'TRN-PENDING'}
              </span>
              {formData.username && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-bold">
                    @{formData.username}
                  </span>
                </>
              )}
            </div>

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
            onClick={() => onOpenModal('all')}
            className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-blue-600 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Update Details</span>
          </button>
        </div>

      </div>
    </div>
  );
};
