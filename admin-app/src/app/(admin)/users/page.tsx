'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  Search, 
  Trash2, 
  Ban, 
  Loader2, 
  UserPlus, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Key,
  ExternalLink,
  GraduationCap,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Calendar,
  X,
  Award,
  Sparkles,
  Download,
  Building2,
  FileText,
  Bell,
  Send,
  Target,
  BookOpen,
  Edit3,
  Check,
  ShieldCheck,
  Lock,
  RefreshCw,
  Plus,
  Sliders,
  Eye,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { DestructiveConfirmModal } from '@/components/DestructiveConfirmModal';
import { formatHumanError } from '@/lib/errorUtils';
import { getAdminActorEmail, logAdminAction } from '@/lib/auditLogger';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'trainees' | 'staff'>('trainees');
  const [users, setUsers] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [isSuperadmin, setIsSuperadmin] = useState(true);
  
  // Selected Trainee Dossier State
  const [selectedTrainee, setSelectedTrainee] = useState<any | null>(null);
  const [traineeEmployment, setTraineeEmployment] = useState<any | null>(null);
  const [traineeGoal, setTraineeGoal] = useState<any | null>(null);
  const [traineeSubmissions, setTraineeSubmissions] = useState<any[]>([]);
  const [traineeEnrollments, setTraineeEnrollments] = useState<any[]>([]);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  // Edit Trainee Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Provision / Manage Staff State
  const [isProvisionStaffOpen, setIsProvisionStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [isManageStaffOpen, setIsManageStaffOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('admin');
  const [newStaffDept, setNewStaffDept] = useState('District Skill Mission');
  const [newStaffDist, setNewStaffDist] = useState('Pune');
  const [creatingStaff, setCreatingStaff] = useState(false);

  // Staff Password Reset State
  const [resetStaffPass, setResetStaffPass] = useState('');
  const [resettingPass, setResettingPass] = useState(false);

  // Toast / Feedback State
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification Dispatcher State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifTarget, setNotifTarget] = useState<'broadcast' | 'single'>('broadcast');
  const [targetTrainee, setTargetTrainee] = useState<any | null>(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('info');
  const [sendingNotif, setSendingNotif] = useState(false);

  const supabase = createClient();

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 1. Fetch real trainees from database
      const { data: traineeData } = await supabase
        .from('trainees')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (traineeData) setUsers(traineeData);

      // 2. Fetch real staff and admins
      const staffRes = await fetch('/api/admin/staff');
      const staffJson = await staffRes.json();
      if (staffJson.success) {
        setStaffList(staffJson.staff);
      } else {
        const { data: adminRoles } = await supabase
          .from('user_roles')
          .select('*')
          .in('role', ['admin', 'superadmin', 'evaluator'])
          .order('created_at', { ascending: false });
        if (adminRoles) setStaffList(adminRoles);
      }
    } catch (err) {
      console.error('Error fetching users/staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openTraineeDrawer = async (trainee: any) => {
    setSelectedTrainee(trainee);
    setTraineeEmployment(null);
    setTraineeGoal(null);
    setTraineeSubmissions([]);
    setTraineeEnrollments([]);

    try {
      const [empRes, goalRes, subRes, enrollRes] = await Promise.all([
        supabase.from('trainee_employment').select('*').eq('trainee_id', trainee.id).maybeSingle(),
        supabase.from('trainee_career_goals').select('*').eq('trainee_id', trainee.id).maybeSingle(),
        supabase.from('assessment_submissions').select('*, skill_assessments(title, badge_name)').eq('trainee_id', trainee.id),
        supabase.from('trainee_course_enrollments').select('*, external_courses(title, platform, provider)').eq('trainee_id', trainee.id)
      ]);

      if (empRes.data) setTraineeEmployment(empRes.data);
      if (goalRes.data) setTraineeGoal(goalRes.data);
      if (subRes.data) setTraineeSubmissions(subRes.data);
      if (enrollRes.data) setTraineeEnrollments(enrollRes.data);
    } catch (err) {
      console.error('Error loading trainee details:', err);
    }
  };

  const openEditModal = (trainee: any, employment: any) => {
    setEditFormData({
      trainee_id: trainee.id,
      full_name: trainee.full_name || '',
      email: trainee.email || '',
      phone: trainee.phone || '',
      dob: trainee.dob || '',
      gender: trainee.gender || '',
      aadhaar_masked: trainee.aadhaar_masked || '',
      address: trainee.address || '',
      district: trainee.district || 'Pune',
      state: trainee.state || 'Maharashtra',
      pincode: trainee.pincode || '',
      about_me: trainee.about_me || '',
      skills: (trainee.skills || []).join(', '),
      highest_education: trainee.highest_education || 'ITI / Vocational Certificate',
      board_university: trainee.board_university || '',
      year_of_passing: trainee.year_of_passing || '',
      education_percentage: trainee.education_percentage || '',
      avatar_url: trainee.avatar_url || '',
      is_verified: trainee.is_verified || false,
      verification_notes: trainee.verification_notes || '',
      
      // Employment Fields
      emp_status: employment?.status || 'not_employed',
      company_name: employment?.company_name || '',
      designation: employment?.designation || '',
      monthly_salary: employment?.monthly_salary || '',
      joining_date: employment?.joining_date || '',
      pf_esic_number: employment?.pf_esic_number || '',
      work_location: employment?.work_location || '',
      appreciation_details: employment?.appreciation_details || '',
      business_name: employment?.business_name || '',
      business_category: employment?.business_category || 'Services',
      monthly_revenue: employment?.monthly_revenue || '',
      monthly_profit: employment?.monthly_profit || '',
      udyam_number: employment?.udyam_number || '',
      gst_number: employment?.gst_number || '',
      employees_count: employment?.employees_count || 1,
      unemployed_reason: employment?.unemployed_reason || 'lack_of_local_vacancies',
      unemployed_perspective: employment?.unemployed_perspective || '',
      target_workforce_timeline: employment?.target_workforce_timeline || 'Immediate',
      support_needed: employment?.support_needed || 'State Rozgar Melawa'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveTraineeEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdit(true);

    try {
      const skillsArray = editFormData.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);

      const payload = {
        trainee_id: editFormData.trainee_id,
        profile: {
          full_name: editFormData.full_name,
          email: editFormData.email,
          phone: editFormData.phone,
          dob: editFormData.dob,
          gender: editFormData.gender,
          aadhaar_masked: editFormData.aadhaar_masked,
          address: editFormData.address,
          district: editFormData.district,
          state: editFormData.state,
          pincode: editFormData.pincode,
          about_me: editFormData.about_me,
          skills: skillsArray,
          highest_education: editFormData.highest_education,
          board_university: editFormData.board_university,
          year_of_passing: editFormData.year_of_passing ? parseInt(editFormData.year_of_passing) : null,
          education_percentage: editFormData.education_percentage ? parseFloat(editFormData.education_percentage) : null,
          avatar_url: editFormData.avatar_url,
          is_verified: editFormData.is_verified,
          verification_notes: editFormData.verification_notes,
          verified_by: editFormData.is_verified ? await getAdminActorEmail() : null,
          verified_at: editFormData.is_verified ? new Date().toISOString() : null
        },
        employment: {
          status: editFormData.emp_status,
          company_name: editFormData.company_name,
          designation: editFormData.designation,
          monthly_salary: editFormData.monthly_salary,
          joining_date: editFormData.joining_date,
          pf_esic_number: editFormData.pf_esic_number,
          work_location: editFormData.work_location,
          appreciation_details: editFormData.appreciation_details,
          business_name: editFormData.business_name,
          business_category: editFormData.business_category,
          monthly_revenue: editFormData.monthly_revenue,
          monthly_profit: editFormData.monthly_profit,
          udyam_number: editFormData.udyam_number,
          gst_number: editFormData.gst_number,
          employees_count: editFormData.employees_count,
          unemployed_reason: editFormData.unemployed_reason,
          unemployed_perspective: editFormData.unemployed_perspective,
          target_workforce_timeline: editFormData.target_workforce_timeline,
          support_needed: editFormData.support_needed,
          verified_by_admin: editFormData.is_verified
        }
      };

      const res = await fetch('/api/admin/update-trainee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update candidate record');

      showToast('success', `Candidate ${editFormData.full_name} updated successfully in PostgreSQL database!`);
      setIsEditModalOpen(false);
      await fetchUsers();
      if (selectedTrainee?.id === editFormData.trainee_id) {
        await openTraineeDrawer({ ...selectedTrainee, ...payload.profile });
      }
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStaff(true);

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newStaffEmail.trim().toLowerCase(),
          password: newStaffPass,
          username: newStaffUsername.trim().toLowerCase() || newStaffEmail.split('@')[0],
          role: newStaffRole,
          department: newStaffDept,
          district: newStaffDist
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to provision staff account');

      showToast('success', `Official ${newStaffRole} account for ${newStaffEmail} provisioned successfully!`);
      setNewStaffEmail('');
      setNewStaffUsername('');
      setNewStaffPass('');
      setIsProvisionStaffOpen(false);
      await fetchUsers();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleToggleStaffStatus = async (staff: any) => {
    try {
      const nextStatus = !staff.is_active;
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: staff.email,
          is_active: nextStatus
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle staff status');

      showToast('success', `Staff ${staff.email} status changed to ${nextStatus ? 'Active' : 'Suspended'}.`);
      await fetchUsers();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    }
  };

  const handleResetStaffPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !resetStaffPass) return;
    setResettingPass(true);

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedStaff.email,
          action: 'RESET_PASSWORD',
          newPassword: resetStaffPass
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      showToast('success', `Password for ${selectedStaff.email} changed successfully!`);
      setResetStaffPass('');
      setIsManageStaffOpen(false);
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    } finally {
      setResettingPass(false);
    }
  };

  const handleDeleteStaff = async (staff: any) => {
    if (staff.email === 'admin@nexus.com' || staff.email === 'superadmin@nexus.gov.in') {
      showToast('error', 'Cannot delete primary root superadmin account.');
      return;
    }
    if (!confirm(`Permanently remove administrative privileges for ${staff.email}?`)) return;

    try {
      const res = await fetch(`/api/admin/staff?email=${encodeURIComponent(staff.email)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove staff');

      showToast('success', `Staff privileges for ${staff.email} removed.`);
      setIsManageStaffOpen(false);
      await fetchUsers();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    }
  };

  const handleToggleStaffPermission = async (staff: any, permKey: string) => {
    try {
      const currentPerms = staff.permissions || {};
      const nextPerms = { ...currentPerms, [permKey]: !currentPerms[permKey] };

      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: staff.email,
          permissions: nextPerms
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update permissions');

      showToast('success', `Permission '${permKey}' updated for ${staff.email}.`);
      setSelectedStaff((prev: any) => prev ? { ...prev, permissions: nextPerms } : null);
      await fetchUsers();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    }
  };

  const handleToggleVerifyTrainee = async (trainee: any) => {
    try {
      const actorEmail = await getAdminActorEmail();
      const nextStatus = !trainee.is_verified;

      const { error } = await supabase
        .from('trainees')
        .update({
          is_verified: nextStatus,
          verified_by: nextStatus ? actorEmail : null,
          verified_at: nextStatus ? new Date().toISOString() : null,
          verification_notes: nextStatus ? 'Identity KYC and Trade Verified by SSDM State Evaluator' : null
        })
        .eq('id', trainee.id);

      if (error) throw error;

      await logAdminAction(
        nextStatus ? 'VERIFY_TRAINEE_DATA' : 'REVOKE_TRAINEE_VERIFICATION',
        'TRAINEES',
        trainee.id,
        `${nextStatus ? 'Approved and marked data verified' : 'Revoked data verification'} for ${trainee.email}`,
        actorEmail
      );

      setSelectedTrainee((prev: any) => prev ? {
        ...prev,
        is_verified: nextStatus,
        verified_by: nextStatus ? actorEmail : null,
        verified_at: nextStatus ? new Date().toISOString() : null
      } : null);

      showToast('success', `Trainee ${trainee.full_name || trainee.email} ${nextStatus ? 'marked as SSDM Data Verified!' : 'verification revoked.'}`);
      await fetchUsers();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update verification status.');
    }
  };

  const handleSuspendTrainee = async (userId: string, currentStatus: boolean, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('trainees')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      const actorEmail = await getAdminActorEmail();
      await logAdminAction(
        currentStatus ? 'SUSPEND_TRAINEE' : 'REACTIVATE_TRAINEE',
        'TRAINEES',
        userId,
        `${currentStatus ? 'Suspended' : 'Reactivated'} trainee account ${userEmail}`,
        actorEmail
      );

      showToast('success', `Trainee account status changed to ${!currentStatus ? 'Active' : 'Suspended'}.`);
      if (selectedTrainee?.id === userId) {
        setSelectedTrainee((prev: any) => prev ? { ...prev, is_active: !currentStatus } : null);
      }
      await fetchUsers();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    }
  };

  const confirmDeleteTrainee = async () => {
    if (!userToDelete) return;
    try {
      const { error } = await supabase
        .from('trainees')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      showToast('success', `Trainee record for ${userToDelete.email} permanently purged.`);
      setSelectedTrainee(null);
      await fetchUsers();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    } finally {
      setUserToDelete(null);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingNotif(true);
    try {
      const payload = {
        trainee_id: notifTarget === 'single' ? targetTrainee?.id : null,
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        type: notifType,
        is_read: false
      };

      const { error } = await supabase.from('trainee_notifications').insert(payload);
      if (error) throw error;

      showToast('success', `Notification "${notifTitle}" dispatched successfully!`);
      setIsNotifModalOpen(false);
      setNotifTitle('');
      setNotifMessage('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to dispatch notification.');
    } finally {
      setSendingNotif(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.trainee_id || '').toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = filterDistrict === 'all' || u.district === filterDistrict;
    return matchesSearch && matchesDistrict;
  });

  const uniqueDistricts = Array.from(new Set(users.map(u => u.district).filter(Boolean)));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
            <span>Identity, Verification & Staff Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            SSDM State registry, candidate dossier modifications, evaluator credentials, and SuperAdmin authority
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {activeTab === 'trainees' ? (
            <button
              onClick={() => {
                setNotifTarget('broadcast');
                setTargetTrainee(null);
                setIsNotifModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          ) : (
            <button
              onClick={() => setIsProvisionStaffOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision New Staff Account</span>
            </button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2 animate-in fade-in ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Tab Bar */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('trainees')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'trainees'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Candidate Registry ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Staff & Admins Management ({staffList.length})</span>
        </button>
      </div>

      {/* TAB 1: CANDIDATE REGISTRY */}
      {activeTab === 'trainees' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Search & District Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search candidate by name, email, username, or trainee ID..."
                className="w-full bg-[#0a1020] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              className="bg-[#0a1020] border border-slate-800 text-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none"
            >
              <option value="all">All Districts</option>
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Trainee Table */}
          <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Enrolled Trainee Registry</h3>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  {filteredUsers.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center items-center text-slate-400 space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-xs">Synchronizing database records...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12">
                <EmptyState
                  icon={Search}
                  title="No Candidates Found"
                  description="No registered trainees match your current search criteria or district filter."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate Identity</th>
                      <th className="py-3 px-4">Trainee ID</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Verified Skills</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {filteredUsers.map((trainee) => (
                      <tr 
                        key={trainee.id}
                        onClick={() => openTraineeDrawer(trainee)}
                        className="hover:bg-slate-900/60 transition cursor-pointer group"
                      >
                        {/* Candidate Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            {trainee.avatar_url ? (
                              <img 
                                src={trainee.avatar_url} 
                                alt={trainee.full_name} 
                                className="w-9 h-9 rounded-full object-cover border border-blue-500/30 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                                {(trainee.full_name || 'T').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-white block group-hover:text-blue-400 transition">
                                {trainee.full_name || 'Unnamed Trainee'}
                              </span>
                              <span className="text-[11px] text-slate-400">{trainee.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                          {trainee.trainee_id}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {trainee.district || 'District not recorded'}
                        </td>

                        {/* Skills Tags */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(trainee.skills || []).length > 0 ? (
                              trainee.skills.slice(0, 2).map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-semibold rounded">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Entry beginner</span>
                            )}
                            {(trainee.skills || []).length > 2 && (
                              <span className="text-[10px] text-slate-500">+{trainee.skills.length - 2}</span>
                            )}
                          </div>
                        </td>

                        {/* Verification Status */}
                        <td className="py-3.5 px-4">
                          {trainee.is_verified ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              🛡️ Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              ⏳ Unverified
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            trainee.is_active !== false 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {trainee.is_active !== false ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => openEditModal(trainee, null)}
                              className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 transition cursor-pointer"
                              title="Edit candidate profile"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleSuspendTrainee(trainee.id, trainee.is_active !== false, trainee.email)}
                              className={`p-1.5 rounded-lg border transition ${
                                trainee.is_active !== false 
                                  ? 'text-amber-400 hover:bg-amber-500/10 border-amber-500/20' 
                                  : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20'
                              }`}
                              title={trainee.is_active !== false ? "Suspend account" : "Activate account"}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setUserToDelete(trainee)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STAFF & ADMINISTRATORS MANAGEMENT (SUPERADMIN DESK) */}
      {activeTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">State Administrative Hierarchy & Staff Directory</h3>
                  <p className="text-xs text-slate-400">
                    SuperAdmins possess complete operational sovereignty: create staff, reset passwords, suspend logins, and delegate permissions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProvisionStaffOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Provision Staff Account</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department / Region</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Permissions Scope</th>
                    <th className="py-3 px-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {staffList.map((staff) => (
                    <tr key={staff.id || staff.email} className="hover:bg-slate-900/50 transition">
                      
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            staff.role === 'superadmin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}>
                            {staff.role === 'superadmin' ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{staff.email}</span>
                            <span className="text-[10px] font-mono text-slate-400">@{staff.username || 'staff'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          staff.role === 'superadmin' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : staff.role === 'admin' 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {staff.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="block font-semibold">{staff.department || 'State Skill Mission'}</span>
                        <span className="text-[10px] text-slate-400">{staff.district || 'Statewide HQ'}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          staff.is_active !== false 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {staff.is_active !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[240px]">
                          {staff.role === 'superadmin' ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                              ⭐ ALL UNRESTRICTED
                            </span>
                          ) : (
                            Object.entries(staff.permissions || {}).map(([k, v]) => v ? (
                              <span key={k} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px]">
                                {k.replace('can_edit_', '').replace('can_', '')}
                              </span>
                            ) : null)
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setIsManageStaffOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/20 transition cursor-pointer"
                            title="Manage permissions & password"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStaffStatus(staff)}
                            className={`p-1.5 rounded-lg border transition ${
                              staff.is_active !== false 
                                ? 'text-amber-400 hover:bg-amber-500/10 border-amber-500/20' 
                                : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20'
                            }`}
                            title={staff.is_active !== false ? "Suspend admin login" : "Reactivate admin login"}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {staff.email !== 'admin@nexus.com' && staff.email !== 'superadmin@nexus.gov.in' && (
                            <button
                              onClick={() => handleDeleteStaff(staff)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
                              title="Delete staff account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* MODAL 1: PROVISION NEW STAFF */}
      {isProvisionStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Provision Administrative Staff Account</h3>
                  <p className="text-[11px] text-slate-400">Issue official credentials for SSDM Evaluators, Admins, or Superadmins</p>
                </div>
              </div>
              <button 
                onClick={() => setIsProvisionStaffOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={e => setNewStaffEmail(e.target.value)}
                    placeholder="evaluator@district.gov.in"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={newStaffUsername}
                    onChange={e => setNewStaffUsername(e.target.value)}
                    placeholder="pune_evaluator"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Security Password (min 6) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newStaffPass}
                    onChange={e => setNewStaffPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Assigned Role *</label>
                  <select
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="admin">District Administrator</option>
                    <option value="evaluator">Skill Evaluator</option>
                    <option value="superadmin">State Superadmin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Department</label>
                  <input
                    type="text"
                    value={newStaffDept}
                    onChange={e => setNewStaffDept(e.target.value)}
                    placeholder="District Skill Mission"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">District / Jurisdiction</label>
                  <input
                    type="text"
                    value={newStaffDist}
                    onChange={e => setNewStaffDist(e.target.value)}
                    placeholder="Pune"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProvisionStaffOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingStaff}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {creatingStaff ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE STAFF, RESET PASSWORD, SUSPEND & TOGGLE PERMISSIONS */}
      {isManageStaffOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Manage Administrator: {selectedStaff.email}</span>
                </h3>
                <p className="text-[11px] text-slate-400">Role: <b className="uppercase text-indigo-400">{selectedStaff.role}</b> • @{selectedStaff.username}</p>
              </div>
              <button 
                onClick={() => setIsManageStaffOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suspension & Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between transition ${
              selectedStaff.is_active !== false
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${selectedStaff.is_active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <div>
                  <p className="text-xs font-bold text-white">
                    Account Status: {selectedStaff.is_active !== false ? 'Active & Authorized' : 'Suspended (Access Blocked)'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {selectedStaff.is_active !== false ? 'Admin has active console and mutation privileges' : 'Admin is blocked from signing in or mutating platform data'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleStaffStatus(selectedStaff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md ${
                  selectedStaff.is_active !== false
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedStaff.is_active !== false ? 'Suspend Admin' : 'Reactivate Admin'}
              </button>
            </div>

            {/* Password Reset Form */}
            <form onSubmit={handleResetStaffPassword} className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
              <label className="text-slate-300 font-bold block">Reset Security Password</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetStaffPass}
                  onChange={e => setResetStaffPass(e.target.value)}
                  placeholder="Enter new password (min 6)"
                  className="flex-1 bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={resettingPass}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                >
                  {resettingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                  <span>Change</span>
                </button>
              </div>
            </form>

            {/* Granular Permissions Toggles */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-bold block">Granular Feature Access Matrix (SuperAdmin Control)</label>
                <span className="text-[10px] text-blue-400 font-mono">12 Modules</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'can_verify_trainees', label: 'KYC Document Verification' },
                  { key: 'can_edit_trainees', label: 'Trainee Profile & Wage Overrides' },
                  { key: 'can_manage_workforce', label: 'AI Workforce Suite & Demand' },
                  { key: 'can_broadcast_sms', label: 'SMS & WhatsApp Broadcasts' },
                  { key: 'can_manage_melawas', label: 'Rozgar Melawas & QR Passes' },
                  { key: 'can_audit_centers', label: 'ITI Infrastructure Auditor' },
                  { key: 'can_disburse_dbt', label: 'Direct Benefit Transfer (DBT)' },
                  { key: 'can_edit_schemes', label: 'Government Welfare Schemes' },
                  { key: 'can_edit_courses', label: 'NPTEL Course Catalog' },
                  { key: 'can_edit_assessments', label: 'Skill Assessments & Badges' },
                  { key: 'can_publish_analytics', label: 'Analytics & Policy Simulator' },
                  { key: 'can_manage_users', label: 'Sub-Admin Staff Management' },
                ].map((perm) => {
                  const isGranted = selectedStaff.permissions?.[perm.key] ?? true;
                  return (
                    <button
                      key={perm.key}
                      type="button"
                      onClick={() => handleToggleStaffPermission(selectedStaff, perm.key)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isGranted 
                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="truncate pr-2">{perm.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                        isGranted ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isGranted ? 'ALLOWED' : 'REVOKED'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleDeleteStaff(selectedStaff)}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Purge Staff Account
              </button>
              <button
                type="button"
                onClick={() => setIsManageStaffOpen(false)}
                className="px-5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL CANDIDATE PROFILE & EMPLOYMENT MODIFICATION */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span>Modify Candidate Record & Outcomes</span>
                </h3>
                <p className="text-[11px] text-slate-400">Directly override and update identity, academic background, verified skills, and employment details</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTraineeEdit} className="space-y-5 text-xs">
              
              {/* Section 1: Personal & KYC */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Personal Identity & KYC Data</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.full_name}
                      onChange={e => setEditFormData({ ...editFormData, full_name: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">District</label>
                    <input
                      type="text"
                      value={editFormData.district}
                      onChange={e => setEditFormData({ ...editFormData, district: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Masked Aadhaar</label>
                    <input
                      type="text"
                      value={editFormData.aadhaar_masked}
                      onChange={e => setEditFormData({ ...editFormData, aadhaar_masked: e.target.value })}
                      placeholder="XXXX-XXXX-1234"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editFormData.dob}
                      onChange={e => setEditFormData({ ...editFormData, dob: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Profile Avatar URL</label>
                    <input
                      type="url"
                      value={editFormData.avatar_url}
                      onChange={e => setEditFormData({ ...editFormData, avatar_url: e.target.value })}
                      placeholder="https://.../avatar.jpg"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Verified Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={editFormData.skills}
                    onChange={e => setEditFormData({ ...editFormData, skills: e.target.value })}
                    placeholder="CNC Milling, Solar PV Installation, Electrical Wiring"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Section 2: Occupational Status & Outcomes */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span>Occupational Status & Employment Records</span>
                </h4>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Employment Pathway</label>
                  <select
                    value={editFormData.emp_status}
                    onChange={e => setEditFormData({ ...editFormData, emp_status: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-blue-500 outline-none font-bold"
                  >
                    <option value="employed">Wage Employed (Formal/Organized Sector)</option>
                    <option value="self_employed">Self-Employed (Micro-Enterprise / MSME)</option>
                    <option value="not_employed">Seeking Placement (Unemployed)</option>
                  </select>
                </div>

                {/* Conditional Fields: Wage Employed */}
                {editFormData.emp_status === 'employed' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Company / Employer</label>
                      <input
                        type="text"
                        value={editFormData.company_name}
                        onChange={e => setEditFormData({ ...editFormData, company_name: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Designation</label>
                      <input
                        type="text"
                        value={editFormData.designation}
                        onChange={e => setEditFormData({ ...editFormData, designation: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Monthly Salary (₹)</label>
                      <input
                        type="number"
                        value={editFormData.monthly_salary}
                        onChange={e => setEditFormData({ ...editFormData, monthly_salary: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Self-Employed */}
                {editFormData.emp_status === 'self_employed' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Business Name</label>
                      <input
                        type="text"
                        value={editFormData.business_name}
                        onChange={e => setEditFormData({ ...editFormData, business_name: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Monthly Turnover (₹)</label>
                      <input
                        type="number"
                        value={editFormData.monthly_revenue}
                        onChange={e => setEditFormData({ ...editFormData, monthly_revenue: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Net Monthly Profit (₹)</label>
                      <input
                        type="number"
                        value={editFormData.monthly_profit}
                        onChange={e => setEditFormData({ ...editFormData, monthly_profit: e.target.value })}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Seeking Placement */}
                {editFormData.emp_status === 'not_employed' && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Non-Placement Reason</label>
                        <select
                          value={editFormData.unemployed_reason}
                          onChange={e => setEditFormData({ ...editFormData, unemployed_reason: e.target.value })}
                          className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                        >
                          <option value="lack_of_local_vacancies">Lack of local vacancies in specialized trade</option>
                          <option value="higher_education">Pursuing higher education / competitive exams</option>
                          <option value="wage_mismatch">Offered wages lower than living expenses</option>
                          <option value="relocation_constraints">Relocation / commute travel constraints</option>
                          <option value="skill_gap_tools">Need modern industrial tool upskilling</option>
                          <option value="other">Other personal circumstances</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 font-bold block mb-1">Requested SSDM Support</label>
                        <input
                          type="text"
                          value={editFormData.support_needed}
                          onChange={e => setEditFormData({ ...editFormData, support_needed: e.target.value })}
                          placeholder="State Rozgar Melawa"
                          className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Candidate's Perspective & Statement</label>
                      <textarea
                        rows={2}
                        value={editFormData.unemployed_perspective}
                        onChange={e => setEditFormData({ ...editFormData, unemployed_perspective: e.target.value })}
                        placeholder="Candidate statement..."
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Manual Verification Override */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>State Verification & Evaluator Seal</span>
                </h4>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.is_verified}
                      onChange={e => setEditFormData({ ...editFormData, is_verified: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-200 font-bold">Approve & Grant "🛡️ Data Verified" State Badge</span>
                  </label>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Verification Audit Notes</label>
                  <input
                    type="text"
                    value={editFormData.verification_notes}
                    onChange={e => setEditFormData({ ...editFormData, verification_notes: e.target.value })}
                    placeholder="e.g. Identity and trade certificate verified against MSME registry"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save All Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Profile Dossier Slide-Over / Modal */}
      {selectedTrainee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-[#0a1020] border-l border-slate-800 w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right">
            
            {/* Header / Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Candidate Dossier
              </span>
              <button 
                onClick={() => setSelectedTrainee(null)}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Hero Header */}
            <div className="flex items-center space-x-4">
              {selectedTrainee.avatar_url ? (
                <img 
                  src={selectedTrainee.avatar_url} 
                  alt={selectedTrainee.full_name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white text-2xl font-black flex items-center justify-center shadow-lg flex-shrink-0">
                  {(selectedTrainee.full_name || 'T').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{selectedTrainee.full_name || 'Unnamed Trainee'}</h2>
                <p className="text-xs font-mono text-blue-400">ID: {selectedTrainee.trainee_id} • @{selectedTrainee.username || 'trainee'}</p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md">
                    Profile: {selectedTrainee.profile_completion_pct || 50}%
                  </span>
                  {selectedTrainee.is_verified ? (
                    <span 
                      title={`Verified by ${selectedTrainee.verified_by || 'SSDM Evaluator'} on ${selectedTrainee.verified_at ? new Date(selectedTrainee.verified_at).toLocaleDateString('en-IN') : 'Recent'}`}
                      className="inline-flex items-center px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold rounded-md border border-emerald-500/40"
                    >
                      🛡️ SSDM Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-md border border-amber-500/40">
                      ⏳ Pending Verification
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-slate-500 block">Email Address</span>
                <span className="text-slate-200 font-semibold">{selectedTrainee.email}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block">Phone Number</span>
                <span className="text-slate-200 font-semibold">{selectedTrainee.phone || 'Not Provided'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block">District & State</span>
                <span className="text-slate-200 font-semibold">{selectedTrainee.district || 'District not recorded'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block">Masked Aadhaar</span>
                <span className="text-slate-200 font-mono font-semibold">{selectedTrainee.aadhaar_masked || 'Not Recorded'}</span>
              </div>
            </div>

            {/* Skills & Endorsements */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center">
                <Award className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                <span>Verified Skills & Competencies</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTrainee.skills && selectedTrainee.skills.length > 0 ? (
                  selectedTrainee.skills.map((s: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-lg">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No prior vocational skill / Entry-level beginner</span>
                )}
              </div>
            </div>

            {/* Academic Credentials */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                <span>Academic & Vocational Background</span>
              </h4>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
                <p className="font-bold text-white">{selectedTrainee.highest_education || 'Qualification Not Specified'}</p>
                <p className="text-slate-400">
                  {selectedTrainee.board_university ? `${selectedTrainee.board_university} • Year ${selectedTrainee.year_of_passing || 'N/A'}` : 'Board / University: Not Specified'}
                </p>
                <span className="text-emerald-400 font-bold text-[11px]">
                  {selectedTrainee.education_percentage ? `Score: ${selectedTrainee.education_percentage}%` : 'Score: Evaluation Pending'}
                </span>
              </div>
            </div>

            {/* Occupational Status & Outcomes */}
            {traineeEmployment && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
                  <span>Occupational Status & Outcomes</span>
                </h4>

                {traineeEmployment.status === 'employed' && (
                  <div className="p-3 bg-slate-900/60 border border-blue-900/40 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold uppercase text-[10px]">Wage Employed</span>
                      <span className="font-bold text-emerald-400">₹{Number(traineeEmployment.monthly_salary || 0).toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company:</span>
                      <span className="font-bold text-white">{traineeEmployment.company_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Designation:</span>
                      <span className="text-slate-200">{traineeEmployment.designation || 'N/A'}</span>
                    </div>
                    {traineeEmployment.pf_esic_number && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">PF/ESIC UAN:</span>
                        <span className="font-mono text-slate-300">{traineeEmployment.pf_esic_number}</span>
                      </div>
                    )}
                  </div>
                )}

                {traineeEmployment.status === 'self_employed' && (
                  <div className="p-3 bg-slate-900/60 border border-indigo-900/40 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-bold uppercase text-[10px]">Micro-Enterprise</span>
                      <span className="font-bold text-emerald-400">Profit: ₹{Number(traineeEmployment.monthly_profit || 0).toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Business Name:</span>
                      <span className="font-bold text-white">{traineeEmployment.business_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Turnover:</span>
                      <span className="font-bold text-emerald-400">₹{Number(traineeEmployment.monthly_revenue || 0).toLocaleString()}</span>
                    </div>
                    {traineeEmployment.udyam_number && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Udyam Registration:</span>
                        <span className="font-mono text-blue-400">{traineeEmployment.udyam_number}</span>
                      </div>
                    )}
                  </div>
                )}

                {traineeEmployment.status === 'not_employed' && (
                  <div className="p-3 bg-slate-900/60 border border-amber-900/40 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold uppercase text-[10px]">Seeking Placement</span>
                      <span className="text-slate-400 text-[10px]">Timeline: {traineeEmployment.target_workforce_timeline || 'Immediate'}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block text-[11px]">Primary Barrier:</span>
                      <span className="font-bold text-amber-300">{traineeEmployment.unemployed_reason?.replace(/_/g, ' ') || 'Seeking job vacancies'}</span>
                    </div>
                    {traineeEmployment.unemployed_perspective && (
                      <div className="pt-1 text-[11px] text-slate-300 border-t border-slate-800">
                        <span className="text-slate-400 font-bold block">Candidate's Perspective:</span>
                        <p className="italic text-slate-300 mt-0.5">"{traineeEmployment.unemployed_perspective}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              
              <button
                onClick={() => openEditModal(selectedTrainee, traineeEmployment)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Complete Profile & Outcome Data</span>
              </button>

              <button
                onClick={() => handleToggleVerifyTrainee(selectedTrainee)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedTrainee.is_verified
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{selectedTrainee.is_verified ? 'Revoke Verification' : '🛡️ Approve & Stamp Data Verified'}</span>
              </button>

              <button
                onClick={() => {
                  setNotifTarget('single');
                  setTargetTrainee(selectedTrainee);
                  setIsNotifModalOpen(true);
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Send Direct Notification</span>
              </button>
              
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleSuspendTrainee(selectedTrainee.id, selectedTrainee.is_active !== false, selectedTrainee.email)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {selectedTrainee.is_active !== false ? 'Suspend Account' : 'Reactivate Account'}
                </button>
                <button
                  onClick={() => setUserToDelete(selectedTrainee)}
                  className="py-2 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DestructiveConfirmModal
        isOpen={!!userToDelete}
        title="Permanently Purge Trainee Record"
        itemName={userToDelete?.full_name || userToDelete?.email || 'Candidate'}
        warningMessage={`Are you sure you want to completely remove the candidate record for "${userToDelete?.full_name || userToDelete?.email}" (ID: ${userToDelete?.trainee_id})? This action cannot be undone.`}
        requiredWord="DELETE"
        onConfirm={confirmDeleteTrainee}
        onClose={() => setUserToDelete(null)}
      />

    </div>
  );
}
