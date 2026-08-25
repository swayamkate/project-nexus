'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  ChevronRight, 
  GraduationCap, 
  Sparkles, 
  Camera, 
  ShieldCheck,
  CheckCircle2,
  FileText,
  Award,
  Briefcase,
  CalendarClock
} from 'lucide-react';

interface TraineeProfilePageProps {
  onNavigate: (section: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    traineeId: 'TRN123456',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    dob: '15 May 2002 (22 Years)',
    location: 'Pune, Maharashtra',
    gender: 'Female',
    aadhaar: 'XXXX-XXXX-1234',
    address: '123, Shivaji Nagar, Pune, Maharashtra - 411005',
    district: 'Pune',
    highestEducation: '12th (Science)',
    board: 'Maharashtra State Board',
    yearOfPassing: '2020',
    percentage: '78.60%',
    skills: ['Tailoring', 'Stitching', 'Pattern Making', 'Fabric Knowledge', 'Embroidery', 'Machine Operation'],
    aboutMe: 'I am passionate about tailoring and fashion designing. I have completed my training and now running my own tailoring business. I love creating new designs and delivering quality work to my customers.',
    profileCompletion: 85
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">My Profile</h2>
          <p className="text-xs text-slate-400">View and manage your personal information</p>
        </div>

        <button 
          onClick={() => alert('Profile edit modal opened')}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Trainee Hero Overview Card */}
      <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Avatar & Core Metadata */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                alt="Priya Sharma" 
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-md"
              />
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
                <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              
              <p className="text-xs text-slate-400 font-medium">Trainee ID: <span className="text-blue-400 font-mono font-bold">{profile.traineeId}</span></p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{profile.dob}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Box */}
          <div className="w-full lg:w-72 bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Profile Completion</span>
              <span className="font-bold text-emerald-400">{profile.profileCompletion}%</span>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile.profileCompletion}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Complete your profile to get better opportunities
            </p>

            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1">
              <span>Update Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Middle Grid: Personal Information & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Personal Information (8 cols) */}
        <div className="lg:col-span-8 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2 text-slate-100">
              <User className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm">Personal Information</h3>
            </div>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">Edit</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Full Name</span>
              <span className="font-bold text-slate-200">{profile.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Gender</span>
              <span className="font-bold text-slate-200">{profile.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Date of Birth</span>
              <span className="font-bold text-slate-200">15 May 2002</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Aadhaar Number</span>
              <span className="font-mono font-bold text-slate-200">{profile.aadhaar}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Email Address</span>
              <span className="font-bold text-slate-200">{profile.email}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Phone Number</span>
              <span className="font-bold text-slate-200">{profile.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Address</span>
              <span className="font-medium text-slate-200 leading-relaxed">{profile.address}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">District</span>
              <span className="font-bold text-slate-200">{profile.district}</span>
            </div>
          </div>
        </div>

        {/* Quick Links (4 cols) */}
        <div className="lg:col-span-4 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm">Quick Links</h3>

          <div className="space-y-2">
            {[
              { id: 'training-details', label: 'Training Details', icon: GraduationCap },
              { id: 'certifications', label: 'Certifications', icon: Award },
              { id: 'employment-status', label: 'Employment Status', icon: Briefcase },
              { id: 'follow-ups', label: 'Follow-up History', icon: CalendarClock },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-200 text-xs font-semibold transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Education Details & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Education Details */}
        <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2 text-slate-100">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm">Education Details</h3>
            </div>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">Edit</button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Highest Education</span>
              <span className="font-bold text-slate-200">{profile.highestEducation}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Board / University</span>
              <span className="font-bold text-slate-200">{profile.board}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Year of Passing</span>
              <span className="font-bold text-slate-200">{profile.yearOfPassing}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Percentage</span>
              <span className="font-bold text-slate-200">{profile.percentage}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2 text-slate-100">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm">Skills</h3>
            </div>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">Edit</button>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Your Top Skills</span>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* About Me Full Width Card */}
      <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2 text-slate-100">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">About Me</h3>
          </div>
          <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">Edit</button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {profile.aboutMe}
        </p>
      </div>

    </div>
  );
};
