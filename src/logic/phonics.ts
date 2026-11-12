/* Sound and spelling rules shared by lessons and games. Pure: no DOM, no storage. */
import { SND, VOW, ORDER, LSND, BANK_SRC, DEC_SRC, DEC_PIC } from '../content/data';

export interface Word { w: string; e: string; ph: string[] | null; sy: string[] }
export interface OneWord extends Word { ph: string[] }
export interface DecWord { w: string; ch: string[]; e: string }

export const sn = (p: string): string => SND[p] ?? p;
export const BANK: Word[] = BANK_SRC.trim().split('\n').map(l => {
  const [w = '', e = '', ph = '', sy = ''] = l.split('|');
  return { w, e, ph: ph ? ph.split(' ') : null, sy: sy ? sy.split('-') : [w] };
});
/** one-part words with their sounds */
export const ONE: OneWord[] = BANK.filter((b): b is OneWord => !!b.ph);
export const MULTI: Word[] = BANK.filter(b => b.sy.length > 1);
export const pics = <T extends { e: string }>(a: T[]): T[] => a.filter(b => b.e);
const firstVowel = (ph: string[]): number => { let k = 0; while (k < ph.length && !VOW.has(ph[k] ?? '')) k++; return k; };
/** the part that rhymes: cat -> "a t" */
export const rimeOf = (b: OneWord): string => b.ph.slice(firstVowel(b.ph)).join(' ');
/** sounds before the first vowel: frog -> f r */
export const onsetOf = (b: OneWord): string[] => b.ph.slice(0, firstVowel(b.ph));
/** the rime as letters, for the voice: "cat" -> "at" */
export const rimeText = (b: Word): string => b.w.slice((b.w.match(/^[^aeiou]*/)?.[0] ?? '').length);
/** words with at least one other picture word that rhymes */
export const RHY: OneWord[] = pics(ONE).filter(b => ONE.some(x => x !== b && x.e && rimeOf(x) === rimeOf(b)));

/** split written letters into sound chunks: ship -> sh,i,p ; duck -> d,u,ck */
export function chunks(word: string): string[] {
  const out: string[] = []; const w = word.toLowerCase(); let i = 0;
  while (i < w.length) {
    const two = w.slice(i, i + 2);
    if (['sh', 'ch', 'th', 'ck', 'qu', 'll', 'ss', 'ff', 'zz'].includes(two)) { out.push(two); i += 2; } else { out.push(w[i] ?? ''); i++; }
  }
  return out;
}
const DOUBLE: Record<string, string> = { ll: 'l', ss: 's', ff: 'f', zz: 'z' };
/** the sound a chunk makes */
export const chunkSnd = (c: string): string => DOUBLE[c] ?? LSND[c] ?? c;
export const DEC: DecWord[] = DEC_SRC.split(' ').map(w => ({ w, ch: chunks(w), e: DEC_PIC[w] ?? '' }));
/** letters (and digraphs) taught by lesson n (0-based, inclusive) */
export function letterSet(n: number): Set<string> {
  const s = new Set(ORDER.slice(0, n + 1)); if (s.has('q')) s.add('qu'); return s;
}
export function canDecode(chs: string[], L: Set<string>): boolean {
  return chs.every(c => L.has(c) || (c.length === 2 && c[0] === c[1] && L.has(c[0] ?? '')));
}
/** words a child can sound out after lesson n */
export const decodableAt = (n: number): DecWord[] => { const L = letterSet(n); return DEC.filter(d => canDecode(d.ch, L)); };

const same = (x: string[], y: string[]): boolean => x.length === y.length && x.every((v, i) => v === y[i]);
/** [small, added sound, big]: nail + s = snail */
export const ADDP: [OneWord, string, OneWord][] = [];
pics(ONE).forEach(big => pics(ONE).forEach(small => {
  if (big.ph.length === small.ph.length + 1 && same(big.ph.slice(1), small.ph)) ADDP.push([small, big.ph[0] ?? '', big]);
}));
/** [from, position, to]: cat -> hat changes position 0 */
export const SUBP: [OneWord, number, OneWord][] = [];
pics(ONE).forEach(x => pics(ONE).forEach(y => {
  if (x !== y && x.ph.length === y.ph.length && x.e !== y.e) {
    const d = x.ph.map((p, i) => (p !== y.ph[i] ? i : -1)).filter(i => i >= 0);
    if (d.length === 1) SUBP.push([x, d[0] ?? 0, y]);
  }
}));

export const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('');
/** letters children mix up (b/d/p/q, n/m/h …) come first as wrong choices */
const CONF: Record<string, string> = { b: 'dpq', d: 'bpq', p: 'qbd', q: 'pdg', n: 'mhu', m: 'nw', u: 'nvy', h: 'nk', i: 'jlt', l: 'it', j: 'ig', t: 'fl', f: 't', a: 'oe', e: 'ca', c: 'eo', o: 'ca', g: 'qy', y: 'gv', v: 'wy', w: 'vm', s: 'z', z: 's', k: 'h', r: 'n', x: 'k' };
export function confusers(t: string, n: number, rnd: () => number = Math.random): string[] {
  const c = (CONF[t] ?? '').split('').filter(Boolean);
  const rest = ABC.filter(x => x !== t && !c.includes(x)).sort(() => rnd() - 0.5);
  return [...c.sort(() => rnd() - 0.5), ...rest].slice(0, n);
}
/** two wrongly capitalized versions of a sentence */
export function capWrong(t: string, rnd: () => number = Math.random): string[] {
  const out = new Set<string>(); out.add((t[0] ?? '').toLowerCase() + t.slice(1));
  const w = t.split(' ');
  w.forEach((x, i) => { if (i > 0 && /^[A-Z]/.test(x)) { const c = w.slice(); c[i] = (x[0] ?? '').toLowerCase() + x.slice(1); out.add(c.join(' ')); } });
  for (let tries = 0; tries < 6; tries++) {
    const k = 1 + Math.floor(rnd() * (w.length - 1)); const c = w.slice(); const word = c[k] ?? '';
    if (/^[a-z]/.test(word)) { c[k] = (word[0] ?? '').toUpperCase() + word.slice(1); out.add(c.join(' ')); break; }
  }
  out.delete(t);
  return [...out].sort(() => rnd() - 0.5).slice(0, 2);
}
