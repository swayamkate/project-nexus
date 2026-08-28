'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

type DistrictRow = {
  id?: string;
  district_name: string;
  total_trained: number | null;
  employed_count: number | null;
  self_employed_count: number | null;
  seeking_count: number | null;
  avg_wage: number | null;
  placement_rate: number | null;
};
type GapRow = { id?: string; skill_name: string; demand_count: number | null; supply_count: number | null; gap_percentage: number | null; priority_level: string };

const inputClass = 'w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white';

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [districts, setDistricts] = useState<DistrictRow[]>([]);
  const [gaps, setGaps] = useState<GapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    const [{ data: districtData }, { data: gapData }] = await Promise.all([
      supabase.from('district_employment_stats').select('*').order('district_name'),
      supabase.from('top_skill_gaps').select('*').order('gap_percentage', { ascending: false }),
    ]);
    setDistricts((districtData || []) as DistrictRow[]);
    setGaps((gapData || []) as GapRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveDistrict = async (row: DistrictRow) => {
    setSaving(true); setMessage('');
    const { id, ...payload } = row;
    const result = id
      ? await supabase.from('district_employment_stats').update(payload).eq('id', id)
      : await supabase.from('district_employment_stats').insert(payload);
    setMessage(result.error ? result.error.message : 'District evidence saved.');
    setSaving(false);
    if (!result.error) load();
  };

  const saveGap = async (row: GapRow) => {
    setSaving(true); setMessage('');
    const { id, ...payload } = row;
    const result = id
      ? await supabase.from('top_skill_gaps').update(payload).eq('id', id)
      : await supabase.from('top_skill_gaps').insert(payload);
    setMessage(result.error ? result.error.message : 'Skill-gap evidence saved.');
    setSaving(false);
    if (!result.error) load();
  };

  const remove = async (table: 'district_employment_stats' | 'top_skill_gaps', id?: string) => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase.from(table).delete().eq('id', id);
    setMessage(error ? error.message : 'Evidence row removed.');
    setSaving(false);
    if (!error) load();
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading analytics evidence…</div>;

  return <div className="space-y-8">
    <div><h1 className="text-2xl font-black text-white flex items-center gap-2"><BarChart3 className="w-6 h-6 text-blue-400" /> Analytics Evidence Registry</h1><p className="text-xs text-slate-400 mt-1">Publish only verified observations used by trainee charts. Empty tables intentionally produce empty charts.</p></div>
    {message && <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">{message}</div>}

    <section className="bg-[#0a1020] border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between"><div><h2 className="font-bold text-white">District employment evidence</h2><p className="text-[11px] text-slate-500">Feeds the district benchmark chart and table.</p></div><button type="button" onClick={() => setDistricts(rows => [...rows, { district_name: '', total_trained: null, employed_count: null, self_employed_count: null, seeking_count: null, avg_wage: null, placement_rate: null }])} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add row</button></div>
      <div className="space-y-3">{districts.map((row, index) => <div key={row.id || `new-${index}`} className="grid grid-cols-2 md:grid-cols-8 gap-2 items-center"><input className={inputClass} placeholder="District" value={row.district_name} onChange={e => setDistricts(rows => rows.map((r, i) => i === index ? { ...r, district_name: e.target.value } : r))} /><input className={inputClass} type="number" placeholder="Trained" value={row.total_trained ?? ''} onChange={e => setDistricts(rows => rows.map((r, i) => i === index ? { ...r, total_trained: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} type="number" step="0.01" placeholder="Placement %" value={row.placement_rate ?? ''} onChange={e => setDistricts(rows => rows.map((r, i) => i === index ? { ...r, placement_rate: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} type="number" step="0.01" placeholder="Avg wage" value={row.avg_wage ?? ''} onChange={e => setDistricts(rows => rows.map((r, i) => i === index ? { ...r, avg_wage: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} type="number" placeholder="Employed" value={row.employed_count ?? ''} onChange={e => setDistricts(rows => rows.map((r, i) => i === index ? { ...r, employed_count: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} type="number" placeholder="Self-employed" value={row.self_employed_count ?? ''} onChange={e => setDistricts(rows => rows.map((r, i) => i === index ? { ...r, self_employed_count: e.target.value === '' ? null : Number(e.target.value) } : r))} /><button type="button" disabled={saving || !row.district_name.trim()} onClick={() => saveDistrict(row)} className="px-2 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-40"><Save className="w-3.5 h-3.5 mx-auto" /></button><button type="button" disabled={saving || !row.id} onClick={() => remove('district_employment_stats', row.id)} className="px-2 py-2 rounded-lg bg-rose-600/80 text-white text-xs font-bold disabled:opacity-40"><Trash2 className="w-3.5 h-3.5 mx-auto" /></button></div>)}</div>
      {districts.length === 0 && <p className="text-xs text-slate-500 text-center py-5">No district evidence published.</p>}
    </section>

    <section className="bg-[#0a1020] border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between"><div><h2 className="font-bold text-white">Skill-gap evidence</h2><p className="text-[11px] text-slate-500">Feeds the high-demand skill shortage chips.</p></div><button type="button" onClick={() => setGaps(rows => [...rows, { skill_name: '', demand_count: null, supply_count: null, gap_percentage: null, priority_level: 'High' }])} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add row</button></div>
      <div className="space-y-3">{gaps.map((row, index) => <div key={row.id || `new-${index}`} className="grid grid-cols-2 md:grid-cols-7 gap-2 items-center"><input className={inputClass} placeholder="Skill name" value={row.skill_name} onChange={e => setGaps(rows => rows.map((r, i) => i === index ? { ...r, skill_name: e.target.value } : r))} /><input className={inputClass} type="number" placeholder="Demand" value={row.demand_count ?? ''} onChange={e => setGaps(rows => rows.map((r, i) => i === index ? { ...r, demand_count: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} type="number" placeholder="Supply" value={row.supply_count ?? ''} onChange={e => setGaps(rows => rows.map((r, i) => i === index ? { ...r, supply_count: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} type="number" step="0.01" placeholder="Gap %" value={row.gap_percentage ?? ''} onChange={e => setGaps(rows => rows.map((r, i) => i === index ? { ...r, gap_percentage: e.target.value === '' ? null : Number(e.target.value) } : r))} /><input className={inputClass} placeholder="Priority" value={row.priority_level} onChange={e => setGaps(rows => rows.map((r, i) => i === index ? { ...r, priority_level: e.target.value } : r))} /><button type="button" disabled={saving || !row.skill_name.trim()} onClick={() => saveGap(row)} className="px-2 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-40"><Save className="w-3.5 h-3.5 mx-auto" /></button><button type="button" disabled={saving || !row.id} onClick={() => remove('top_skill_gaps', row.id)} className="px-2 py-2 rounded-lg bg-rose-600/80 text-white text-xs font-bold disabled:opacity-40"><Trash2 className="w-3.5 h-3.5 mx-auto" /></button></div>)}</div>
      {gaps.length === 0 && <p className="text-xs text-slate-500 text-center py-5">No skill-gap evidence published.</p>}
    </section>
  </div>;
}
