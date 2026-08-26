'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  CreditCard, 
  CheckCircle2, 
  Trash2, 
  Loader2, 
  X, 
  Sparkles,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

export default function AdminBillingPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Promo Form State
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_val: '100% OFF',
    max_uses: 500,
    district: 'All Districts'
  });

  const supabase = createClient();

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPromos(data);
    setLoading(false);
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanCode = formData.code.trim().toUpperCase();
      const { error } = await supabase.from('promo_codes').insert({
        ...formData,
        code: cleanCode
      });
      if (error) throw error;

      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'CREATE_PROMO_CODE',
        target_entity: 'PROMO_CODES',
        details: `Created promotional access code ${cleanCode} (${formData.discount_val})`,
        status: 'Success'
      });

      setToastMsg(`Promo Code ${cleanCode} created successfully!`);
      setShowModal(false);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchPromos();
    } catch (err: any) {
      setToastMsg('Error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromo = async (id: string, code: string) => {
    try {
      await supabase.from('promo_codes').delete().eq('id', id);
      setToastMsg(`Deleted promo code ${code}`);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchPromos();
    } catch (err: any) {
      setToastMsg('Delete error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Promo Codes & Subscription Grants</h1>
          <p className="text-xs text-slate-400 mt-1">Manage enterprise access codes and government billing subsidies from PostgreSQL.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              code: 'MAHA-SKILL-' + Math.floor(1000 + Math.random() * 9000),
              discount_type: 'percentage',
              discount_val: '100% OFF',
              max_uses: 500,
              district: 'All Districts'
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Grid: Promo Codes & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Promo Codes List from DB */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-sm">Active Database Promo Codes ({promos.length})</h3>
            </div>
            <span className="text-[11px] text-slate-400">PostgreSQL table</span>
          </div>
          
          {loading ? (
            <div className="py-12 flex items-center justify-center text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" /> Loading promo codes...
            </div>
          ) : promos.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No active promo codes. Click "New Promo Code" above to generate one.
            </div>
          ) : (
            <div className="space-y-3">
              {promos.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{promo.code}</span>
                    <div className="text-[11px] text-slate-400">{promo.discount_val} • Scope: {promo.district || 'Statewide'}</div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-medium uppercase">Redemptions</div>
                      <div className="text-xs font-bold text-white font-mono">{promo.current_uses} / {promo.max_uses}</div>
                    </div>

                    <button
                      onClick={() => handleDeletePromo(promo.id, promo.code)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      title="Delete code"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscription Tiers */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm">State & District Enterprise Tiers</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border border-blue-500/30 bg-blue-500/5 rounded-2xl p-5 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">STATE MISSION LICENSE</span>
                <span className="text-xs text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <h4 className="font-bold text-white text-base">State Government / District Skill Officer Node</h4>
              <p className="text-2xl font-black text-white">₹49,999<span className="text-xs text-slate-400 font-normal"> / district / year (Subsidized)</span></p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2 flex-shrink-0" /> Unlimited Trainee Longitudinal Tracking (3M–24M)</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2 flex-shrink-0" /> Zero-Knowledge Cryptographic Hash Enclaves</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2 flex-shrink-0" /> Automated Resend SMTP & WhatsApp Survey Engine</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2 flex-shrink-0" /> PMEGP & Mudra Grant Disbursement API Integrations</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* New Promo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Generate New Promo Code</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Promo Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Discount Label</label>
                  <input
                    type="text"
                    required
                    value={formData.discount_val}
                    onChange={e => setFormData({ ...formData, discount_val: e.target.value })}
                    placeholder="100% OFF"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.max_uses}
                    onChange={e => setFormData({ ...formData, max_uses: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">District Scope</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Pune or All Districts"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  {saving ? 'Creating...' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
