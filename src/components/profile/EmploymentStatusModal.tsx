'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  UserCheck, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Save, 
  X, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin, 
  FileText, 
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useUser, TraineeEmployment } from '@/context/UserContext';
import { validateUdyam, validateGSTIN } from '@/lib/validators';

interface EmploymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NON_PLACEMENT_REASONS = [
  { value: 'lack_of_local_vacancies', label: 'Lack of local job vacancies in trained trade' },
  { value: 'higher_education', label: 'Pursuing higher education / competitive examinations' },
  { value: 'family_constraints', label: 'Family / domestic caregiving responsibilities' },
  { value: 'wage_mismatch', label: 'Offered wage lower than local living expenses' },
  { value: 'relocation_constraints', label: 'Relocation / transportation constraints' },
  { value: 'skill_gap_tools', label: 'Need further upskilling in modern digital/industrial tools' },
  { value: 'medical_health', label: 'Health, medical recovery, or physical constraints' },
  { value: 'awaiting_onboarding', label: 'Selected & awaiting joining confirmation' },
  { value: 'other', label: 'Other personal circumstances' },
] as const;

export const SUPPORT_NEEDED_OPTIONS = [
  { value: 'placement_drive', label: 'State Job Fair / Rozgar Melawa Invitation' },
  { value: 'toolkit_loan', label: 'Micro-Loan / Tool Kit Seed Subsidy (MUDRA/PMEGP)' },
  { value: 'advanced_upskilling', label: 'Advanced Trade Upskilling & Certification' },
  { value: 'apprenticeship', label: 'Government Trade Apprenticeship Placement' },
  { value: 'counseling', label: 'One-on-One Career Counseling & Resume Support' },
] as const;

export const WORKFORCE_TIMELINES = [
  { value: 'immediate', label: 'Immediately Available (Within 30 Days)' },
  { value: 'within_3_months', label: 'Within 3 Months' },
  { value: 'within_6_months', label: 'Within 6 Months' },
  { value: 'after_studies', label: 'After Completing Higher Studies' },
] as const;

