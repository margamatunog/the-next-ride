import React, { useState } from 'react';
import { Send, Mail, Check, AlertCircle } from 'lucide-react';
import { LetterSubmission } from '../types';

interface LetterFormProps {
  onSubmitSuccess: (data: LetterSubmission) => void;
}

export const LetterForm: React.FC<LetterFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [personIBecame, setPersonIBecame] = useState('');
  const [lifeICreated, setLifeICreated] = useState('');
  const [differenceIMade, setDifferenceIMade] = useState('');
  const [courageToPursue, setCourageToPursue] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['MDRT']);
  const [otherMilestone, setOtherMilestone] = useState('');
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [firstStepBeginsWith, setFirstStepBeginsWith] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMilestone = (milestone: string) => {
    if (milestones.includes(milestone)) {
      setMilestones(milestones.filter((m) => m !== milestone));
    } else {
      setMilestones([...milestones, milestone]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please write your name on the letter.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address so your future self can send your response letter.');
      return;
    }
    if (!personIBecame.trim() && !lifeICreated.trim()) {
      setError('Please complete at least one of the statements to your future self.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedMilestones = [...milestones];
      if (isOtherChecked && otherMilestone.trim()) {
        selectedMilestones.push(`Other: ${otherMilestone.trim()}`);
      }

      const payload = {
        name: name.trim(),
        email: email.trim(),
        personIBecame: personIBecame.trim(),
        lifeICreated: lifeICreated.trim(),
        differenceIMade: differenceIMade.trim(),
        courageToPursue: courageToPursue.trim(),
        milestones: selectedMilestones,
        otherMilestone: otherMilestone.trim(),
        firstStepBeginsWith: firstStepBeginsWith.trim(),
      };

      const response = await fetch('/api/generate-future-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit letter');
      }

      const data = await response.json();
      if (data.success && data.record) {
        onSubmitSuccess(data.record);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong while sending your letter to the future. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 px-4">
      {/* The Printable Letter Sheet Container */}
      <div className="bg-letter-paper rounded-2xl border-2 border-purple-200/60 p-6 sm:p-12 shadow-xl relative transition-all">
        {/* Decorative corner time-stamp watermark */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border border-purple-300/60 rounded-md px-2.5 py-1 text-[11px] font-mono text-purple-700 font-semibold uppercase tracking-wider bg-purple-50/50">
          TIME CAPSULE · 2026 ➔ 2029
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Title from Photo */}
          <div className="text-center pt-2">
            <h2 className="text-2xl sm:text-4xl font-black text-purple-900 tracking-wide font-display">
              MY NEXT RIDE
            </h2>
            <p className="text-sm sm:text-base italic text-purple-700 font-serif-title mt-0.5">
              A letter to my future self
            </p>
            <div className="h-[2px] bg-purple-800 w-full mt-3 mb-2" />
          </div>

          {/* Date from Photo */}
          <div className="pt-1">
            <p className="text-sm sm:text-base italic font-serif-title text-purple-800 font-medium">
              October 10, 2026
            </p>
          </div>

          {/* Main Statement Prompt */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Three years from today, I want to be able to say...
            </h3>
          </div>

          {/* Statement 1 */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-bold text-slate-900">
              The person I became:
            </label>
            <div className="relative">
              <textarea
                value={personIBecame}
                onChange={(e) => setPersonIBecame(e.target.value)}
                rows={2}
                placeholder="e.g. Someone calm under pressure, deeply authentic, and proud of who I see in the mirror..."
                className="w-full bg-amber-50/30 border-b-2 border-slate-300 focus:border-purple-700 focus:bg-amber-50/50 focus:outline-hidden py-1 px-2 text-sm sm:text-base text-slate-800 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Statement 2 */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-bold text-slate-900">
              The life I created for myself / my family:
            </label>
            <div className="relative">
              <textarea
                value={lifeICreated}
                onChange={(e) => setLifeICreated(e.target.value)}
                rows={2}
                placeholder="e.g. Unconditional security, a home filled with joy and laughter, and the freedom of time..."
                className="w-full bg-amber-50/30 border-b-2 border-slate-300 focus:border-purple-700 focus:bg-amber-50/50 focus:outline-hidden py-1 px-2 text-sm sm:text-base text-slate-800 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Statement 3 */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-bold text-slate-900">
              The difference I made for other people:
            </label>
            <div className="relative">
              <textarea
                value={differenceIMade}
                onChange={(e) => setDifferenceIMade(e.target.value)}
                rows={2}
                placeholder="e.g. Protected families against unexpected storms and empowered new advisors to build their dreams..."
                className="w-full bg-amber-50/30 border-b-2 border-slate-300 focus:border-purple-700 focus:bg-amber-50/50 focus:outline-hidden py-1 px-2 text-sm sm:text-base text-slate-800 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Statement 4 */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-bold text-slate-900">
              The thing I finally had the courage to pursue:
            </label>
            <div className="relative">
              <textarea
                value={courageToPursue}
                onChange={(e) => setCourageToPursue(e.target.value)}
                rows={2}
                placeholder="e.g. Overcoming the fear of speaking up, stepping into leadership, and qualifying for MDRT..."
                className="w-full bg-amber-50/30 border-b-2 border-slate-300 focus:border-purple-700 focus:bg-amber-50/50 focus:outline-hidden py-1 px-2 text-sm sm:text-base text-slate-800 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Statement 5: Professional Milestones */}
          <div className="pt-2 space-y-2">
            <label className="block text-sm sm:text-base font-bold text-purple-900">
              My next professional milestone:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {['Stronger Practice', 'MDRT', 'Leadership', 'Build a Team'].map((item) => {
                const checked = milestones.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleMilestone(item)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm font-medium transition-all ${
                      checked
                        ? 'border-purple-700 bg-purple-50/80 text-purple-950 font-semibold'
                        : 'border-slate-300 bg-white/60 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                        checked ? 'border-purple-800 bg-purple-800 text-white' : 'border-slate-400 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{item}</span>
                  </button>
                );
              })}

              {/* Other option */}
              <div
                className={`sm:col-span-2 flex items-center gap-2 p-2 rounded-lg border text-sm transition-all ${
                  isOtherChecked ? 'border-purple-700 bg-purple-50/80' : 'border-slate-300 bg-white/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsOtherChecked(!isOtherChecked)}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                      isOtherChecked ? 'border-purple-800 bg-purple-800 text-white' : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isOtherChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-medium text-slate-800">Other:</span>
                </button>
                <input
                  type="text"
                  value={otherMilestone}
                  onChange={(e) => {
                    setOtherMilestone(e.target.value);
                    if (!isOtherChecked) setIsOtherChecked(true);
                  }}
                  placeholder="e.g. Road to Orlando / Executive Agency"
                  className="flex-1 bg-transparent border-b border-slate-300 focus:border-purple-700 focus:outline-hidden px-1 py-0.5 text-sm text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Statement 6: First Step */}
          <div className="pt-2 space-y-1">
            <label className="block text-sm sm:text-base font-bold text-purple-900">
              My first step begins with...
            </label>
            <div className="relative">
              <textarea
                value={firstStepBeginsWith}
                onChange={(e) => setFirstStepBeginsWith(e.target.value)}
                rows={2}
                placeholder="e.g. Reaching out to 5 clients every morning, and trusting my mentors..."
                className="w-full bg-amber-50/30 border-b-2 border-slate-300 focus:border-purple-700 focus:bg-amber-50/50 focus:outline-hidden py-1 px-2 text-sm sm:text-base text-slate-800 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Name & Target Date Box */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end border-t border-purple-200/80">
            <div className="sm:col-span-8 space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                NAME:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Write your full name here"
                className="w-full bg-amber-50/40 border-b-2 border-slate-400 focus:border-purple-700 focus:bg-amber-50/80 focus:outline-hidden px-2 py-1 text-base sm:text-lg font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-4 text-left sm:text-right">
              <span className="inline-block text-xs sm:text-sm font-bold text-purple-800 bg-purple-100/70 border border-purple-300 px-3 py-1.5 rounded-lg shadow-2xs font-mono">
                Open 10.10.2029
              </span>
            </div>
          </div>

          {/* Email input for receiving the response from their future self */}
          <div className="pt-3 bg-purple-50/50 border border-purple-200/90 rounded-xl p-3 sm:p-4">
            <label className="block text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <Mail className="w-4 h-4 text-purple-700" />
              <span>Where should your Future Self deliver your email?</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-hidden shadow-2xs"
            />
            <p className="text-[11px] text-purple-700/90 mt-1">
              * Immediately after sealing this letter, you will receive an incoming response letter written by your future self from <strong>October 10, 2029</strong>.
            </p>
          </div>

          {/* Footer watermark text from original document */}
          <div className="pt-3 text-center border-t border-slate-200">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 tracking-widest uppercase">
              THE NEXT RIDE · 1CMA AT 12 · 10.10.2026
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm sm:text-base tracking-wide uppercase transition-all shadow-md ${
                isSubmitting
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-purple-800 hover:bg-purple-900 text-white hover:shadow-lg transform active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traveling to October 10, 2029...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Seal & Send to Future Self</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
