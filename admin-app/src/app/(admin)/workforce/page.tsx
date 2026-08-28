'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  GraduationCap, 
  Compass, 
  Zap, 
  MapPin, 
  Building2, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  BarChart2,
  PieChart,
  Activity,
  FileSearch,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

export default function AIWorkforcePage() {
  const [activeTab, setActiveTab] = useState<'vacancies' | 'forecasts' | 'gaps' | 'translatability' | 'attrition'>('vacancies');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    vacancies: [],
    forecasts: [],
    curriculumGaps: [],
    translatabilityMatrix: {},
    scoredCandidates: []
  });
  const [searchVacancy, setSearchVacancy] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai-workforce');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load AI workforce intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVacancies = data.vacancies.filter((v: any) => {
    const matchesSearch = 
      (v.title || '').toLowerCase().includes(searchVacancy.toLowerCase()) ||
      (v.company_name || '').toLowerCase().includes(searchVacancy.toLowerCase()) ||
      (v.trade_specialization || '').toLowerCase().includes(searchVacancy.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <Sparkles className="w-7 h-7 text-indigo-400" />
            <span>AI Workforce & Labor Market Intelligence Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time industrial vacancy aggregation, 5-year trade forecasting, curriculum gap detection, and predictive attrition warnings
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-indigo-300">Live AI Predictive Engine Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'vacancies', label: 'Live Vacancies Aggregator (8)', icon: Briefcase, count: data.vacancies.length },
          { id: 'forecasts', label: '5-Year Trade Forecasting (10)', icon: TrendingUp, count: data.forecasts.length },
          { id: 'gaps', label: 'Curriculum Gap Detector (3)', icon: FileSearch, count: data.curriculumGaps.length },
          { id: 'translatability', label: 'Cross-Sector Translatability (7)', icon: Compass, count: Object.keys(data.translatabilityMatrix).length },
          { id: 'attrition', label: 'Attrition & Placement Risk (4, 11)', icon: AlertTriangle, count: data.scoredCandidates.length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="text-xs font-semibold">Running multi-dimensional neural workforce diagnostics...</span>
        </div>
      ) : (
        <div className="animate-in fade-in space-y-6">

          {/* TAB 1: LIVE VACANCIES AGGREGATOR */}
          {activeTab === 'vacancies' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchVacancy}
                    onChange={e => setSearchVacancy(e.target.value)}
                    placeholder="Search verified vacancies by job title, company, or trade specialization..."
                    className="w-full bg-[#0a1020] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVacancies.map((v: any) => (
                  <div key={v.id} className="bg-[#0a1020] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg space-y-3 transition flex flex-col justify-between group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {v.trade_specialization}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {v.vacancies_count} Openings
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {v.title}
                      </h3>

                      <div className="text-xs text-slate-400 space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{v.company_name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{v.district}, Maharashtra</span>
                        </div>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-1">
                        {(v.requirements || []).map((req: string, i: number) => (
                          <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Monthly Stipend / Wage</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          ₹{Number(v.min_salary).toLocaleString()} - ₹{Number(v.max_salary).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 italic">
                        {v.source_portal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 5-YEAR TRADE DEMAND FORECASTING */}
          {activeTab === 'forecasts' && (
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>State Vocational Trade Demand Forecast (2026 – 2030 Outlook)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Predictive expansion modeling for industrial corridors based on national industrial missions and state infrastructure capital outlays.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.forecasts.map((f: any) => (
                  <div key={f.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{f.trade_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        f.priority_level === 'Critical' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {f.priority_level} Priority
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center py-2 bg-black/40 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block">2026 Baseline</span>
                        <span className="text-xs font-bold text-slate-200 font-mono">{f.current_demand_2026.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">2030 Target</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{f.projected_demand_2030.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Expansion</span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">+{f.growth_rate_pct}%</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-900/30">
                      <b className="text-indigo-300">Macro Growth Driver:</b> {f.drivers}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM GAP DETECTOR */}
          {activeTab === 'gaps' && (
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileSearch className="w-5 h-5 text-amber-400" />
                  <span>Automated ITI Curriculum & Industry Gap Diagnostic</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Identifies specific missing competency modules between current DGET/NSQF syllabi and live employer hiring requisitions.
                </p>
              </div>

              <div className="space-y-4">
                {data.curriculumGaps.map((g: any) => (
                  <div key={g.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{g.trade_name}</h4>
                        <span className="text-[11px] text-slate-400">Current NSQF Level {g.current_nsqf_level}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">Industry Urgency:</span>
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30">
                          {g.industry_demand_pct}% Employer Demand
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                        Missing Practical Modules in Current ITI Curriculum:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(g.industry_missing_competencies || []).map((comp: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/20 flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{comp}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-emerald-300 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
                      <b>SSDM Recommendation:</b> {g.recommendations}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CROSS-SECTOR SKILL TRANSLATABILITY */}
          {activeTab === 'translatability' && (
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <span>Cross-Sector Skill Translatability Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Quantifies candidate competency overlap between traditional trades and high-growth emerging sectors to fast-track upskilling.
                </p>
              </div>

              <div className="space-y-5">
                {Object.entries(data.translatabilityMatrix || {}).map(([sourceSector, targets]: any) => (
                  <div key={sourceSector} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
                      <Layers className="w-4 h-4" />
                      <span>Primary Trade Sector: {sourceSector}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {targets.map((t: any, idx: number) => (
                        <div key={idx} className="bg-black/30 border border-slate-800 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{t.target_sector}</span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-black font-mono">
                              {t.translatability_score_pct}% Match
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-300">
                            <span className="text-slate-400 block text-[10px]">Shared Core Foundations:</span>
                            <span>{t.shared_competencies.join(', ')}</span>
                          </div>

                          <div className="text-[10px] text-cyan-300 pt-1 font-semibold flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>Required Bridge Coursework: {t.bridging_hours} Hours</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ATTRITION & PLACEMENT RISK */}
          {activeTab === 'attrition' && (
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Candidate Placement Probability & 3-Month Attrition Risk Radar</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Predictive scores measuring probability of successful corporate placement and early warning indicators for milestone dropout.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Placement Probability</th>
                      <th className="py-3 px-4">3M Attrition Risk</th>
                      <th className="py-3 px-4">Key Risk Factor / Diagnostic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {data.scoredCandidates.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{c.full_name || 'Candidate'}</span>
                          <span className="text-[11px] text-slate-400">{c.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{c.district}</td>
                        <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-slate-400">{c.status.replace('_', ' ')}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-emerald-400">{c.placement_probability_pct}%</span>
                            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${c.placement_probability_pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            c.attrition_risk === 'High' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                              : c.attrition_risk === 'Moderate'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {c.attrition_risk} Risk
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 italic text-[11px]">
                          {c.risk_factor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
