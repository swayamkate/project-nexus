'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  Eye, 
  Edit3, 
  HelpCircle, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const FollowupsPage: React.FC = () => {
  const [followups, setFollowups] = useState([
    {
      id: 'fol-1',
      name: '3 Months Follow-up',
      status: 'Completed',
      scheduledDate: '20 Nov 2024',
      submittedDate: '20 Nov 2024',
      bizStatus: 'Active',
      incomeRange: '₹5,000 – ₹10,000',
      remarks: 'Business is going well. Getting regular customers.'
    },
    {
      id: 'fol-2',
      name: '6 Months Follow-up',
      status: 'Completed',
      scheduledDate: '20 Feb 2025',
      submittedDate: '20 Feb 2025',
      bizStatus: 'Active',
      incomeRange: '₹10,000 – ₹20,000',
      remarks: 'Increased client base and income.'
    },
    {
      id: 'fol-3',
      name: '12 Months Follow-up',
      status: 'Upcoming',
      scheduledDate: '20 Aug 2025',
      submittedDate: '-',
      bizStatus: 'Pending',
      incomeRange: '-',
      remarks: 'Pending'
    },
  ]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [selectedIncome, setSelectedIncome] = useState('₹15,000 – ₹25,000');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [userRemarks, setUserRemarks] = useState('Expanded boutique tailoring unit with 1 new machine operator.');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setFollowups(prev => prev.map(f => {
      if (f.id === 'fol-3') {
        return {
          ...f,
          status: 'Completed',
          submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          bizStatus: selectedStatus,
          incomeRange: selectedIncome,
          remarks: userRemarks
        };
      }
      return f;
    }));
    setShowUpdateModal(false);
  };

  const completedCount = followups.filter(f => f.status === 'Completed').length;
  const upcomingCount = followups.filter(f => f.status === 'Upcoming').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-white">Follow-ups</h2>
        <p className="text-xs text-slate-400">Track your progress and update your status in scheduled follow-ups.</p>
      </div>

      {/* 4 Summary Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Follow-ups */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Follow-ups</span>
            <p className="text-2xl font-black text-white">{followups.length}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Scheduled</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Completed</span>
            <p className="text-2xl font-black text-white">{completedCount}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Follow-ups</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Upcoming</span>
            <p className="text-2xl font-black text-white">{upcomingCount}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Follow-up</span>
          </div>
        </div>

        {/* Next Follow-up Due On */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Next Follow-up Due On</span>
            <p className="text-lg font-black text-white">20 Jun 2025</p>
            <span className="text-[10px] text-slate-400 font-medium block">6 Months Follow-up</span>
          </div>
        </div>
      </div>

      {/* Follow-up Schedule (Timeline Card List) */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">Follow-up Schedule</h3>

        <div className="space-y-4">
          {followups.map((item, idx) => {
            const isCompleted = item.status === 'Completed';
            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/10 border-emerald-800/30'
                    : 'bg-[#0e1628] border-slate-800/90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Checkmark & Date */}
                  <div className="flex items-start space-x-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-blue-400 text-blue-400'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">{item.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Scheduled Date: <strong className="text-slate-300">{item.scheduledDate}</strong></p>
                    </div>
                  </div>

                  {/* Middle: Business Status & Income */}
                  <div className="grid grid-cols-2 gap-6 text-xs lg:border-l lg:border-r border-slate-800 lg:px-8">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Business Status</span>
                      <span className={item.bizStatus === 'Active' ? 'text-emerald-400 font-bold' : 'text-slate-400 font-semibold'}>
                        {item.bizStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Income Range</span>
                      <span className="font-bold text-slate-200">{item.incomeRange}</span>
                    </div>
                  </div>

                  {/* Right: Remarks & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 lg:w-96">
                    <div className="text-xs">
                      <span className="text-slate-500 text-[11px] block">Remarks</span>
                      <span className="text-slate-300 italic">{item.remarks}</span>
                    </div>

                    {isCompleted ? (
                      <button 
                        onClick={() => setViewItem(item)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowUpdateModal(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Now</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Follow-up History Table */}
      <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-white text-base">Follow-up History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Follow-up</th>
                <th className="pb-3">Scheduled Date</th>
                <th className="pb-3">Submitted Date</th>
                <th className="pb-3">Business Status</th>
                <th className="pb-3">Income Range</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {followups.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 font-bold text-slate-100">{row.name}</td>
                  <td className="py-3.5 text-slate-400">{row.scheduledDate}</td>
                  <td className="py-3.5 text-slate-400">{row.submittedDate}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.bizStatus === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {row.bizStatus}
                    </span>
                  </td>
                  <td className="py-3.5 font-medium text-slate-200">{row.incomeRange}</td>
                  <td className="py-3.5 text-right">
                    {row.status === 'Completed' ? (
                      <button 
                        onClick={() => setViewItem(row)}
                        className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-[11px] font-semibold inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowUpdateModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold inline-flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Are Follow-ups Important Card with Illustration */}
      <div className="bg-gradient-to-r from-blue-950/40 via-[#0e1628] to-indigo-950/40 border border-blue-900/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Why are follow-ups important?</span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Follow-ups help us understand your progress and connect you with better opportunities, government enterprise schemes, subsidized loans, and mentorship support.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <FileText className="w-8 h-8" />
        </div>
      </div>

      {/* Modal: Update Follow-up */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Update 12 Months Follow-up</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Current Business Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                >
                  <option value="Active">Active (Generating Revenue)</option>
                  <option value="Scaling">Scaling (Hiring Team / Expanding)</option>
                  <option value="Transitioning">Transitioning to Job</option>
                  <option value="Need Support">Need Government Mentorship / Loan</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Current Monthly Income Range</label>
                <select
                  value={selectedIncome}
                  onChange={(e) => setSelectedIncome(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                >
                  <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                  <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                  <option value="₹20,000 – ₹35,000">₹20,000 – ₹35,000</option>
                  <option value="₹35,000+">₹35,000+</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Remarks & Progress Update</label>
                <textarea
                  rows={3}
                  required
                  value={userRemarks}
                  onChange={(e) => setUserRemarks(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Submit Milestone Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Inspection Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">{viewItem.name}</h3>
              <button 
                onClick={() => setViewItem(null)} 
                className="text-slate-400 hover:text-white transition p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold text-white">{viewItem.scheduledDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Submitted Date:</span>
                <span className="font-bold text-white">{viewItem.submittedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Business Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">{viewItem.bizStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Monthly Income:</span>
                <span className="font-bold text-emerald-400">{viewItem.incomeRange}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Remarks & Field Audit Notes:</span>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-slate-300 italic">{viewItem.remarks || 'No additional remarks recorded.'}</p>
              </div>
            </div>

            <button
              onClick={() => setViewItem(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition cursor-pointer min-h-[40px]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
