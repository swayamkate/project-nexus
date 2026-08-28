'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProfileSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

export const ProfileSkillsModal: React.FC<ProfileSkillsModalProps> = ({
  isOpen,
  onClose,
  skills,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [newSkillInput, setNewSkillInput] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newSkillInput.trim()) {
      onAddSkill(newSkillInput.trim());
      setNewSkillInput('');
    }
  };

  const suggestedSkills = [
    'No prior vocational skills / Entry-level beginner',
    'Apparel Manufacturing',
    'Boutique Management',
    'Digital Invoicing',
    'Pattern CAD Drafting',
    'Quality Inspection',
    'Single Needle Lockstitch',
    'Solar Installation',
    'EV Battery Servicing',
    'Customer Relations',
    'Basic Computer Operations'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Manage Vocational Skills</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input for new skill */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 block">Add New Skill</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={e => setNewSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
              placeholder="e.g. Garment Grading, Machine Calibration"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Current Skills Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 block">Your Current Skills ({skills.length})</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded-full"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="hover:text-rose-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Skills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Suggested Vocational Trades</label>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills
              .filter(s => !skills.includes(s))
              .slice(0, 6)
              .map((suggested, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onAddSkill(suggested)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-[11px] font-medium rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{suggested}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-600/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
};
