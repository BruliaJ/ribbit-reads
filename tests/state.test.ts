import { describe, it, expect } from 'vitest';
import { fresh, parseSave, mergeSaves } from '../src/logic/state';

describe('saved progress', () => {
  it('nothing stored is a new player', () => { expect(parseSave(null)).toBeNull(); expect(parseSave('')).toBeNull(); });
  it('a damaged save is flagged (so it can be backed up) and never crashes', () => {
    for (const raw of ['{', '[]', '"x"', 'null', '42']) { const r = parseSave(raw)!; expect(r.damaged).toBe(true); expect(r.save).toEqual(fresh()); }
  });
  it('keeps real progress and cleans anything odd', () => {
    const r = parseSave(JSON.stringify({ coins: 55, done: { 0: true, 1: true, 99: true, x: true }, stars: { 0: 3, 1: 9, 2: 'a' },
      own: { frog: ['lime', 'gold', 'hacked'], hat: 'no' }, eq: { frog: 'gold', hat: 'crown' }, unl: { flower: 7, moon: 3 }, set: { rate: 3, voice: 'claude', jump: 400 } }))!;
    expect(r.damaged).toBe(false); expect(r.save.coins).toBe(55);
    expect(r.save.done).toEqual({ 0: true, 1: true }); expect(r.save.stars).toEqual({ 0: 3, 1: 3 });
    expect(r.save.own.frog).toEqual(['lime', 'gold']); expect(r.save.eq.frog).toBe('gold'); expect(r.save.eq.hat).toBe('none');
    expect(r.save.unl).toEqual({ flower: 7 }); expect(r.save.set.rate).toBe(1); expect(r.save.set.voice).toBe('claude'); expect(r.save.set.jump).toBe(29);
  });
  it("never keeps a child's name (older versions stored one)", () => {
    const r = parseSave(JSON.stringify({ name: 'Mia', mine: ['Mia', 'dinosaur', 'Leo Smith', 'ice cream'], got: { 'M:Mia': 1, 'M:dinosaur': 1, 'W:Mia': 1, 'W:A': 1, 'W:cat': 1, 'L:s': 1, 'T:Pip Sat': 1 } }))!;
    const json = JSON.stringify(r.save);
    expect(json).not.toContain('Mia'); expect(json).not.toContain('Leo');
    expect(r.save.mine).toEqual(['dinosaur', 'ice cream']);
    expect(Object.keys(r.save.got).sort()).toEqual(['L:s', 'M:dinosaur', 'T:Pip Sat', 'W:A', 'W:cat']);
  });
  it('two tabs: progress from both is kept and coins add up', () => {
    const base = fresh(); base.coins = 50;
    const mine = structuredClone(base); mine.coins = 70; mine.done = { 0: true }; mine.stars = { 0: 2 }; mine.own.hat.push('crown'); mine.unl = { flower: 5 };
    const theirs = structuredClone(base); theirs.coins = 40; theirs.rev = 3; theirs.done = { 1: true }; theirs.stars = { 0: 3, 1: 1 }; theirs.own.frog.push('gold'); theirs.unl = { flower: 7, truck: 5 };
    const m = mergeSaves(base, mine, theirs);
    expect(m.coins).toBe(60); expect(m.done).toEqual({ 0: true, 1: true }); expect(m.stars).toEqual({ 0: 3, 1: 1 });
    expect(m.own.hat).toContain('crown'); expect(m.own.frog).toContain('gold'); expect(m.unl).toEqual({ flower: 7, truck: 5 }); expect(m.rev).toBe(3);
  });
  it('coins never go below zero after a merge', () => {
    const base = fresh(); base.coins = 100; const mine = structuredClone(base); mine.coins = 0; const theirs = structuredClone(base); theirs.coins = 10;
    expect(mergeSaves(base, mine, theirs).coins).toBe(0);
  });
  it('saves from before worlds: paid backgrounds become free worlds and their coins come back (once)', () => {
    const r = parseSave(JSON.stringify({ coins: 10, own: { theme: ['lily', 'candy', 'space'] }, eq: { theme: 'space' } }))!;
    expect(r.save.coins).toBe(10 + 35 + 70); expect(r.save.place).toBe('space');
    const again = parseSave(JSON.stringify(r.save))!;
    expect(again.save.coins).toBe(r.save.coins); expect(again.save.place).toBe('space');
    expect(parseSave(JSON.stringify({ place: 'mars' }))!.save.place).toBe('pond');
  });
});
