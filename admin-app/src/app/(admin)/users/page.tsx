'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Search, Edit, Trash2, Ban, Loader2, UserPlus, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const supabase = createClient();

  // Create Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    checkRoleAndFetch();
  }, []);

  const checkRoleAndFetch = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      if (roleData?.role === 'superadmin') {
        setIsSuperadmin(true);
      }
    }
    await fetchUsers();
  };

  const fetchUsers = async () => {
    // Fetch normal trainees
    const { data: traineeData } = await supabase.from('trainees').select('*').order('created_at', { ascending: false }).limit(50);
    if (traineeData) setUsers(traineeData);

    // Fetch admins
    const { data: adminRoles } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
    if (adminRoles && adminRoles.length > 0) {
      // For prototype, we mock the admin display since we can't query auth.users directly from client
      setAdmins(adminRoles.map((r, i) => ({ id: r.user_id, email: `Admin ${i+1} (Hidden by RLS)` })));
    }
    setLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const res = await fetch('/api/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Admin created successfully!');
      setNewAdminEmail('');
      setNewAdminPass('');
      fetchUsers();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDemoteAdmin = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke Admin privileges from this user?')) return;
    try {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
      if (error) throw error;
      alert('Admin privileges revoked.');
      fetchUsers();
    } catch (err: any) {
      alert(`Error revoking admin privileges: ${err.message}`);
    }
  };

  const handleSuspend = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) return;
    await supabase.from('trainees').update({ is_active: !currentStatus }).eq('id', id);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('CRITICAL WARNING: Are you sure you want to permanently delete this user data?')) return;
    await supabase.from('trainees').delete().eq('id', id);
    fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">User Management</h1>
          <p className="text-sm text-slate-400 mt-1">Modify, suspend, or delete accounts.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-[#0e1628] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {isSuperadmin && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Superadmin Controls: Add New Admin</h2>
          </div>
          <form onSubmit={handleCreateAdmin} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
            <div className="w-full sm:flex-1">
              <label className="text-xs text-slate-400 mb-1 block">Admin Email</label>
              <input type="email" required value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="admin@nexus.com" />
            </div>
            <div className="w-full sm:flex-1">
              <label className="text-xs text-slate-400 mb-1 block">Temporary Password</label>
              <input type="password" required minLength={6} value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={creatingAdmin} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-70">
              {creatingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Create Admin</span>
            </button>
          </form>

          <div className="space-y-2 border-t border-blue-500/20 pt-4">
             <h3 className="text-sm font-bold text-white mb-3">Current Admins</h3>
             {admins.length === 0 ? <p className="text-slate-400 text-sm">No admins found.</p> : admins.map(a => (
                <div key={a.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                  <span className="text-white text-sm font-mono">{a.email}</span>
                  <button onClick={() => handleDemoteAdmin(a.id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold px-3 py-1 bg-rose-500/10 rounded-md transition">Revoke Admin</button>
                </div>
             ))}
          </div>
        </div>
      )}

      <div className="bg-[#0e1628] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">User</th>
                <th className="py-4 px-6 font-semibold">Contact</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" /></td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{user.full_name || 'Anonymous'}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{user.trainee_id || user.id.slice(0, 8)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{user.email}</div>
                      <div className="text-xs text-slate-500">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-6">
                      {user.is_active ? (
                        <span className="text-emerald-400 text-[10px] font-bold bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md uppercase tracking-wider">Active</span>
                      ) : (
                        <span className="text-rose-400 text-[10px] font-bold bg-rose-400/10 border border-rose-400/20 px-2 py-1 rounded-md uppercase tracking-wider">Suspended</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleSuspend(user.id, user.is_active ?? true)} className="p-2 bg-slate-800 hover:bg-amber-600 rounded-lg text-slate-400 hover:text-white transition" title={user.is_active ? 'Suspend' : 'Activate'}>
                          <Ban className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 bg-slate-800 hover:bg-rose-600 rounded-lg text-slate-400 hover:text-white transition" title="Delete">
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
