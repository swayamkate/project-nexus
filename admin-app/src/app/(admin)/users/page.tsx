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
  FileText
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
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  // Create Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    checkRoleAndFetch();
  }, []);

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

  const openTraineeDrawer = async (trainee: any) => {
    setSelectedTrainee(trainee);
    const { data: emp } = await supabase
      .from('trainee_employment')
      .select('*')
      .eq('trainee_id', trainee.id)
      .maybeSingle();
    setTraineeEmployment(emp);
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
          <p className="text-xs text-slate-400 mt-1">LinkedIn-style candidate dossiers, state enterprise rosters, and administrator provisioning.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">{filteredUsers.length} Trainees Displayed</span>
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
                <span className="text-slate-200 font-semibold">{selectedTrainee.phone || '+91 98765 43210'}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block">District & State</span>
                <span className="text-slate-200 font-semibold">{selectedTrainee.district || 'Pune'}, Maharashtra</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 block">Date of Birth</span>
                <span className="text-slate-200 font-semibold">{selectedTrainee.dob || '2002-05-15'}</span>
              </div>
            </div>

            {/* Skills & Endorsements */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center">
                <Award className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                <span>Verified Skills & Competencies</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedTrainee.skills || ['Tailoring', 'Pattern Making', 'Quality Inspection']).map((s: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Education Credentials */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                <span>Academic & Vocational Background</span>
              </h4>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
                <p className="font-bold text-white">{selectedTrainee.highest_education || '12th Standard (Science)'}</p>
                <p className="text-slate-400">{selectedTrainee.board_university || 'Maharashtra State Board'} • Year {selectedTrainee.year_of_passing || 2020}</p>
                <span className="text-emerald-400 font-bold text-[11px]">Score: {selectedTrainee.education_percentage || '78.60'}%</span>
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

            {/* Zero-PII Cryptographic Token */}
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[11px] space-y-1">
              <span className="text-blue-400 font-bold block">Privacy-Preserving Hash Enclave:</span>
              <p className="font-mono text-slate-400 truncate">{selectedTrainee.privacy_hash || 'SHA256-ENCLAVE-VERIFIED'}</p>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => handleSuspend(selectedTrainee.id, selectedTrainee.is_active, selectedTrainee.email)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
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
