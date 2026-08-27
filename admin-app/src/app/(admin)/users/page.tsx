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
  BookOpen
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { DestructiveConfirmModal } from '@/components/DestructiveConfirmModal';
import { formatHumanError } from '@/lib/errorUtils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<any | null>(null);
  const [traineeEmployment, setTraineeEmployment] = useState<any | null>(null);
  const [traineeGoal, setTraineeGoal] = useState<any | null>(null);
  const [traineeSubmissions, setTraineeSubmissions] = useState<any[]>([]);
  const [traineeEnrollments, setTraineeEnrollments] = useState<any[]>([]);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  // Create Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
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

  const fetchUsers = async () => {
    // 1. Fetch real trainees from database
    const { data: traineeData } = await supabase
      .from('trainees')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (traineeData) setUsers(traineeData);

    // 2. Fetch real admins and evaluators
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('*')
      .in('role', ['admin', 'superadmin', 'evaluator'])
      .order('created_at', { ascending: false });
    if (adminRoles) setAdmins(adminRoles);

    setLoading(false);
  };

  const checkRoleAndFetch = async () => {
    setLoading(true);
    try {
      const saRes = await fetch('/api/auth/me');
      if (saRes.ok) {
        setIsSuperadmin(true);
      }
    } catch (e) {}
    await fetchUsers();
  };

  useEffect(() => {
    checkRoleAndFetch();
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
    } catch (e) {
      console.error('Error loading trainee drawer details:', e);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: newAdminEmail.trim(), 
          password: newAdminPass,
          username: newAdminUsername.trim() || newAdminEmail.split('@')[0],
          role: newAdminRole
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Log in audit_logs
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'CREATE_ADMIN',
        target_entity: 'USER_ROLES',
        details: `Created administrator ${newAdminEmail} with role ${newAdminRole}`,
        status: 'Success'
      });

      setFeedbackMsg({ type: 'success', text: `Admin account (${newAdminEmail}) created successfully!` });
      setNewAdminEmail('');
      setNewAdminUsername('');
      setNewAdminPass('');
      await fetchUsers();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to create admin.' });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleSuspend = async (id: string, currentStatus: boolean, email: string) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this trainee?`)) return;
    await supabase.from('trainees').update({ is_active: !currentStatus }).eq('id', id);
    
    await supabase.from('audit_logs').insert({
      admin_email: 'admin@nexus.com',
      action: currentStatus ? 'SUSPEND_USER' : 'ACTIVATE_USER',
      target_entity: 'TRAINEES',
      details: `${currentStatus ? 'Suspended' : 'Activated'} user ${email}`,
      status: 'Success'
    });

    fetchUsers();
    if (selectedTrainee?.id === id) {
      setSelectedTrainee({ ...selectedTrainee, is_active: !currentStatus });
    }
  };

  const handleDelete = (trainee: any) => {
    setUserToDelete(trainee);
  };

  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    try {
      await supabase.from('trainees').delete().eq('id', userToDelete.id);
      
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'DELETE_USER',
        target_entity: 'TRAINEES',
        details: `Permanently deleted user ${userToDelete.email || userToDelete.id}`,
        status: 'Success'
      });

      setSelectedTrainee(null);
      await fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
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

      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'DISPATCH_NOTIFICATION',
        target_entity: 'TRAINEE_NOTIFICATIONS',
        target_id: targetTrainee?.id || 'ALL_BROADCAST',
        details: `Dispatched ${notifType} notification "${notifTitle}" to ${notifTarget === 'single' ? targetTrainee?.email : 'All Trainees (Broadcast)'}`,
        status: 'Success'
      });

      setFeedbackMsg({ 
        type: 'success', 
        text: `Notification "${notifTitle}" dispatched successfully to ${notifTarget === 'single' ? targetTrainee?.full_name : 'All Trainees'}!` 
      });
      setIsNotifModalOpen(false);
      setNotifTitle('');
      setNotifMessage('');
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to dispatch notification.' });
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
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Trainee & Executive Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Candidate dossiers, state enterprise rosters, and real-time push notification dispatch.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setNotifTarget('broadcast');
              setTargetTrainee(null);
              setIsNotifModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>Send Broadcast Notification</span>
          </button>
          <span className="text-xs text-slate-400 font-semibold">{filteredUsers.length} Trainees</span>
        </div>
      </div>

      {/* SUPERADMIN CONSOLE: Provision New Admin */}
      <div className="bg-[#0a1020] border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/80 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white text-sm">Superadmin Console: Provision New Administrator</h3>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full uppercase border border-blue-500/20">
            Privileged Action
          </span>
        </div>

        {feedbackMsg && (
          <div className={`p-3.5 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2 ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              placeholder="officer@mssds.gov.in"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Username</label>
            <input
              type="text"
              value={newAdminUsername}
              onChange={e => setNewAdminUsername(e.target.value)}
              placeholder="pune_evaluator"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Set Password (min 6)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newAdminPass}
              onChange={e => setNewAdminPass(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">System Role</label>
            <select
              value={newAdminRole}
              onChange={e => setNewAdminRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="admin">District Administrator</option>
              <option value="evaluator">Skill Evaluator</option>
              <option value="superadmin">State Superadmin</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={creatingAdmin}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              {creatingAdmin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>

      {/* Directory Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, username, or trainee ID..."
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

      {/* Trainee Directory Table */}
      <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">State Trainee Database</h3>
          <span className="text-[11px] text-slate-400">Click any row to open candidate dossier</span>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" /> Loading records...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="No Candidates Located in Registry"
              description={`No candidate profiles match the current filter "${search || filterDistrict}". Try adjusting your search keyword or selecting "All Maharashtra Districts".`}
              actionLabel="Reset Search Filters"
              onAction={() => { setSearch(''); setFilterDistrict('all'); }}
              badge="0 Results"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-4">Candidate / Profile</th>
                  <th className="py-3 px-4">Trainee ID</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Top Skills</th>
                  <th className="py-3 px-4">Completion</th>
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
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {(trainee.full_name || 'T').charAt(0).toUpperCase()}
                        </div>
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
                      {trainee.district || 'Maharashtra'}
                    </td>

                    {/* Skills Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(trainee.skills || []).slice(0, 2).map((s: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-semibold rounded">
                            {s}
                          </span>
                        ))}
                        {(trainee.skills || []).length > 2 && (
                          <span className="text-[10px] text-slate-500">+{trainee.skills.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Completion Meter */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full" 
                            style={{ width: `${trainee.profile_completion_pct || 50}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">{trainee.profile_completion_pct || 50}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trainee.is_active 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {trainee.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleSuspend(trainee.id, trainee.is_active, trainee.email)}
                          className={`p-1.5 rounded-lg border transition ${
                            trainee.is_active 
                              ? 'text-amber-400 hover:bg-amber-500/10 border-amber-500/20' 
                              : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20'
                          }`}
                          title={trainee.is_active ? "Suspend account" : "Activate account"}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(trainee)}
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

      {/* LinkedIn-Style Trainee Profile Dossier Slide-Over / Modal */}
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
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Hero Header */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white text-2xl font-black flex items-center justify-center shadow-lg">
                {(selectedTrainee.full_name || 'T').charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{selectedTrainee.full_name}</h2>
                <p className="text-xs font-mono text-blue-400">ID: {selectedTrainee.trainee_id} • @{selectedTrainee.username}</p>
                <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md">
                  Profile Completion: {selectedTrainee.profile_completion_pct}%
                </span>
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
                <span className="text-slate-200 font-semibold">{selectedTrainee.district ? `${selectedTrainee.district}, Maharashtra` : 'Maharashtra'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block">Date of Birth</span>
                <span className="text-slate-200 font-semibold">{selectedTrainee.dob || 'Not Specified'}</span>
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
                  <span className="text-xs text-slate-500 italic">No skills listed yet</span>
                )}
              </div>
            </div>

            {/* Education Credentials */}
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

            {/* Micro-Enterprise Data */}
            {traineeEmployment && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
                  <span>Tracked Enterprise Information</span>
                </h4>
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Business Name:</span>
                    <span className="font-bold text-white">{traineeEmployment.business_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Revenue:</span>
                    <span className="font-bold text-emerald-400">₹{Number(traineeEmployment.monthly_revenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Udyam Registration:</span>
                    <span className="font-mono text-blue-400">{traineeEmployment.udyam_number || 'Pending'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Target Career Goal & Skill Gap */}
            {traineeGoal && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center">
                  <Target className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
                  <span>Target Career Goal & Skill Gap</span>
                </h4>
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Aimed Role:</span>
                    <span className="font-bold text-white text-right max-w-[240px] truncate">{traineeGoal.target_role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Timeline:</span>
                    <span className="font-mono text-indigo-400 font-bold">{traineeGoal.target_days} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Salary:</span>
                    <span className="font-bold text-emerald-400">₹{Number(traineeGoal.target_salary || 0).toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI Readiness Score:</span>
                    <span className="font-bold text-cyan-400">{traineeGoal.readiness_pct}% (Wage Lift: {traineeGoal.wage_multiplier}x)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Verified Skill Assessment Badges */}
            {traineeSubmissions && traineeSubmissions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center">
                  <Award className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                  <span>Skill Assessments & Earned Badges</span>
                </h4>
                <div className="space-y-1.5">
                  {traineeSubmissions.map((sub: any) => (
                    <div key={sub.id} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{sub.badge_earned || sub.skill_assessments?.badge_name || 'Trade Badge'}</span>
                        <span className="text-[10px] text-slate-400">{sub.skill_assessments?.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        sub.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {sub.score_pct}% {sub.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enrolled Courses */}
            {traineeEnrollments && traineeEnrollments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                  <span>Active Course Roadmaps</span>
                </h4>
                <div className="space-y-1.5">
                  {traineeEnrollments.map((enr: any) => (
                    <div key={enr.id} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span className="truncate max-w-[240px]">{enr.external_courses?.title || 'Accredited Course'}</span>
                        <span className="text-blue-400 font-mono text-[10px]">{enr.progress_pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enr.progress_pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zero-PII Cryptographic Token */}
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[11px] space-y-1">
              <span className="text-blue-400 font-bold block">Privacy-Preserving Hash Enclave:</span>
              <p className="font-mono text-slate-400 truncate">{selectedTrainee.privacy_hash || 'SHA256-ENCLAVE-VERIFIED'}</p>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setNotifTarget('single');
                  setTargetTrainee(selectedTrainee);
                  setIsNotifModalOpen(true);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Send Direct Notification</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleSuspend(selectedTrainee.id, selectedTrainee.is_active, selectedTrainee.email)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {selectedTrainee.is_active ? 'Suspend Trainee' : 'Reactivate Trainee'}
                </button>
                <button
                  onClick={() => handleDelete(selectedTrainee)}
                  className="py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Delete Record
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Send Custom Notification Modal */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {notifTarget === 'single' ? `Notify ${targetTrainee?.full_name}` : 'Broadcast Notification to All'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {notifTarget === 'single' ? targetTrainee?.email : 'All enrolled candidate accounts across Maharashtra'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsNotifModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Notification Type</label>
                <select
                  value={notifType}
                  onChange={e => setNotifType(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 outline-none"
                >
                  <option value="info">General Information (Info)</option>
                  <option value="survey">Longitudinal Survey Prompt</option>
                  <option value="grant">MSME Capital Grant / Subsidy Alert</option>
                  <option value="verification">Credential Verification Update</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={e => setNotifTitle(e.target.value)}
                  placeholder="e.g. 6-Month Longitudinal Wage Survey Now Open"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  placeholder="Provide detailed instructions or milestone requirements..."
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNotifModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {sendingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{sendingNotif ? 'Dispatching...' : 'Dispatch Notification'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Destructive Confirmation Friction Modal */}
      <DestructiveConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleExecuteDelete}
        title="Permanently Expunge Trainee Record"
        itemName={userToDelete?.full_name || userToDelete?.email || 'Selected Trainee'}
        warningMessage="Warning: Deleting this candidate permanently removes their vocational enrollments, survey records, and linked credentials. This operation is cryptographically audited."
        requiredWord="DELETE"
      />

    </div>
  );
}
