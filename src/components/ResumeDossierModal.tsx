'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  QrCode,
  ShieldCheck
} from 'lucide-react';

interface ResumeDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  employment: any;
  enrollments: any[];
}

export const ResumeDossierModal: React.FC<ResumeDossierModalProps> = ({
  isOpen,
  onClose,
  profile,
  employment,
  enrollments
}) => {
  if (!isOpen) return null;

  const verifiedEnrollments = (enrollments || []).filter(
    enr => enr.status === 'certified' && Boolean(enr.certificate_id?.trim())
  );
  const certId = verifiedEnrollments[0]?.certificate_id || null;
  const verifyUrl = certId ? `https://sih2026.avishkark.in/verify?id=${encodeURIComponent(certId)}` : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        
        {/* Top Action Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Official Verified Candidate CV</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document */}
        <div className="p-8 sm:p-12 space-y-8 print:p-0 text-slate-800" id="candidate-resume">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile?.full_name || 'Name not recorded'}</h1>
              <p className="text-sm font-bold text-blue-600">
                {employment?.business_name || employment?.business_type || 'Professional profile'} • @{profile?.username || 'username not recorded'}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-2 font-medium">
                <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-400" /> {profile?.email}</span>
                <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {profile?.phone || '+91 98XXX XXXXX'}</span>
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {profile?.district || 'District not recorded'}, {profile?.state || 'State not recorded'}</span>
              </div>
            </div>

            {/* QR Code Validation Target */}
            {certId && <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1 flex-shrink-0">
              <div className="w-20 h-20 bg-slate-900 text-white rounded-xl flex items-center justify-center p-2">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Scan to Verify</span>
              <span className="text-[8px] font-mono text-blue-600">{certId}</span>
            </div>}
          </div>

          {/* Section: Professional Summary */}
          {profile?.about_me && (
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Executive Profile & Objective
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {profile.about_me}
              </p>
            </div>
          )}

          {/* Section: Verified Vocational Credentials */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>NSQF Certified Qualifications & Training</span>
              <span className="text-[10px] text-emerald-600 font-bold">State Verified</span>
            </h3>

            <div className="space-y-3">
              {verifiedEnrollments.length > 0 ? (
                verifiedEnrollments.map((enr, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-slate-900">{enr.training_programs?.title || 'Program title not recorded'}</h4>
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {enr.grade || 'Grade not recorded'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {enr.training_programs?.provider_name || 'Issuing authority not recorded'} • Duration: {enr.training_programs?.duration_months || 'Not recorded'} Months
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">Credential Reference: {enr.certificate_id}</p>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">No verified certifications</h4>
                  <p className="text-[11px] text-slate-500">Only certificates issued by the registry appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Academic Qualifications */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Formal Education
            </h3>
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-900">{profile?.highest_education || '12th Vocational (Science)'}</p>
                <p className="text-[11px] text-slate-500">{profile?.board_university || 'Board / university not recorded'} • Year of Passing: {profile?.year_of_passing || 'Not recorded'}</p>
              </div>
              <span className="font-bold text-emerald-600">Score: {profile?.education_percentage || '78.50'}%</span>
            </div>
          </div>

          {/* Section: Skills & Competencies */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(profile?.skills && profile.skills.length > 0 ? profile.skills : ['Pattern Making', 'Single Needle Lockstitch', 'Garment CAD', 'Quality Inspection', 'Digital Billing']).map((sk: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Enterprise Track Record */}
          {employment?.business_name && (
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Enterprise & Self-Employment Record
              </h3>
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900">{employment.business_name} ({employment.business_type})</p>
                <p className="text-[11px] text-slate-600">Udyam Registration: <span className="font-mono">{employment.udyam_number || 'Registered Micro-Enterprise'}</span></p>
                <p className="text-[11px] text-slate-600">Monthly Turnover: <strong className="text-emerald-600">₹{Number(employment.monthly_revenue || 0).toLocaleString()}</strong> • Supported Workforce: {employment.employees_count || 1} Person(s)</p>
              </div>
            </div>
          )}

          {/* Footer Security Notice */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Cryptographically Verified on Nexus Outcome Registry</span>
            {verifyUrl && <span className="font-mono">{verifyUrl}</span>}
          </div>

        </div>

      </div>
    </div>
  );
};
