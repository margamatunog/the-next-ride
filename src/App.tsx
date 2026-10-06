import React, { useState, useEffect } from 'react';
import { HeaderTheme } from './components/HeaderTheme';
import { LetterForm } from './components/LetterForm';
import { LetterViewer } from './components/LetterViewer';
import { IncomingEmailModal } from './components/IncomingEmailModal';
import { LetterSubmission } from './types';
import { playEmailChime } from './utils/audio';
import { triggerConfetti } from './utils/confetti';

const STORAGE_KEY = 'next_ride_current_letter_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'write' | 'view'>('write');
  const [currentLetter, setCurrentLetter] = useState<LetterSubmission | null>(null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);

  // Load user's latest letter from storage if exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name && parsed.futureLetter) {
          setCurrentLetter(parsed);
        }
      }
    } catch {
      //
    }
  }, []);

  const handleLetterSubmitted = (record: LetterSubmission) => {
    setCurrentLetter(record);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      //
    }

    // Play celebration audio and confetti
    playEmailChime();
    triggerConfetti();

    // Show popup modal notifying user of the incoming email
    setShowIncomingModal(true);
  };

  const handleOpenLetterFromModal = () => {
    setShowIncomingModal(false);
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800">
      {/* Event Header with 1Matunog District & The Next Ride styling */}
      <HeaderTheme
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasLetter={Boolean(currentLetter)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'write' && (
          <LetterForm onSubmitSuccess={handleLetterSubmitted} />
        )}

        {activeTab === 'view' && currentLetter && (
          <LetterViewer
            letter={currentLetter}
            onWriteNew={() => setActiveTab('write')}
          />
        )}
      </main>

      {/* Incoming Email Celebration Popup */}
      {showIncomingModal && currentLetter && (
        <IncomingEmailModal
          letter={currentLetter}
          onOpenLetter={handleOpenLetterFromModal}
          onClose={() => {
            setShowIncomingModal(false);
            setActiveTab('view');
          }}
        />
      )}

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-300 py-8 px-4 border-t border-slate-800 text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-display text-sm font-bold text-amber-400 uppercase tracking-wider">
            1MATUNOG DISTRICT · 1CMA AT 12 · THE NEXT RIDE
          </p>
          <p className="text-slate-400">
            Anjo World Conference Center, Minglanilla, Cebu · Saturday, 10 October 2026
          </p>
          <p className="text-slate-400 font-semibold tracking-widest text-[11px] uppercase">
            CELEBRATE | COMMIT | TAKE THE NEXT RIDE
          </p>
          <p className="text-slate-500 text-[10px] pt-2">
            Target Opening: October 10, 2029 (Open 10.10.2029) · Time Capsule & Future Self System
          </p>
        </div>
      </footer>
    </div>
  );
}

