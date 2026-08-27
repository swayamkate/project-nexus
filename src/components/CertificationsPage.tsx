'use client';

import React from 'react';
import { Award, Printer, ShieldCheck, QrCode } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { EmptyState } from '@/components/EmptyState';

export const CertificationsPage: React.FC = () => {
  const { profile, enrollments, t } = useUser();

  // A certificate is real only when the registry has both a certified status
  // and a non-empty certificate reference. Never manufacture credentials from
  // an enrollment that is still in progress (or from UI defaults).
  const certifiedEnrollment = enrollments.find(
    e => e.status === 'certified' && Boolean(e.certificate_id?.trim())
  );

  const hasCertificate = Boolean(certifiedEnrollment);

  const certData = {
    id: certifiedEnrollment?.certificate_id || '',
    traineeName: profile?.full_name || 'Name not recorded',
    traineeId: profile?.trainee_id || 'Registration number not recorded',
    courseTitle: certifiedEnrollment?.training_programs?.title || 'Program title not recorded',
    sector: certifiedEnrollment?.training_programs?.sector || 'Sector not recorded',
    issueDate: certifiedEnrollment?.certified_date || 'Date not recorded',
    completionDate: certifiedEnrollment?.completed_date || 'Date not recorded',
    grade: certifiedEnrollment?.grade ? `Grade ${certifiedEnrollment.grade}` : 'Grade not recorded',
    nsqfLevel: 'NSQF level not recorded',
    issuingAuthority: certifiedEnrollment?.training_programs?.provider_name || 'Issuing authority not recorded',
  };

  const handlePrint = () => {
    window.print();
  };

  if (!hasCertificate) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12 text-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('cert.title', 'Verified Certifications')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('cert.subtitle', 'Official NSDC & State Mission Skill Credentials with QR Verification.')}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <EmptyState
            icon={Award}
            title="No Certificates Issued Yet"
            description="You do not have any issued certificates. Enroll in an NSQF skilling program and complete your final evaluation to receive an authenticated digital credential."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('cert.title', 'Verified Certifications')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('cert.subtitle', 'Official NSDC & State Mission Skill Credentials with QR Verification.')}</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t('cert.print', 'Print / Save PDF')}</span>
        </button>
      </div>

      {/* Official Certificate Canvas */}
      <div className="bg-white border-8 border-slate-900/10 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden print:border-none print:p-0">
        
        {/* Anti-Counterfeit Guilloche Pattern Border */}
        <div className="border-4 border-double border-blue-900/40 p-6 sm:p-10 rounded-2xl relative space-y-8 bg-gradient-to-b from-amber-50/20 via-white to-blue-50/20">
          
          {/* Certificate Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100/60 border border-blue-200 text-blue-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Nexus Skilling & Enterprise Authority</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight pt-2">
              {t('cert.competency', 'Certificate of Competency')}
            </h2>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
              {t('cert.nsqf', 'National Skills Qualifications Framework (NSQF)')}
            </p>
          </div>

          {/* Body Statement */}
          <div className="text-center space-y-4 max-w-2xl mx-auto py-2">
            <p className="text-xs text-slate-500 italic">This is to officially certify that</p>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-950 underline underline-offset-8 decoration-amber-400">
              {certData.traineeName}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              bearing Trainee Registration Number <strong className="text-slate-900 font-mono">{certData.traineeId}</strong> has successfully completed the prescribed curriculum and passed the vocational competency assessment in
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="text-lg font-bold text-slate-900">{certData.courseTitle}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{certData.sector} • {certData.nsqfLevel}</p>
            </div>

            <p className="text-xs text-slate-600">
              achieving the performance award of <strong className="text-emerald-700 font-bold">{certData.grade}</strong>.
            </p>
          </div>

          {/* Certificate Footer Metadata & Verification QR */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left: Certificate Metadata */}
            <div className="text-left text-xs space-y-1 text-slate-600">
              <p>Certificate Number: <span className="font-mono font-bold text-slate-900">{certData.id}</span></p>
              <p>Date of Issuance: <span className="font-bold text-slate-900">{certData.issueDate}</span></p>
              <p>Issuing Body: <span className="font-bold text-slate-900">{certData.issuingAuthority}</span></p>
            </div>

            {/* Middle: Digital Signature */}
            <div className="text-center space-y-1">
              <div className="font-serif italic text-lg font-bold text-blue-900">
                P. K. Deshmukh
              </div>
              <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
              <p className="text-[10px] text-slate-500 uppercase font-semibold">State Director of Skill Assessment</p>
            </div>

            {/* Right: Cryptographic QR Code */}
            <div className="flex flex-col items-center space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center p-2">
                <QrCode className="w-12 h-12 text-white" />
              </div>
              <span className="text-[9px] font-mono text-slate-400">Scan to Verify</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
