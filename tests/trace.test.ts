import { describe, it, expect } from 'vitest';
import { advance, resumeAt, strokeDone, tolerance, lookPoints, farOff, type Pt, type TraceHelp } from '../src/logic/trace';
import { layoutText } from '../src/content/glyphs';

/* Simulate a child's finger on a phone-sized pad: letters ~60px per unit. */
const U = 60;
const toPx = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [20 + x * U, 20 + y * U]);
const STEP = 0.04 * U;
/** follow the line with a wobble of `wob` px and a steady sideways offset of `off` px; returns stroke completed? */
function follow(pts: Pt[], help: TraceHelp, wob: number, off: number, opts: { lift?: boolean; stopAt?: number } = {}): boolean {
  const tol = tolerance(help, U, false), look = lookPoints(U, STEP);
  let i = resumeAt(pts, 0, [pts[0]![0] + off, pts[0]![1] + off], tol, look);
  if (i < 0) return false;
  const end = Math.floor((pts.length - 1) * (opts.stopAt ?? 1));
  for (let k = 0; k <= end; k += 2) {
    if (opts.lift && k === Math.floor(end / 2)) { // finger lifts, then comes back near where it stopped
      const r = resumeAt(pts, i, [pts[i]![0] + off * 0.8, pts[i]![1] - off * 0.8], tol, look); if (r < 0) return false; i = r;
    }
    const [x, y] = pts[k]!; const w = Math.sin(k * 0.7) * wob;
    i = advance(pts, i, [x + off + w, y + off - w], tol, look);
  }
  return strokeDone(pts, i);
}
const strokesOf = (t: string) => layoutText(t).letters.flatMap(l => l.strokes).filter(s => !s.dot).map(s => toPx(s.pts));

describe('tracing is kind to small hands', () => {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  it('a wobbly finger about a third of a line-gap off still finishes every stroke of every letter (easy)', () => {
    for (const c of letters) for (const s of strokesOf(c)) expect(follow(s, 'normal', 10, 18), c).toBe(true);
  });
  it('extra easy accepts an even sloppier finger', () => {
    for (const c of letters) for (const s of strokesOf(c)) expect(follow(s, 'extra', 14, 30), c).toBe(true);
  });
  it('lifting the finger halfway and carrying on works', () => {
    for (const c of 'aBgS') for (const s of strokesOf(c)) expect(follow(s, 'normal', 6, 10, { lift: true }), c).toBe(true);
  });
  it('stopping a little before the end of a stroke still counts', () => {
    for (const s of strokesOf('o')) expect(follow(s, 'normal', 0, 0, { stopAt: 0.9 })).toBe(true);
  });
  it('scribbling somewhere else does not count', () => {
    const s = strokesOf('l')[0]!; const tol = tolerance('normal', U, false), look = lookPoints(U, STEP);
    let i = 0; for (let k = 0; k < 50; k++) i = advance(s, i, [400 + k, 300], tol, look);
    expect(strokeDone(s, i)).toBe(false); expect(farOff(s, 0, [400, 300], tol, look)).toBe(true);
  });
  it('starting from the wrong end is not accepted (direction is part of the lesson)', () => {
    for (const c of 'ltbzS') { const s = strokesOf(c)[0]!; const tol = tolerance('extra', U, false), look = lookPoints(U, STEP);
      expect(resumeAt(s, 0, s[s.length - 1]!, tol, look), c).toBe(-1); }
  });
  it('tidy is stricter than easy, which is stricter than extra easy', () => {
    expect(tolerance('tidy', U, false)).toBeLessThan(tolerance('normal', U, false));
    expect(tolerance('normal', U, false)).toBeLessThan(tolerance('extra', U, false));
    expect(tolerance('normal', 20, false)).toBeGreaterThanOrEqual(32); // tiny letters stay finger-sized
  });
});

describe('lifting the finger', () => {
  it('putting the finger back exactly where it stopped always continues, at any size', () => {
    for (const u of [30, 60, 90]) for (const c of 'aRgSB') for (const s0 of layoutText(c).letters.flatMap(l => l.strokes).filter(s => !s.dot)) {
      const s = s0.pts.map(([x, y]): Pt => [20 + x * u, 20 + y * u]);
      const tol = tolerance('normal', u, false), look = lookPoints(u, 0.04 * u);
      let i = 0; const mid = Math.floor(s.length / 2);
      for (let k = 0; k <= mid; k++) i = advance(s, i, s[k]!, tol, look);
      expect(resumeAt(s, i, [s[mid]![0] + 8, s[mid]![1] - 8], tol, look), `${c} at ${u}px`).toBeGreaterThanOrEqual(i);
    }
  });
});
