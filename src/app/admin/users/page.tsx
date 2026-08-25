'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Search, Edit, Trash2, Ban, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('trainees').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setUsers(data);
    setLoading(false);
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
          <p className="text-sm text-slate-400 mt-1">Modify, suspend, or delete trainee accounts.</p>
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

      <div className="bg-[#0e1628] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Trainee</th>
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
                        <button className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
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
