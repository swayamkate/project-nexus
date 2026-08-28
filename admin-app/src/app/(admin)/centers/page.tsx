'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Award,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

interface TrainingCenter {
  id: string;
  center_code: string;
  center_name: string;
  center_type: string;
  district: string;
  taluka: string;
  principal_name: string;
  contact_phone: string;
  contact_email: string;
  nsqf_lab_rating: number;
  biometric_compliance_pct: number;
  equipment_readiness_pct: number;
  active_batches: number;
  total_capacity: number;
  accreditation_status: string;
}

export default function CentersPage() {
  const [centers, setCenters] = useState<TrainingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const supabase = createClient();

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_centers')
        .select('*')
        .order('district', { ascending: true });

      if (!error && data) {
        setCenters(data);
      }
    } catch (err) {
      console.error('Failed to load training centers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter((c) => {
    const matchesSearch = 
      c.center_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.center_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.principal_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = districtFilter === 'All' || c.district === districtFilter;
    const matchesType = typeFilter === 'All' || c.center_type === typeFilter;

    return matchesSearch && matchesDistrict && matchesType;
  });

  const totalCapacity = centers.reduce((acc, c) => acc + c.total_capacity, 0);
  const avgBiometric = centers.length > 0 ? Math.round(centers.reduce((acc, c) => acc + c.biometric_compliance_pct, 0) / centers.length) : 0;
  const avgLab = centers.length > 0 ? Math.round(centers.reduce((acc, c) => acc + c.equipment_readiness_pct, 0) / centers.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              Infrastructure Governance
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              36 Districts Monitored
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Statewide ITI & Training Center Auditor</h1>
          <p className="text-xs text-slate-400">
            Real-time audit of Maharashtra Government ITIs, NSQF lab readiness, biometric compliance, and batch allocations.
          </p>
        </div>

        <button 
          onClick={fetchCenters} 
          className="flex items-center space-x-2 bg-slate-900 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Audits</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Institutes</p>
          <p className="text-2xl font-black text-white mt-1">{centers.length}</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">100% Accredited by SSDM</p>
        </div>
        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Training Capacity</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{totalCapacity.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Youth across 60+ active batches</p>
        </div>
        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Biometric Compliance</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{avgBiometric}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">AEBAS biometric terminal sync</p>
        </div>
        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Lab Equipment Readiness</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{avgLab}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">NSQF Level 5 Workshop standards</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search institute name, center code, or principal..."
            className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500"
          />
        </div>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-blue-500"
        >
          <option value="All">All Districts</option>
          <option value="Pune">Pune</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Nashik">Nashik</option>
          <option value="Aurangabad (Chhatrapati Sambhajinagar)">Chhatrapati Sambhajinagar</option>
          <option value="Thane">Thane</option>
          <option value="Kolhapur">Kolhapur</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-blue-500"
        >
          <option value="All">All Center Types</option>
          <option value="Government ITI">Government ITI</option>
          <option value="MSSDS Accredited Center">MSSDS Accredited Center</option>
          <option value="Corporate Industry Center">Corporate Industry Center</option>
        </select>
      </div>

      {/* Centers Directory Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">Loading training center registry...</div>
      ) : filteredCenters.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-xs">No matching training centers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCenters.map((c) => (
            <div key={c.id} className="bg-[#0c1322] border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
                    {c.center_code}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{c.center_name}</h3>
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{c.taluka}, {c.district}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {c.accreditation_status}
                </span>
              </div>

              <div className="p-3 bg-slate-900/70 border border-slate-800/60 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[11px] text-slate-400">Principal / Head:</span>
                  <span className="font-semibold">{c.principal_name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[11px] text-slate-400">Total Capacity:</span>
                  <span className="font-bold text-white">{c.total_capacity} seats ({c.active_batches} batches)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[11px] text-slate-400">Biometric Attendance:</span>
                  <span className="font-bold text-emerald-400">{c.biometric_compliance_pct}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[11px] text-slate-400">Lab Readiness:</span>
                  <span className="font-bold text-cyan-400">{c.equipment_readiness_pct}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{c.contact_phone}</span>
                </div>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">
                  <Award className="w-3 h-3" />
                  <span>NSQF Level {c.nsqf_lab_rating}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
