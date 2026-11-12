import { describe, it, expect } from 'vitest';
import { planLesson, skillsFor } from '../src/logic/plan';
import { ADDP, SUBP, RHY, rimeOf, confusers, capWrong, decodableAt } from '../src/logic/phonics';
import { parseAsk } from '../src/logic/ask';
import { LESSONS, ORDER } from '../src/content/data';

describe('lesson plan', () => {
  it('every lesson runs the full daily routine', () => {
    for (let n = 0; n < LESSONS; n++) {
      const t = planLesson(n).map(s => s.t);
      expect(t[0], `lesson ${n}`).toMatch(/^rhyme/);
      expect(t, `lesson ${n}`).toContain('meet');
      expect(t.filter(x => x === 'trace').length, `lesson ${n}`).toBe(ORDER[n]!.length === 1 ? 2 : 1);
      if (ORDER[n]!.length === 1) expect(t, `lesson ${n}`).toContain('caseMatch');
      if (n % 5 === 4) expect(t, `lesson ${n}`).toContain('storyQ');
      expect(skillsFor(n).length).toBeGreaterThan(10);
    }
  });
  it('turning capitals off in settings skips only the capital tracing', () => {
    expect(planLesson(0, { caps: false }).filter(s => s.t === 'trace')).toHaveLength(1);
  });
  it('reading and spelling only appear once there are words to read', () => {
    for (let n = 0; n < LESSONS; n++) if (planLesson(n).some(s => s.t === 'read')) expect(decodableAt(n).length).toBeGreaterThanOrEqual(3);
  });
  it('the sound games always have enough words', () => {
    expect(ADDP.length).toBeGreaterThanOrEqual(5); expect(SUBP.length).toBeGreaterThanOrEqual(20); expect(RHY.length).toBeGreaterThanOrEqual(20);
    for (const [small, p, big] of ADDP) expect([p, ...small.ph]).toEqual(big.ph);
    for (const b of RHY) expect(RHY.some(x => x !== b && rimeOf(x) === rimeOf(b))).toBe(true);
  });
  it('tricky look-alike letters come first as wrong answers', () => {
    expect(confusers('b', 3).sort()).toEqual(['d', 'p', 'q']);
    expect(confusers('b', 5)).not.toContain('b');
  });
  it('wrong capitals are always different from the right sentence', () => {
    for (let i = 0; i < 50; i++) { const w = capWrong('Max and Pip ran.'); expect(w).toHaveLength(2); expect(w).not.toContain('Max and Pip ran.'); }
  });
});

describe('Ask Pip', () => {
  it.each([
    ['How do you spell dinosaur?', 'dinosaur', false], ['spell the word rainbow', 'rainbow', false], ['Can you teach me to write elephant', 'elephant', false],
    ['my name is mia', 'Mia', true], ["My sister's name is Ava Rose", 'Ava Rose', true], ['pizza', 'pizza', false], ['ice cream!', 'ice cream', false],
    ['spell 123 cat$', 'cat', false], ['', '', false],
  ])('%s', (said, word, name) => { expect(parseAsk(said)).toEqual({ word, name }); });
  it('keeps requests short', () => { expect(parseAsk('spell supercalifragilisticexpialidocious').word.length).toBeLessThanOrEqual(16); });
});
