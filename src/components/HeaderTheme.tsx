import React from 'react';
import { Calendar, MapPin, Award, Compass, Sparkles, Sun } from 'lucide-react';

interface HeaderThemeProps {
  activeTab: 'write' | 'view';
  setActiveTab: (tab: 'write' | 'view') => void;
  hasLetter: boolean;
}

export const HeaderTheme: React.FC<HeaderThemeProps> = ({
  activeTab,
  setActiveTab,
  hasLetter,
}) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 text-slate-800 pt-6 pb-8 border-b-4 border-amber-300 shadow-md">
      {/* Playful Excursion Bunting Pennants Banner */}
      <div className="absolute top-0 left-0 right-0 flex justify-between overflow-hidden pointer-events-none opacity-90">
        {[
          'bg-amber-400',
          'bg-rose-500',
          'bg-cyan-400',
          'bg-emerald-400',
          'bg-purple-500',
          'bg-orange-400',
          'bg-sky-500',
          'bg-yellow-300',
          'bg-pink-500',
          'bg-lime-400',
          'bg-indigo-500',
          'bg-amber-400',
          'bg-rose-400',
          'bg-cyan-500',
          'bg-emerald-500',
        ].map((color, idx) => (
          <div
            key={idx}
            className={`w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[28px] ${
              color.replace('bg-', 'border-t-')
            } drop-shadow-sm transform ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
          />
        ))}
      </div>

      {/* Decorative Sun and Theme Park Ferris Wheel in background */}
      <div className="absolute -top-6 -right-6 w-36 h-36 bg-amber-300/40 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-4 right-6 text-amber-500 hidden sm:flex items-center gap-1.5 opacity-90 animate-pulse">
        <Sun className="w-10 h-10 text-amber-400 fill-amber-300 stroke-amber-500" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* District Tagline */}
        <div className="text-center pt-4 pb-1">
          <p className="text-xs sm:text-sm font-black tracking-widest text-slate-800 uppercase flex items-center justify-center gap-2">
            <span>1MATUNOG DISTRICT</span>
            <span className="text-rose-500">·</span>
            <span className="text-slate-700 font-semibold text-[11px] sm:text-xs tracking-wider">
              PEOPLE | PURPOSE | POSSIBILITIES
            </span>
          </p>
        </div>

        {/* Main Event Title Banner */}
        <div className="text-center my-2">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-6xl font-black text-amber-400 tracking-tight font-display drop-shadow-[0_4px_0_rgba(15,23,42,0.9)] uppercase stroke-slate-900">
              THE NEXT RIDE
            </h1>
          </div>
        </div>

        {/* 1CMA at 12 & Subtitle */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm transform -rotate-1">
            <span>1CMA AT 12</span>
            <span className="opacity-75">|</span>
            <span className="font-semibold">12 YEARS BEHIND US. A BIGGER FUTURE AHEAD.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-800 font-medium mt-1">
            <span className="flex items-center gap-1 font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-rose-600" />
              SATURDAY · 10 OCTOBER 2026
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Anjo World Conference Center, Minglanilla, Cebu
            </span>
            <span>·</span>
            <span className="bg-amber-300/80 text-amber-950 font-bold px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wide">
              OOTD: Kids Excursion 🎒
            </span>
          </div>
        </div>

        {/* 3 Pillars / Road to Milestones Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xs border border-white/90 rounded-xl p-2.5 text-center shadow-xs">
            <div className="text-[10px] font-black uppercase tracking-widest text-rose-600">Road Back To</div>
            <div className="text-base font-black text-slate-900 font-display">MEGA</div>
            <div className="text-[11px] text-slate-600">Reach higher. Go further.</div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-white/90 rounded-xl p-2.5 text-center shadow-xs">
            <div className="text-[10px] font-black uppercase tracking-widest text-sky-600">Road To</div>
            <div className="text-base font-black text-slate-900 font-display">1,000</div>
            <div className="text-[11px] text-slate-600">More people. More leaders. More lives.</div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-white/90 rounded-xl p-2.5 text-center shadow-xs">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center justify-center gap-1">
              <span>Road To</span>
              <Award className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-base font-black text-slate-900 font-display">ORLANDO</div>
            <div className="text-[11px] text-slate-600">MDRT 100th Annual Meeting · Qualify 2026</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center mt-6">
          <div className="inline-flex p-1 bg-white/70 backdrop-blur-sm rounded-xl border border-white/80 shadow-xs">
            <button
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'write'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Write Letter (10.10.2026)</span>
            </button>

            {hasLetter && (
              <button
                onClick={() => setActiveTab('view')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'view'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>View Letter & Future Mail</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
