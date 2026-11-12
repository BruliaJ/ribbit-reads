/* Speaking. Website: the device's own (on-device) voices only; online voices (Google, Edge "Natural") send text away,
   so they are never used. Apps: the phone's native text-to-speech (works in the Android web view, which has no
   speechSynthesis). Claude artifact: optionally Claude's voice. If no voice exists the game stays silent and says how
   a grown-up can add one. */
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export interface ClaudeTTS { speak(text: string, o?: { rate?: number }): Promise<void>; stop(): void }
let claude: ClaudeTTS | null = null;
export const setClaudeTTS = (t: ClaudeTTS | null): void => { claude = t; };
export const hasClaudeTTS = (): boolean => !!claude;
const native = Capacitor.isNativePlatform();
const hasSynth = typeof speechSynthesis !== 'undefined';
let voice: SpeechSynthesisVoice | null = null;
let checked = false;
let nativeBroken = false;

function pickVoice(): void {
  if (!hasSynth) return;
  try {
    const all = speechSynthesis.getVoices(); if (all.length) checked = true;
    const v = all.filter(x => x.localService !== false && !/google|online|natural/i.test(x.name));
    voice = v.find(x => /en[-_]US/i.test(x.lang) && /samantha|ava|allison|female|zira|jenny|aria|karen|moira/i.test(x.name))
      ?? v.find(x => /en[-_]US/i.test(x.lang)) ?? v.find(x => /^en/i.test(x.lang)) ?? null;
  } catch { voice = null; }
}
if (hasSynth && !native) { pickVoice(); speechSynthesis.addEventListener?.('voiceschanged', pickVoice); setTimeout(() => { pickVoice(); checked = true; }, 2500); }

/** 'ok', 'none' (a grown-up needs to add a voice) or 'unknown' (still loading) */
export function voiceStatus(): 'ok' | 'none' | 'unknown' {
  if (claude) return 'ok';
  if (native) return nativeBroken ? 'none' : 'ok';
  if (voice) return 'ok';
  return checked || !hasSynth ? 'none' : 'unknown';
}
let unlocked = false;
/** iPad Safari only speaks after a tap; call this from the first tap. */
export function unlockSpeech(): void {
  if (unlocked || native || !hasSynth) return; unlocked = true;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch { /* none */ }
}
export function stopSpeech(): void {
  try { if (hasSynth && !native) speechSynthesis.cancel(); } catch { /* none */ }
  if (native) TextToSpeech.stop().catch(() => undefined);
  try { claude?.stop(); } catch { /* none */ }
}
/** Speak one piece; resolves when done (or after a safety timeout). */
export function speakOnce(text: string, rate: number, useClaude: boolean): Promise<void> {
  return new Promise(res => {
    let done = false; const fin = (): void => { if (!done) { done = true; res(); } };
    const r = Math.max(0.5, Math.min(1.5, rate));
    setTimeout(fin, 900 + text.length * 110 / r);
    if (useClaude && claude) { claude.speak(text, { rate: Math.max(0.7, Math.min(1.5, r)) }).then(fin, () => web()); return; }
    if (native) {
      TextToSpeech.speak({ text, lang: 'en-US', rate: r, pitch: 1.1, volume: 1, category: 'playback' }).then(fin, () => { nativeBroken = true; fin(); });
      return;
    }
    web();
    function web(): void {
      if (!hasSynth || !voice) { setTimeout(fin, 250); return; }
      try {
        const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.voice = voice; u.rate = r; u.pitch = 1.12; u.onend = fin; u.onerror = fin;
        speechSynthesis.speak(u); if (speechSynthesis.paused) speechSynthesis.resume();
      } catch { setTimeout(fin, 300); }
    }
  });
}
