'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

interface AdminDestructiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  itemName: string;
  warningMessage?: string;
  requiredWord?: string;
  loading?: boolean;
}

export const DestructiveConfirmModal: React.FC<AdminDestructiveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  warningMessage = 'This operation will immediately purge the record and is audited under State Administrative Compliance rules.',
  requiredWord = 'DELETE',
  loading = false,
}) => {
  const [typedWord, setTypedWord] = useState('');
  const isMatch = typedWord.trim().toUpperCase() === requiredWord.toUpperCase();

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!isMatch || loading) return;
    await onConfirm();
    setTypedWord('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a1020] border border-red-500/30 rounded-3xl p-6 shadow-2xl shadow-red-950/50 flex flex-col space-y-4 text-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-[11px] text-red-400 font-semibold">Executive Destructive Safeguard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-3.5 text-xs text-red-200 space-y-1.5">
          <p>{warningMessage}</p>
          <div className="text-[11px] font-mono bg-black/40 px-2 py-1 rounded text-slate-300 truncate border border-red-900/30">
            Target: <span className="font-bold text-red-300">{itemName}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Type <span className="font-mono text-red-400 bg-red-950/60 px-1 py-0.5 rounded border border-red-800">{requiredWord}</span> to confirm:
          </label>
          <input
            type="text"
            value={typedWord}
            onChange={(e) => setTypedWord(e.target.value)}
            placeholder={`Type "${requiredWord}"`}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl text-xs font-mono text-white outline-hidden"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={!isMatch || loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>Execute Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
