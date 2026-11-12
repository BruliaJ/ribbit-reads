/* Saved progress: shape, safe reading of anything found in storage, and merging when two tabs save.
   Rules: never lose progress, never re-lock a pal, never store a child's real name. Pure (no storage access). */
import { CATS, type Cat } from '../content/shop';
import { LESSONS } from '../content/data';

export const KEY = 'ribbitreads.v1';
export const OLD_KEYS = ['soundhop.v1'];
export const BACKUP_KEY = 'ribbitreads.backup';

export interface Settings { rate: number; voice: 'device' | 'claude'; calm: boolean; caps: boolean; jump: number }
export interface Save {
  v: 1; rev: number; coins: number; plays: number; gifts: number;
  stars: Record<string, number>; done: Record<string, true>; got: Record<string, 1>;
  own: Record<Cat, string[]>; eq: Record<Cat, string>;
  world: string; unl: Record<string, number>; buddy: Record<string, number>;
  mine: string[]; games: Record<string, number>; mute: boolean; set: Settings;
}
export const WORLD_IDS = ['flower', 'mermaid', 'truck', 'dragon'];
const first = (c: Cat): string => Object.keys(CATS.find(x => x[0] === c)?.[2] ?? {})[0] ?? '';
export function fresh(): Save {
  return {
    v: 1, rev: 0, coins: 20, plays: 0, gifts: 0, stars: {}, done: {}, got: {},
    own: { frog: ['lime'], hat: ['none'], theme: ['lily'], pen: ['blue'], party: ['confetti'] },
    eq: { frog: 'lime', hat: 'none', theme: 'lily', pen: 'blue', party: 'confetti' },
    world: 'flower', unl: {}, buddy: {}, mine: [], games: {}, mute: false,
    set: { rate: 1, voice: 'device', calm: false, caps: true, jump: 0 },
  };
}
type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => !!x && typeof x === 'object' && !Array.isArray(x);
const int = (x: unknown, lo: number, hi: number, d: number): number => { const n = Math.floor(Number(x)); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
function numMap(x: unknown, lo: number, hi: number, keyOk: (k: string) => boolean): Record<string, number> {
  const out: Record<string, number> = {}; if (!isObj(x)) return out;
  for (const [k, v] of Object.entries(x)) if (keyOk(k)) { const n = int(v, lo, hi, -1); if (n >= lo) out[k] = n; }
  return out;
}
/** sticker keys: letters met (L:), words read/spelled (R:/S:), letters or lower-case words written (W:), stories (T:), My Words (M:).
    A capitalised word other than a single capital is a name, and names are never kept. */
const GOT_OK = [/^L:[a-z]{1,2}$/, /^[RS]:[a-z]+$/, /^W:([a-z]+|[A-Z]|Qu)$/, /^T:[A-Za-z ]+$/, /^M:[a-z ]+$/];
const lessonKey =(k: string): boolean => /^\d+$/.test(k) && +k < LESSONS;
/** words a child practised: letters and spaces only, never names (they start with a capital) */
const okWord = (w: unknown): w is string => typeof w === 'string' && /^[a-z]+( [a-z]+)?$/.test(w) && w.length <= 16;

/** Read whatever is stored. Returns null only for nothing stored; a damaged save gives fresh() with `damaged` set. */
export function parseSave(raw: string | null): { save: Save; damaged: boolean } | null {
  if (raw == null || raw === '') return null;
  let x: unknown; try { x = JSON.parse(raw); } catch { return { save: fresh(), damaged: true }; }
  if (!isObj(x)) return { save: fresh(), damaged: true };
  const s = fresh();
  s.rev = int(x.rev, 0, 1e9, 0); s.coins = int(x.coins, 0, 1e6, 20); s.plays = int(x.plays, 0, 1e6, 0); s.gifts = int(x.gifts, 0, 1e6, 0);
  s.stars = numMap(x.stars, 1, 3, lessonKey);
  if (isObj(x.done)) for (const k of Object.keys(x.done)) if (lessonKey(k) && x.done[k]) s.done[k] = true;
  if (isObj(x.got)) for (const k of Object.keys(x.got)) if (k.length < 40 && GOT_OK.some(r => r.test(k))) s.got[k] = 1;
  for (const [c, , set] of CATS) {
    const own = isObj(x.own) && Array.isArray(x.own[c]) ? (x.own[c] as unknown[]).filter((id): id is string => typeof id === 'string' && id in set) : [];
    s.own[c] = [...new Set([first(c), ...own])];
    const eq = isObj(x.eq) ? x.eq[c] : undefined;
    s.eq[c] = typeof eq === 'string' && s.own[c].includes(eq) ? eq : first(c);
  }
  s.world = typeof x.world === 'string' && WORLD_IDS.includes(x.world) ? x.world : 'flower';
  s.unl = numMap(x.unl, 0, 99, k => WORLD_IDS.includes(k));
  s.buddy = numMap(x.buddy, 0, 99, k => WORLD_IDS.includes(k));
  s.mine = Array.isArray(x.mine) ? x.mine.filter(okWord).slice(0, 24) : [];
  s.games = numMap(x.games, 0, 1e4, k => k.length < 20);
  s.mute = x.mute === true;
  if (isObj(x.set)) {
    const st = x.set;
    s.set.rate = [0.8, 1, 1.15].includes(Number(st.rate)) ? Number(st.rate) : 1;
    s.set.voice = st.voice === 'claude' ? 'claude' : 'device';
    s.set.calm = st.calm === true; s.set.caps = st.caps !== false; s.set.jump = int(st.jump, 0, LESSONS - 1, 0);
  }
  // never kept: a child's name (older versions stored one)
  return { save: s, damaged: false };
}

/** Another tab saved since we loaded (`base`): keep everything both earned. Progress only ever grows. */
export function mergeSaves(base: Save, mine: Save, theirs: Save): Save {
  const m: Save = structuredClone(mine);
  m.rev = Math.max(mine.rev, theirs.rev);
  m.coins = Math.max(0, theirs.coins + (mine.coins - base.coins));
  m.plays = Math.max(mine.plays, theirs.plays); m.gifts = Math.max(mine.gifts, theirs.gifts);
  for (const k of Object.keys(theirs.stars)) m.stars[k] = Math.max(m.stars[k] ?? 0, theirs.stars[k] ?? 0);
  Object.assign(m.done, theirs.done); Object.assign(m.got, theirs.got);
  for (const [c] of CATS) m.own[c] = [...new Set([...m.own[c], ...theirs.own[c]])];
  for (const k of Object.keys(theirs.unl)) m.unl[k] = Math.max(m.unl[k] ?? 0, theirs.unl[k] ?? 0);
  for (const k of Object.keys(theirs.games)) m.games[k] = Math.max(m.games[k] ?? 0, theirs.games[k] ?? 0);
  m.mine = [...new Set([...mine.mine, ...theirs.mine])].slice(0, 24);
  return m;
}
