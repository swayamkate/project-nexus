import React from 'react';
import { Tag, Plus, CreditCard, CheckCircle2 } from 'lucide-react';

export default function AdminBillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Billing & Promos</h1>
          <p className="text-sm text-slate-400 mt-1">Manage corporate subscriptions and promotional access codes.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-4">
            <Tag className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Active Promo Codes</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { code: 'NEXUS-GOV-26', discount: '100% OFF', usage: '482 / 500' },
              { code: 'SKILL-UP-MH', discount: '50% OFF', usage: '1,204 / ∞' },
              { code: 'BETA-TESTER', discount: 'FREE LIFETIME', usage: '10 / 10' }
            ].map((promo) => (
              <div key={promo.code} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{promo.code}</span>
                  <div className="text-xs text-slate-500 mt-0.5">{promo.discount}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Usage</div>
                  <div className="text-sm font-bold text-white">{promo.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-4">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white">Subscription Tiers</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
              <h4 className="font-bold text-white">Government / Enterprise</h4>
              <p className="text-2xl font-black text-white mt-1">₹49,999<span className="text-sm text-slate-500 font-medium">/mo</span></p>
              <ul className="mt-3 space-y-1.5">
                <li className="flex items-center text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2" /> Unlimited Trainee Tracking</li>
                <li className="flex items-center text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2" /> Advanced Geospatial Analytics</li>
                <li className="flex items-center text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2" /> Custom Webhook Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
