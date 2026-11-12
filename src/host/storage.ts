/* Where progress lives: this browser's localStorage. In the apps a copy also goes to the phone's own app storage
   (Preferences), restored at launch if the web view lost its data. A save this version can't read is copied to a
   backup key before anything overwrites it. */
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { KEY, OLD_KEYS, BACKUP_KEY } from '../logic/state';

const native = Capacitor.isNativePlatform();
export function readRaw(): string | null {
  try {
    const v = localStorage.getItem(KEY); if (v) return v;
    for (const k of OLD_KEYS) { const o = localStorage.getItem(k); if (o) return o; }
  } catch { /* blocked storage */ }
  return null;
}
export function writeRaw(raw: string): void {
  try { localStorage.setItem(KEY, raw); } catch { /* full or blocked: the app copy below still has it */ }
  if (native) Preferences.set({ key: KEY, value: raw }).catch(() => undefined);
}
export function backup(raw: string): void { try { if (!localStorage.getItem(BACKUP_KEY)) localStorage.setItem(BACKUP_KEY, raw); } catch { /* none */ } }
/** apps only: bring back a save the web view lost */
export async function restoreFromApp(): Promise<void> {
  if (!native) return;
  try {
    const { value } = await Preferences.get({ key: KEY });
    if (value && !localStorage.getItem(KEY)) localStorage.setItem(KEY, value);
  } catch { /* none */ }
}
/** Erase every copy of progress on this device (Grown-ups → Erase). */
export function eraseAll(): void {
  try { for (const k of [KEY, BACKUP_KEY, ...OLD_KEYS]) localStorage.removeItem(k); } catch { /* none */ }
  if (native) Preferences.remove({ key: KEY }).catch(() => undefined);
}
/** An older save (old key, or one that still holds a name) should be rewritten in the current, cleaned shape. */
export function needsRewrite(): boolean {
  try {
    const cur = localStorage.getItem(KEY);
    const old = OLD_KEYS.some(k => localStorage.getItem(k) !== null);
    if (old) { for (const k of OLD_KEYS) localStorage.removeItem(k); }
    return old || (!!cur && /"name"\s*:|"theme"\s*:/.test(cur));
  } catch { return false; }
}
export function onOtherTabSave(fn: () => void): void { addEventListener('storage', e => { if (e.key === KEY) fn(); }); }
