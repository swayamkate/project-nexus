'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, Loader2, ShieldAlert } from 'lucide-react';

interface DestructiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  itemName: string;
  warningMessage?: string;
  consequences?: string[];
  requiredWord?: string;
  loading?: boolean;
}

export const DestructiveConfirmModal: React.FC<DestructiveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  warningMessage = 'This action is irreversible. The record will be permanently purged or archived from the state registry.',
  consequences = [
    'Associated certificates and milestone survey records will be detached.',
    'This operation is cryptographically logged in the State Audit Ledger.',
  ],
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border border-red-200 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-red-950/20 relative flex flex-col space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Danger Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-red-600 font-semibold mt-0.5">
                High-Impact Destructive Action
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Description */}
        <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 text-xs text-red-950 space-y-2">
          <p className="font-semibold">{warningMessage}</p>
          <div className="text-[11px] font-mono bg-white/80 px-2.5 py-1.5 rounded-lg border border-red-200/60 text-slate-700 truncate">
            Target Item: <span className="font-bold text-red-700">{itemName}</span>
          </div>
        </div>

        {/* Consequence Checklist */}
        {consequences.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Consequences & Governance:
            </span>
            <ul className="text-xs text-slate-600 space-y-1">
              {consequences.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confirmation Friction Input */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">
            To confirm deletion, type <span className="font-mono font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">{requiredWord}</span> below:
          </label>
          <input
            type="text"
            value={typedWord}
            onChange={(e) => setTypedWord(e.target.value)}
            placeholder={`Type "${requiredWord}" to confirm`}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-900 transition outline-hidden"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={!isMatch || loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-red-600/30 flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Permanently Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
