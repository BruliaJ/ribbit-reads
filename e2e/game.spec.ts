import { test, expect, type Page } from '@playwright/test';

/* Plays the real built game. `?e2e` exposes a small test hook (window.__rr); it only jumps around, it can't change rules. */
const SCREENS = ['map', 'abc', 'words', 'games', 'closet', 'book', 'grown'] as const;

async function open(page: Page, errors: string[], outside: string[]) {
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('request', r => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !u.protocol.startsWith('data')) outside.push(r.url()); });
  await page.goto('/?e2e');
  await expect(page.locator('#playBtn')).toBeVisible();
  await page.evaluate(() => { (window as any).__rr.S().mute = true; });
}
const noSideScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

test('every screen loads, fits the screen, and nothing is fetched from other servers', async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  for (const s of SCREENS) {
    await page.evaluate(id => (window as any).__rr.show(id), s);
    await page.waitForTimeout(150);
    expect(await noSideScroll(page), `${s} scrolls sideways`).toBe(true);
  }
  for (const g of ['rhyme', 'fly', 'hop', 'match']) {
    await page.evaluate(id => { (window as any).__rr.S().done = { 0: true, 1: true, 2: true, 3: true }; (window as any).__rr.startGame(id); }, g);
    await page.waitForTimeout(400);
    expect(await noSideScroll(page), `${g} game scrolls sideways`).toBe(true);
  }
  expect(errors).toEqual([]); expect(outside).toEqual([]);
});

test('every step of all 30 lessons shows something to do, without errors', async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  const empty = await page.evaluate(() => {
    const rr = (window as any).__rr; const bad: string[] = [];
    for (let n = 0; n < 30; n++) {
      rr.startLesson(n); const steps = rr.LS().steps;
      for (let k = 0; k < steps.length; k++) {
        rr.step(k); const card = document.querySelector('#stage .card');
        if (!card || card.querySelectorAll('button').length === 0) bad.push(`${n}:${steps[k].t}`);
        if (document.documentElement.scrollWidth > innerWidth + 1) bad.push(`${n}:${steps[k].t} scrolls sideways`);
      }
    }
    return bad;
  });
  expect(empty).toEqual([]); expect(errors).toEqual([]);
});

test('tracing a letter with a finger finishes it, little and capital, then on your own', async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  for (const text of ['a', 'B', 'Qu']) {
    await page.evaluate(t => (window as any).__rr.startLesson(0, { custom: true, abc: true, letter: 'a', n: 1, steps: [{ t: 'trace', text: t, label: 'x' }, { t: 'caseMatch', L: 'a', dir: 'up' }] }), text);
    await expect(page.locator('#stage .feedback')).toContainText(/trace it|turn/i, { timeout: 15000 });
    for (const phase of ['trace', 'solo']) {
      await page.waitForTimeout(phase === 'solo' ? 1100 : 200);
      const path = await page.evaluate(() => { const r = document.querySelector('#pw canvas')!.getBoundingClientRect(); return (window as any).__rr.pad().path().map((s: any) => ({ dot: s.dot, pts: s.pts.map((q: number[]) => [q[0]! + r.left, q[1]! + r.top]) })); });
      for (const s of path) {
        if (s.dot) { await page.mouse.click(s.pts[0][0], s.pts[0][1]); continue; }
        await page.mouse.move(s.pts[0][0], s.pts[0][1]); await page.mouse.down();
        for (const q of s.pts) await page.mouse.move(q[0] + 2, q[1] - 2);
        await page.mouse.up();
      }
      if (phase === 'trace') await expect(page.locator('#stage .feedback')).toContainText(/own/i);
    }
    await expect(page.locator('#stage .mode')).toHaveText(/big and little/i, { timeout: 5000 });
  }
  expect(errors).toEqual([]);
});

test('Back leaves a lesson without losing it: the pond offers "Keep going" at the same step', async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  await page.click('#playBtn');
  await expect(page).toHaveURL(/#lesson$/);
  await page.evaluate(() => (window as any).__rr.step(3));
  await page.goBack();
  await expect(page).toHaveURL(/#pond$/);
  await expect(page.locator('#resumeBtn')).toBeVisible();
  await page.click('#resumeBtn');
  expect(await page.evaluate(() => (window as any).__rr.LS().k)).toBe(3);
  await page.click('#quit');
  await expect(page.locator('#resumeBtn')).toBeVisible();
  await page.click('header [data-go="abc"]'); await expect(page).toHaveURL(/#abc$/);
  await page.goBack(); await expect(page).toHaveURL(/#pond$/);
  expect(errors).toEqual([]);
});

test('finishing a lesson is saved, survives a reload, and unlocks pals that never re-lock', async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  await page.evaluate(() => { const rr = (window as any).__rr; rr.startLesson(0); rr.LS().k = rr.LS().steps.length - 1; rr.finish(); });
  await expect(page.locator('#reward')).toBeVisible();
  await page.reload(); await page.waitForTimeout(300);
  const s = await page.evaluate(() => (window as any).__rr.S());
  expect(s.done['0']).toBe(true); expect(s.unl.flower).toBe(5); expect(s.coins).toBeGreaterThan(20);
  expect(errors).toEqual([]);
});

test('a damaged save is backed up, and the game still starts', async ({ page }) => {
  await page.goto('/?e2e');
  await page.evaluate(() => localStorage.setItem('ribbitreads.v1', '{broken'));
  await page.reload();
  await expect(page.locator('#playBtn')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('ribbitreads.backup'))).toBe('{broken');
});

test("a child's name can be practised but is never stored", async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  await page.click('header [data-go="words"]');
  await page.fill('#inWord', 'mia'); await page.check('#isName');
  await expect(page.locator('#wordPrev')).toContainText('Mia');
  await page.click('#teachBtn');
  await page.evaluate(() => { const rr = (window as any).__rr; rr.LS().k = rr.LS().steps.length - 1; rr.finishCustom(); });
  await page.evaluate(() => (window as any).__rr.teachWord('dinosaur', false));
  const stored = await page.evaluate(() => localStorage.getItem('ribbitreads.v1') ?? '');
  expect(stored).not.toContain('Mia'); expect(stored).toContain('dinosaur');
  expect(errors).toEqual([]);
});

test('grown-ups area needs the number in digits', async ({ page }) => {
  const errors: string[] = [], outside: string[] = [];
  await open(page, errors, outside);
  await page.click('header [data-go="grown"]');
  await page.fill('#gateIn', '1'); await page.click('#gateGo');
  await expect(page.locator('#gateMsg')).toContainText(/not it/);
  const words = await page.locator('#grownBody b').first().textContent();
  const n = await page.evaluate(w => { const N = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; const T = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']; const TE = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const [h, rest] = w!.split(' hundred'); let v = N.indexOf(h!) * 100; const r = (rest ?? '').trim(); if (r) { if (TE.includes(r)) v += 10 + TE.indexOf(r); else { const [t, o] = r.split('-'); const ti = T.indexOf(t!); if (ti > 0) v += ti * 10 + (o ? N.indexOf(o) : 0); else v += N.indexOf(t!); } } return v; }, words);
  await page.fill('#gateIn', String(n)); await page.click('#gateGo');
  await expect(page.locator('#resetBtn')).toBeVisible();
  expect(errors).toEqual([]);
});
