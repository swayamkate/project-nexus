'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Search, Edit, Trash2, Ban, Loader2, UserPlus, Shield, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const supabase = createClient();

  // Create Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleSuspend = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this trainee?`)) return;
    await supabase.from('trainees').update({ is_active: !currentStatus }).eq('id', id);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('CRITICAL ACTION: Are you sure you want to permanently remove this user record?')) return;
    await supabase.from('trainees').delete().eq('id', id);
    fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.trainee_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">User & Role Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage system administrators, evaluators, and registered trainee profiles.
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 bg-[#0e1628] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Superadmin Controls: Add New Admin */}
      {isSuperadmin && (
        <div className="bg-gradient-to-r from-blue-950/40 via-[#0e1628] to-purple-950/40 border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Superadmin Console: Provision New Administrator</h2>
              <p className="text-xs text-slate-400">Add sub-admins or state evaluators with granular access roles.</p>
            </div>
          </div>

          {feedbackMsg && (
            <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
              feedbackMsg.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Admin Email</label>
              <input 
                type="email" 
                required 
                value={newAdminEmail} 
                onChange={e => setNewAdminEmail(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                placeholder="officer@nexus.gov.in" 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Username</label>
              <input 
                type="text" 
                value={newAdminUsername} 
                onChange={e => setNewAdminUsername(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                placeholder="e.g. pune_officer" 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Assigned Role</label>
              <select
                value={newAdminRole}
                onChange={e => setNewAdminRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="admin">System Admin</option>
                <option value="evaluator">District Evaluator</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Temporary Password</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  required 
                  minLength={6} 
                  value={newAdminPass} 
                  onChange={e => setNewAdminPass(e.target.value)} 
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                  placeholder="••••••••" 
                />
                <button 
                  type="submit" 
                  disabled={creatingAdmin} 
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center space-x-1.5 transition disabled:opacity-70 text-xs shadow-lg shadow-blue-600/20"
                >
                  {creatingAdmin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>Add</span>
                </button>
              </div>
            </div>
          </form>

          {/* Active Admins Badge List */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-2">Configured Admins:</span>
            {admins.map(adm => (
              <span key={adm.id} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center space-x-1.5">
                <Key className="w-3 h-3 text-blue-400" />
                <span className="font-bold text-white">{adm.email}</span>
                <span className="text-[10px] text-blue-400 uppercase font-mono">({adm.role})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trainees List Table */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Registered Trainees ({users.length})</h3>
          <span className="text-xs text-slate-500 font-mono">PostgreSQL Database Source</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Trainee</th>
                <th className="py-4 px-6 font-semibold">Email & Phone</th>
                <th className="py-4 px-6 font-semibold">District</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No registered trainees found. Newly registered users will appear here automatically.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{user.full_name || user.username || 'Anonymous'}</div>
                      <div className="text-xs text-blue-400 font-mono mt-0.5">{user.trainee_id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-200">{user.email}</div>
                      <div className="text-xs text-slate-500">{user.phone || 'No phone recorded'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-slate-300">{user.district || 'Not Specified'}</div>
                    </td>
                    <td className="py-4 px-6">
                      {user.is_active ? (
                        <span className="text-emerald-400 text-[10px] font-bold bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="text-rose-400 text-[10px] font-bold bg-rose-400/10 border border-rose-400/20 px-2 py-1 rounded-md uppercase tracking-wider">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleSuspend(user.id, user.is_active ?? true)} 
                          className="p-2 bg-slate-900 hover:bg-amber-600/20 border border-slate-800 hover:border-amber-500/30 rounded-lg text-slate-400 hover:text-amber-400 transition" 
                          title={user.is_active ? 'Suspend Account' : 'Activate Account'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 bg-slate-900 hover:bg-rose-600/20 border border-slate-800 hover:border-rose-500/30 rounded-lg text-slate-400 hover:text-rose-400 transition" 
                          title="Delete User Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
