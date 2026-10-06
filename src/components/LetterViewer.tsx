import React, { useState } from 'react';
import {
  Mail,
  FileText,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Columns,
  Share2,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { LetterSubmission } from '../types';

interface LetterViewerProps {
  letter: LetterSubmission;
  onWriteNew: () => void;
}

function cleanPlainText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\*/g, '')
    .trim();
}

export const LetterViewer: React.FC<LetterViewerProps> = ({ letter, onWriteNew }) => {
  const [activeView, setActiveView] = useState<'futureEmail' | 'originalLetter' | 'splitView'>('futureEmail');
  const [copied, setCopied] = useState(false);
  const [forwardSent, setForwardSent] = useState(false);

  const plainFutureLetter = cleanPlainText(letter.futureLetter);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainFutureLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate mailto link so user can open in their native Gmail, Outlook, or Apple Mail client
  const mailtoSubject = encodeURIComponent(`A Letter from My Future Self (10.10.2029) — ${letter.name}`);
  const mailtoBody = encodeURIComponent(
    `Hello ${letter.name},\n\nHere is the response letter written by your future self from October 10, 2029:\n\n` +
      `${plainFutureLetter}\n\n` +
      `-----------------------------------------\n` +
      `Original Letter written on October 10, 2026 at "The Next Ride: 1CMA at 12", Anjo World, Cebu.\n` +
      `Milestones targeted: ${letter.milestones.join(', ')}\n` +
      `First step begins with: ${letter.firstStepBeginsWith}\n`
  );
  const mailtoUrl = `mailto:${encodeURIComponent(letter.email || '')}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const handleSimulateForward = async () => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId: letter.id, recipientEmail: letter.email }),
      });
      setForwardSent(true);
      setTimeout(() => setForwardSent(false), 3000);
    } catch {
      //
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* View Switcher & Action Toolbar */}
      <div className="no-print bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveView('futureEmail')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeView === 'futureEmail'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-300" />
            <span>Email from Future Self (2029)</span>
          </button>

          <button
            onClick={() => setActiveView('originalLetter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeView === 'originalLetter'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Original 2026 Letter</span>
          </button>

          <button
            onClick={() => setActiveView('splitView')}
            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeView === 'splitView'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Copy letter text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onWriteNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg text-xs transition-colors shadow-2xs"
          >
            <span>Write Another</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Email Client Viewer */}
      {(activeView === 'futureEmail' || activeView === 'splitView') && (
        <div
          className={`${
            activeView === 'splitView' ? 'mb-8' : ''
          } bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden`}
        >
          {/* Simulated Email Client Top Bar */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-400 ml-2 hidden sm:inline">
                Future Mailbox · Time Capsule Relay
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-slate-800 px-2.5 py-1 rounded-md">
              <Clock className="w-3 h-3" />
              <span>Transmitted from 10.10.2029</span>
            </div>
          </div>

          {/* Email Headers */}
          <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                A Letter from Your Future Self: You Made It, {letter.name}!
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-purple-700" />
                <span>Wed, Oct 10, 2029, 9:00 AM</span>
              </div>
            </div>

            <div className="flex items-start sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-amber-500 text-white flex items-center justify-center font-bold font-display shadow-xs text-base">
                  FS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Your Future Self</span>
                    <span className="text-xs text-slate-500 font-mono">&lt;future.self@10.10.2029&gt;</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    To: <span className="font-semibold">{letter.name}</span>{' '}
                    <span className="text-slate-500">&lt;{letter.email || 'you@future.me'}&gt;</span>
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified 3-Year Time Capsule</span>
              </div>
            </div>

            {/* Quick Dispatch Action Bar */}
            <div className="no-print pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/60">
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Email App (Gmail / Mail)</span>
              </a>

              <button
                type="button"
                onClick={handleSimulateForward}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-purple-700" />
                <span>{forwardSent ? 'Email Dispatched!' : 'Send Test Copy to Email'}</span>
              </button>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-6 sm:p-10 bg-white">
            <div className="max-w-2xl mx-auto space-y-5 text-slate-800 leading-relaxed text-base sm:text-lg">
              {plainFutureLetter.split('\n\n').map((paragraph, index) => {
                // If it looks like a signoff
                const isSignoff =
                  paragraph.toLowerCase().includes('with all my love') ||
                  paragraph.toLowerCase().includes('your future self') ||
                  paragraph.toLowerCase().includes('keep riding');

                return (
                  <p
                    key={index}
                    className={`${
                      isSignoff ? 'font-serif-title italic text-purple-950 font-semibold pt-3' : 'font-normal'
                    }`}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Letter Footer Banner */}
            <div className="mt-12 pt-6 border-t border-slate-200 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-900 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Sent back from the 3-Year Milestone · 1CMA at 12 & Beyond</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Original 2026 Letter Sheet */}
      {(activeView === 'originalLetter' || activeView === 'splitView') && (
        <div className="bg-letter-paper rounded-2xl border-2 border-purple-200/80 p-6 sm:p-12 shadow-xl relative my-6">
          {/* Postmark stamp */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-purple-800/40 rounded-full w-20 h-20 flex flex-col items-center justify-center text-[9px] font-mono text-purple-900 font-bold uppercase rotate-12 bg-amber-50/60 pointer-events-none">
            <span>1CMA @ 12</span>
            <span className="text-rose-600">★ ★ ★</span>
            <span>10.10.2026</span>
          </div>

          <div className="text-center pt-2">
            <h2 className="text-2xl sm:text-4xl font-black text-purple-900 tracking-wide font-display">
              MY NEXT RIDE
            </h2>
            <p className="text-sm sm:text-base italic text-purple-700 font-serif-title mt-0.5">
              A letter to my future self
            </p>
            <div className="h-[2px] bg-purple-800 w-full mt-3 mb-2" />
          </div>

          <div className="pt-1">
            <p className="text-sm sm:text-base italic font-serif-title text-purple-800 font-medium">
              October 10, 2026
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Three years from today, I want to be able to say...
            </h3>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">The person I became:</div>
              <div className="mt-1 p-2 bg-amber-50/40 border-b-2 border-slate-300 text-sm sm:text-base font-handwriting text-2xl text-purple-950 min-h-[40px]">
                {letter.personIBecame || '—'}
              </div>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                The life I created for myself / my family:
              </div>
              <div className="mt-1 p-2 bg-amber-50/40 border-b-2 border-slate-300 text-sm sm:text-base font-handwriting text-2xl text-purple-950 min-h-[40px]">
                {letter.lifeICreated || '—'}
              </div>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                The difference I made for other people:
              </div>
              <div className="mt-1 p-2 bg-amber-50/40 border-b-2 border-slate-300 text-sm sm:text-base font-handwriting text-2xl text-purple-950 min-h-[40px]">
                {letter.differenceIMade || '—'}
              </div>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                The thing I finally had the courage to pursue:
              </div>
              <div className="mt-1 p-2 bg-amber-50/40 border-b-2 border-slate-300 text-sm sm:text-base font-handwriting text-2xl text-purple-950 min-h-[40px]">
                {letter.courageToPursue || '—'}
              </div>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-purple-900">
                My next professional milestone:
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {letter.milestones.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 border border-purple-300 text-purple-900 font-semibold rounded-md text-xs sm:text-sm"
                  >
                    <Check className="w-3.5 h-3.5 text-purple-700" />
                    <span>{m}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-purple-900">My first step begins with...</div>
              <div className="mt-1 p-2 bg-amber-50/40 border-b-2 border-slate-300 text-sm sm:text-base font-handwriting text-2xl text-purple-950 min-h-[40px]">
                {letter.firstStepBeginsWith || '—'}
              </div>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end border-t border-purple-200/80">
              <div className="sm:col-span-8">
                <span className="text-xs font-black uppercase text-slate-800 mr-2">NAME:</span>
                <span className="text-xl sm:text-2xl font-handwriting font-bold text-purple-950 border-b-2 border-slate-400 pb-0.5 px-2 inline-block min-w-[200px]">
                  {letter.name}
                </span>
              </div>
              <div className="sm:col-span-4 text-left sm:text-right">
                <span className="inline-block text-xs sm:text-sm font-bold text-purple-800 bg-purple-100/70 border border-purple-300 px-3 py-1.5 rounded-lg font-mono">
                  Open 10.10.2029
                </span>
              </div>
            </div>

            <div className="pt-4 text-center border-t border-slate-200">
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 tracking-widest uppercase">
                THE NEXT RIDE · 1CMA AT 12 · 10.10.2026
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
