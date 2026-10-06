// Pleasant chime synthesizer using Web Audio API for mail delivery notification
export function playEmailChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, start: number, duration: number, gainVal: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Upward 3-note crystal chime
    playTone(523.25, 0.0, 0.4, 0.15); // C5
    playTone(659.25, 0.12, 0.45, 0.18); // E5
    playTone(783.99, 0.24, 0.7, 0.22); // G5
    playTone(1046.5, 0.36, 1.0, 0.25); // C6
  } catch {
    // Gracefully ignore if audio context blocked by browser autoplay policy
  }
}