export const EmploymentStatusModal: React.FC<EmploymentStatusModalProps> = ({ isOpen, onClose }) => {
  const { employment, updateEmployment, refreshData } = useUser();
  const [status, setStatus] = useState<string>('employed');
  const [formData, setFormData] = useState<Partial<TraineeEmployment>>({});
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (employment) {
      let initialStatus = employment.status || 'employed';
      if (['wage_employed', 'employed', 'apprenticeship'].includes(initialStatus)) {
        initialStatus = 'employed';
      } else if (initialStatus === 'self_employed') {
        initialStatus = 'self_employed';
      } else {
        initialStatus = 'not_employed';
      }
      setStatus(initialStatus);
      setFormData({
        status: initialStatus,
        company_name: employment.company_name || '',
        designation: employment.designation || '',
        monthly_salary: employment.monthly_salary ?? 18000,
        joining_date: employment.joining_date || '',
        pf_esic_number: employment.pf_esic_number || '',
        work_location: employment.work_location || '',
        training_relevance: employment.training_relevance || 'direct_match',
        contract_type: employment.contract_type || 'permanent',
        appreciation_details: employment.appreciation_details || '',
        business_name: employment.business_name || '',
        business_type: employment.business_type || 'Sole Proprietorship',
        business_category: employment.business_category || 'Services',
        monthly_revenue: employment.monthly_revenue ?? 0,
        monthly_profit: employment.monthly_profit ?? 0,
        udyam_number: employment.udyam_number || employment.udyam_reg_number || '',
        gst_number: employment.gst_number || '',
        employees_count: employment.employees_count ?? employment.employee_count ?? 0,
        establishment_date: employment.establishment_date || '',
        unemployed_reason: employment.unemployed_reason || 'lack_of_local_vacancies',
        unemployed_perspective: employment.unemployed_perspective || '',
        target_workforce_timeline: employment.target_workforce_timeline || 'immediate',
        support_needed: employment.support_needed || 'placement_drive',
      });
    } else {
      setStatus('employed');
      setFormData({
        status: 'employed',
        company_name: '',
        designation: '',
        monthly_salary: 18000,
        joining_date: '',
        pf_esic_number: '',
        work_location: '',
        training_relevance: 'direct_match',
        contract_type: 'permanent',
        appreciation_details: '',
        business_name: '',
        business_type: 'Sole Proprietorship',
        business_category: 'Services',
        monthly_revenue: 0,
        monthly_profit: 0,
        udyam_number: '',
        gst_number: '',
        employees_count: 0,
        establishment_date: '',
        unemployed_reason: 'lack_of_local_vacancies',
        unemployed_perspective: '',
        target_workforce_timeline: 'immediate',
        support_needed: 'placement_drive',
      });
    }
  }, [employment, isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setFormData(prev => ({ ...prev, status: newStatus }));
    setErrorMsg(null);
  };

  const handleChange = (field: keyof TraineeEmployment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (status === 'self_employed') {
      if (formData.udyam_number?.trim()) {
        const udyamCheck = validateUdyam(formData.udyam_number.trim());
        if (!udyamCheck.valid) {
          setErrorMsg(udyamCheck.error || 'Invalid Udyam Registration number.');
          return;
        }
      }
      if (formData.gst_number?.trim()) {
        const gstCheck = validateGSTIN(formData.gst_number.trim());
        if (!gstCheck.valid) {
          setErrorMsg(gstCheck.error || 'Invalid GSTIN format.');
          return;
        }
      }
    }

    setSaving(true);
    try {
      const payload: Partial<TraineeEmployment> = {
        ...formData,
        status: status,
        joining_date: formData.joining_date?.trim() ? formData.joining_date.trim() : undefined,
        establishment_date: formData.establishment_date?.trim() ? formData.establishment_date.trim() : undefined,
        monthly_salary: isNaN(Number(formData.monthly_salary)) ? 0 : Number(formData.monthly_salary),
        monthly_revenue: isNaN(Number(formData.monthly_revenue)) ? 0 : Number(formData.monthly_revenue),
        monthly_profit: isNaN(Number(formData.monthly_profit)) ? 0 : Number(formData.monthly_profit),
        employees_count: isNaN(Number(formData.employees_count)) ? 0 : Number(formData.employees_count),
      };

      const ok = await updateEmployment(payload);
      if (ok) {
        setSuccessMsg('Employment & career status successfully synchronized!');
        await refreshData();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg('Failed to update employment records. Please verify your inputs.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-400/30 rounded-2xl">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Update Employment & Outcome Status</h2>
              <p className="text-xs text-slate-300">
                Official longitudinal record submitted for SSDM State Verification
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Status Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Your Current Occupational Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => handleStatusChange('employed')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  status === 'employed'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Briefcase className={`w-5 h-5 ${status === 'employed' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {status === 'employed' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="font-bold text-sm">Wage Employed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Salaried / Private / Corporate / Govt Job</div>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('self_employed')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  status === 'self_employed'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className={`w-5 h-5 ${status === 'self_employed' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {status === 'self_employed' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="font-bold text-sm">Self-Employed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Micro-Enterprise / MSME / Freelance</div>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('not_employed')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  status === 'not_employed'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <HelpCircle className={`w-5 h-5 ${status === 'not_employed' ? 'text-amber-600' : 'text-slate-400'}`} />
                  {status === 'not_employed' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="font-bold text-sm">Seeking Placement</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Unemployed / Higher Studies / Transition</div>
              </button>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* DYNAMIC FORM SECTION BASED ON STATUS */}

          {/* 1. WAGE EMPLOYMENT FORM */}
          {status === 'employed' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                <ShieldCheck className="w-4 h-4" />
                <span>Wage Employment Details (Verified against salary vouchers / offer letter)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Employer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Motors, L&T, Tech Mahindra"
                    value={formData.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Machine Operator, Solar Technician"
                    value={formData.designation || ''}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gross Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 22000"
                    value={formData.monthly_salary || ''}
                    onChange={(e) => handleChange('monthly_salary', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joining_date || ''}
                    onChange={(e) => handleChange('joining_date', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Location / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune MIDC Bhosari, Chakan"
                    value={formData.work_location || ''}
                    onChange={(e) => handleChange('work_location', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PF / ESIC UAN Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 101234567890"
                    value={formData.pf_esic_number || ''}
                    onChange={(e) => handleChange('pf_esic_number', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Training Relevance & Contract Stability (SIH PS-135 Metric) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Training Relevance to Job Role *
                  </label>
                  <select
                    value={formData.training_relevance || 'direct_match'}
                    onChange={(e) => handleChange('training_relevance' as any, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-semibold"
                  >
                    <option value="direct_match">🎯 Direct Match (Employed in trained vocational trade)</option>
                    <option value="adjacent_trade">🔄 Adjacent Sector (Utilizing core technical skills)</option>
                    <option value="unrelated_sector">⚠️ Unrelated Domain (Outside vocational trade)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Employment Contract Stability *
                  </label>
                  <select
                    value={formData.contract_type || 'permanent'}
                    onChange={(e) => handleChange('contract_type' as any, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-semibold"
                  >
                    <option value="permanent">Permanent / Direct Company Payroll</option>
                    <option value="fixed_term_contract">Fixed-Term Contract (1 to 3 Years)</option>
                    <option value="apprenticeship">NAPS / NATS Official Apprenticeship</option>
                    <option value="informal_daily_wage">Informal / Daily Wage Basis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appreciation, Wage Increments & Performance Milestones
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Promoted to Senior Line Lead after 6 months; received Best Technician recognition with ₹3,000 monthly increment."
                  value={formData.appreciation_details || ''}
                  onChange={(e) => handleChange('appreciation_details', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. SELF-EMPLOYMENT / ENTERPRISE FORM */}
          {status === 'self_employed' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                <Building2 className="w-4 h-4" />
                <span>Micro-Enterprise & Business Registry Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business / Enterprise Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shinde Electrical Solutions & Services"
                    value={formData.business_name || ''}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Category / Sector *</label>
                  <select
                    value={formData.business_category || 'Services'}
                    onChange={(e) => handleChange('business_category', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Services">Services (Repairs, Salon, Maintenance, IT)</option>
                    <option value="Manufacturing">Manufacturing & Fabrication</option>
                    <option value="Retail">Retail & Wholesale Trade</option>
                    <option value="Agribusiness">Agribusiness & Food Processing</option>
                    <option value="Construction">Construction & Civil Contracting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Gross Revenue / Turnover (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={formData.monthly_revenue || ''}
                    onChange={(e) => handleChange('monthly_revenue', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Net Monthly Profit (Take-Home Income) (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 24000"
                    value={formData.monthly_profit || ''}
                    onChange={(e) => handleChange('monthly_profit', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Udyam MSME Number (Format: UDYAM-MH-12-1234567)
                  </label>
                  <input
                    type="text"
                    placeholder="UDYAM-MH-12-0012345"
                    value={formData.udyam_number || ''}
                    onChange={(e) => handleChange('udyam_number', e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="27AAAAA0000A1Z5"
                    value={formData.gst_number || ''}
                    onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Team / Employees Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    value={formData.employees_count || ''}
                    onChange={(e) => handleChange('employees_count', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Establishment Date</label>
                  <input
                    type="date"
                    value={formData.establishment_date || ''}
                    onChange={(e) => handleChange('establishment_date', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Appreciation, Notable Orders & Growth Highlights
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Secured ongoing commercial annual maintenance contract with 3 local residential societies; 5-star customer rating."
                  value={formData.appreciation_details || ''}
                  onChange={(e) => handleChange('appreciation_details', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 3. UNEMPLOYED / SEEKING PLACEMENT FORM */}
          {status === 'not_employed' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4" />
                <span>Job Seeking & Non-Placement Diagnostics (Used for Policy Support & Melawas)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Reason for Non-Placement *
                  </label>
                  <select
                    required
                    value={formData.unemployed_reason || 'lack_of_local_vacancies'}
                    onChange={(e) => handleChange('unemployed_reason', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-600 focus:outline-none"
                  >
                    {NON_PLACEMENT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Timeline to Enter Workforce *
                  </label>
                  <select
                    required
                    value={formData.target_workforce_timeline || 'immediate'}
                    onChange={(e) => handleChange('target_workforce_timeline', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-600 focus:outline-none"
                  >
                    {WORKFORCE_TIMELINES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Government / SSDM Intervention Needed *
                  </label>
                  <select
                    required
                    value={formData.support_needed || 'placement_drive'}
                    onChange={(e) => handleChange('support_needed', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-600 focus:outline-none"
                  >
                    {SUPPORT_NEEDED_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate's Personal Perspective & Employment Barriers *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe your current career situation in detail (e.g. What challenges are you facing? What specific job roles are you looking for? How can the state mission assist your transition?)"
                  value={formData.unemployed_perspective || ''}
                  onChange={(e) => handleChange('unemployed_perspective', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Records...' : 'Save & Synchronize Outcome'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
