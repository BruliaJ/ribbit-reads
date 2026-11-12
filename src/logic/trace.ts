/* Is the child following the letter? Pure geometry, unit-tested (tests/trace.test.ts).
   Kindness rules (Julia, Nov 13, 2026: "not too hard, as long as kids are close enough to the line"):
   - a wide band around the line (Tracing help setting: extra easy / easy / tidy);
   - progress never goes backwards, wobbles are fine, small skips across a curve are fine;
   - lifting the finger is fine: touch down anywhere near where you stopped (or a little further on) to continue;
   - a stroke counts once most of it is traced (no need to hit the very end);
   - direction still matters (tracing a letter backwards does not count), because stroke direction is what is taught. */
export type Pt = [number, number];
export type TraceHelp = 'extra' | 'normal' | 'tidy';

/** band half-width in letter units (1 unit = the distance between the middle and base lines) */
export const BAND: Record<TraceHelp, number> = { extra: 0.85, normal: 0.62, tidy: 0.42 };
/** smallest band in screen pixels, so small letters stay finger-friendly */
export const MIN_PX: Record<TraceHelp, number> = { extra: 40, normal: 32, tidy: 24 };
/** how far ahead a finger may jump along the line in one move (letter units) */
export const LOOKAHEAD_UNITS = 1.1;
/** fraction of a stroke that counts as finished */
export const DONE_AT = 0.85;

export const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
export function tolerance(help: TraceHelp, unitPx: number, solo: boolean): number {
  return Math.max(MIN_PX[help], unitPx * BAND[help]) * (solo ? 1.1 : 1);
}
/** how many sample points make up the lookahead, for a stroke sampled every `step` px */
export const lookPoints = (unitPx: number, stepPx: number): number => Math.max(6, Math.ceil((LOOKAHEAD_UNITS * unitPx) / Math.max(1, stepPx)));

/** Furthest point ahead (within `look` points) that the finger is close to; `i` if none. Never goes backwards. */
export function advance(pts: Pt[], i: number, p: Pt, tol: number, look: number): number {
  let best = i;
  for (let j = i + 1; j < Math.min(pts.length, i + 1 + look); j++) if (dist(p, pts[j]!) < tol) best = j;
  return best;
}
/** Where touching down may continue the stroke: anywhere along the last stretch already traced, or a little ahead.
    Progress never goes back (a finger put down behind the marker just carries on). -1 if not near. */
export function resumeAt(pts: Pt[], i: number, p: Pt, tol: number, look: number): number {
  let found = -1;
  for (let j = Math.max(0, i - look); j < Math.min(pts.length, i + 1 + Math.ceil(look / 3)); j++) if (dist(p, pts[j]!) < tol * 1.1) { found = Math.max(found, Math.max(i, j)); }
  return found;
}
/** Has enough of the stroke been traced? */
export const strokeDone = (pts: Pt[], i: number): boolean => pts.length <= 2 || i >= Math.floor((pts.length - 1) * DONE_AT);
/** Far off the line (only then do we say "stay on the path") */
export function farOff(pts: Pt[], i: number, p: Pt, tol: number, look: number): boolean {
  let near = Infinity;
  for (let j = Math.max(0, i - 4); j < Math.min(pts.length, i + 1 + look); j++) near = Math.min(near, dist(p, pts[j]!));
  return near > tol * 2.4;
}
