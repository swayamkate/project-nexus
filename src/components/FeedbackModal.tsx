'use client';

import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  Bug, 
  Sparkles, 
  HeartHandshake, 
  X, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatHumanError } from '@/lib/errorUtils';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
}) => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'praise'>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError('Please provide both a subject and details for your feedback.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const email = userEmail || 'user@nexus.in';
      const name = userName || 'Nexus Trainee';
      
      const { error: dbError } = await supabase
        .from('platform_feedback')
        .insert({
          user_email: email,
          user_name: name,
          category: feedbackType,
          title: subject.trim(),
          description: message.trim(),
          rating: rating,
          status: 'open'
        });

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSubject('');
        setMessage('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-blue-950/20 relative flex flex-col space-y-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Platform Feedback & Bug Report
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Direct channel to the Nexus Product & Engineering Team
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

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Feedback Submitted Successfully!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you for helping improve Nexus. Our development team reviews every report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Feedback Type Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setFeedbackType('bug')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  feedbackType === 'bug'
                    ? 'bg-white text-red-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Bug</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('feature')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  feedbackType === 'feature'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Idea</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('praise')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  feedbackType === 'praise'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Praise</span>
              </button>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Platform Experience Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      rating >= star 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Short Summary
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={feedbackType === 'bug' ? 'e.g. Certificate download button not responding' : 'e.g. Suggestion for Marathi audio guides'}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-xs text-slate-900 transition outline-hidden"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Detailed Feedback
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe what happened or what you would like to see improved..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-xs text-slate-900 transition outline-hidden resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/30 transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquarePlus className="w-4 h-4" />
                )}
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
