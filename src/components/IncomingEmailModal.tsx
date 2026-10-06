import React from 'react';
import { Mail, Sparkles, ArrowRight, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { LetterSubmission } from '../types';

interface IncomingEmailModalProps {
  letter: LetterSubmission;
  onOpenLetter: () => void;
  onClose: () => void;
}

export const IncomingEmailModal: React.FC<IncomingEmailModalProps> = ({
  letter,
  onOpenLetter,
  onClose,
}) => {
  const plainSnippet = letter.futureLetter
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\*/g, '')
    .trim();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative overflow-hidden transform animate-scale-up">
        {/* Playful ribbon top accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 via-amber-400 to-rose-500" />

        {/* Header icon badge */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-300 shadow-md">
              <Mail className="w-10 h-10 text-purple-800" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-950" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1 mb-5">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            Time Capsule Delivered · 10.10.2029
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display pt-2">
            You Got Mail from the Future!
          </h3>
          <p className="text-sm text-slate-600">
            Your future self from <strong>October 10, 2029</strong> has received your letter and written back to you!
          </p>
        </div>

        {/* Email preview card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
            <span className="font-semibold text-purple-900">
              From: Your Future Self &lt;future.self@10.10.2029&gt;
            </span>
            <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-sm">Oct 10, 2029</span>
          </div>

          <div className="text-xs text-slate-700">
            <span className="font-semibold text-slate-900">To: </span>
            {letter.name} &lt;{letter.email}&gt;
          </div>

          <div className="text-xs font-bold text-slate-900">
            Subject: A Letter from Your Future Self — You Made It, {letter.name}!
          </div>

          <p className="text-xs text-slate-600 line-clamp-3 italic pt-1 border-t border-slate-200/60 leading-relaxed font-serif-title">
            &ldquo;{plainSnippet.slice(0, 180)}...&rdquo;
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onOpenLetter}
            className="w-full py-3.5 px-6 bg-purple-800 hover:bg-purple-900 text-white rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span>Read Future Self Letter</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            View My Original 2026 Letter
          </button>
        </div>
      </div>
    </div>
  );
};
