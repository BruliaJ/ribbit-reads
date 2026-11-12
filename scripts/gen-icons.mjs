/* Draws Pip as the app icon and launch screen, at every size the iOS and Android projects need.
   Run after changing Pip's look: npm run build && node scripts/gen-icons.mjs (uses the built game's own drawing). */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const BG = '#BDECC9', BG2 = '#7FD49A';
const size = f => { const b = readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const targets = [...walk('ios/App/App/Assets.xcassets'), ...walk('android/app/src/main/res')].filter(f => f.endsWith('.png'));

const server = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 2500));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4174/');
await page.waitForSelector('#brandFrog svg');
const frog = await page.$eval('#brandFrog svg', el => { const c = el.cloneNode(true); c.querySelectorAll('.mo,.ms').forEach(n => n.remove()); return c.outerHTML; });
for (const f of targets) {
  const [w, h] = size(f); const n = f.split('/').pop();
  const kind = n.startsWith('splash') ? 'splash' : n.includes('foreground') ? 'fg' : n.includes('round') ? 'round' : 'icon';
  const s = Math.min(w, h);
  const art = kind === 'splash' ? s * 0.32 : kind === 'fg' ? s * 0.6 : s * 0.82;
  const bg = kind === 'fg' ? 'transparent' : kind === 'splash' ? BG : `radial-gradient(circle at 50% 40%, ${BG}, ${BG2})`;
  const radius = kind === 'round' ? '50%' : '0';
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;width:${w}px;height:${h}px;display:grid;place-items:center;background:${kind === 'round' ? 'transparent' : bg}">
    <div style="width:${s}px;height:${s}px;border-radius:${radius};background:${kind === 'round' ? bg : 'transparent'};display:grid;place-items:center;overflow:hidden">
    <div style="width:${art}px;margin-top:${art * 0.04}px">${frog.replace('<svg ', '<svg style="width:100%;display:block" ')}</div></div></body></html>`);
  const buf = await page.screenshot({ omitBackground: kind === 'fg' || kind === 'round', type: 'png' });
  writeFileSync(f, buf); if (f.includes('AppIcon')) console.log('NOTE: Apple needs the app icon without transparency: python3 -c "from PIL import Image;i=Image.open(\"'+f+'\").convert(\"RGB\");i.save(\"'+f+'\")"'); console.log(kind.padEnd(6), `${w}x${h}`, f);
}
await browser.close(); server.kill();
