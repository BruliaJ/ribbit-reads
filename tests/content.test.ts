import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ORDER, KEYW, LSND, SND, STORIES, HEART, LESSONS, CAPSENT } from '../src/content/data';
import { WORLDS_PLAY } from '../src/content/worlds';
import { BANK, ONE, DEC, chunks, letterSet, canDecode, decodableAt, chunkSnd } from '../src/logic/phonics';
import { glyph, layoutText } from '../src/content/glyphs';

/* Emoji added in Unicode 14+ (2021) show as empty boxes on older iPads. */
const NEW_EMOJI = /[\u{1FA70}-\u{1FAFF}\u{1FAE0}-\u{1FAFF}\u{1F6DD}-\u{1F6DF}\u{1F7F0}]/u;
const OK_2020 = new Set(['🪵', '🪨', '🪰', '🪁', '🪀', '🪐', '🛖', '🪶', '🪑', '🪙']);
const tooNew = (e: string) => [...e].some(ch => NEW_EMOJI.test(ch) && !OK_2020.has(ch));

describe('content', () => {
  it('has 30 lessons, 6 stories, and every world has 6 regions (one per 5 lessons)', () => { expect(LESSONS).toBe(30); for (const w of WORLDS_PLAY) expect(w.regions, w.id).toHaveLength(LESSONS / 5); expect(STORIES).toHaveLength(6); });
  it('every letter of the day has a keyword, picture, mouth tip and sound', () => {
    for (const L of ORDER) { expect(KEYW[L], L).toBeDefined(); expect(LSND[L], L).toBeDefined(); expect(SND[LSND[L] ?? ''] ?? (LSND[L] === 'ks' || LSND[L] === 'kw' ? 'x' : undefined), L).toBeDefined(); }
  });
  it('every letter can be traced little and big', () => {
    for (const c of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      const g = glyph(c); expect(g, c).not.toBeNull();
      for (const s of g!.strokes) for (const [x, y] of s.pts) { expect(x).toBeGreaterThan(-0.1); expect(x).toBeLessThan(1.6); expect(y).toBeGreaterThan(-0.1); expect(y).toBeLessThan(3.1); }
    }
    expect(layoutText('Qu').letters).toHaveLength(2);
  });
  it('capital letters never reach below the line; only g j p q y do', () => {
    for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhiklmnorstuvwxz') expect(layoutText(c).desc, c).toBe(false);
    for (const c of 'gjpqy') expect(layoutText(c).desc, c).toBe(true);
  });
  it('listening words have known sounds, pictures, and no emoji too new for older iPads', () => {
    for (const b of BANK) {
      expect(b.e, b.w).not.toBe(''); expect(tooNew(b.e), `${b.w} ${b.e}`).toBe(false);
      for (const p of b.ph ?? []) expect(SND[p], `${b.w}: ${p}`).toBeDefined();
    }
    for (const [L, k] of Object.entries(KEYW)) expect(tooNew(k[1]), `${L} ${k[1]}`).toBe(false);
    for (const w of WORLDS_PLAY) for (const r of [w, ...w.regions]) expect(tooNew(r.e), `${w.id} ${r.n} ${r.e}`).toBe(false);
    for (const d of DEC) if (d.e) expect(tooNew(d.e), `${d.w} ${d.e}`).toBe(false);
  });
  it('no two listening words share a picture (a picture must name one word)', () => {
    const seen = new Map<string, string>();
    for (const b of ONE) { expect(seen.get(b.e), `${b.w} and ${seen.get(b.e)} share ${b.e}`).toBeUndefined(); seen.set(b.e, b.w); }
  });
  it('every reading word becomes decodable by the last lesson', () => {
    for (const d of DEC) expect(canDecode(d.ch, letterSet(LESSONS - 1)), d.w).toBe(true);
  });
  it('lesson 1 already has words to read after a few letters', () => { expect(decodableAt(3).length).toBeGreaterThanOrEqual(5); });
  it("each pond's story uses only letters taught by then, plus heart words", () => {
    STORIES.forEach((st, i) => {
      const L = letterSet(i * 5 + 4);
      for (const [text] of st.pages) for (const raw of text.split(' ')) {
        const w = raw.replace(/[^A-Za-z]/g, ''); if (!w || HEART.has(w) || HEART.has(w.toLowerCase())) continue;
        expect(canDecode(chunks(w), L), `${st.t}: "${w}"`).toBe(true);
      }
    });
  });
  it('capital-letter sentences start with a capital and end with a period', () => { for (const s of CAPSENT) expect(s, s).toMatch(/^[A-Z].*\.$/); });
  it('double letters say one sound', () => { expect(chunks('bell')).toEqual(['b', 'e', 'll']); expect(chunkSnd('ll')).toBe('l'); expect(chunks('quick')).toEqual(['qu', 'i', 'ck']); });
  it('no emoji anywhere in the game is too new for older iPads', () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
    for (const f of walk('src').concat('index.html')) {
      const bad = [...readFileSync(f, 'utf8')].filter(ch => tooNew(ch));
      expect([...new Set(bad)].join(''), f).toBe('');
    }
  });
});
