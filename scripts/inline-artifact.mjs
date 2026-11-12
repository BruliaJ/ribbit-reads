/* Turns the artifact build (dist-artifact/) into one self-contained page, artifact.html, for the Claude artifact:
   the artifact host only allows inline code, plus fonts from Google Fonts. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const dir = 'dist-artifact/assets';
const files = readdirSync(dir);
const js = files.filter(f => f.endsWith('.js')).map(f => readFileSync(`${dir}/${f}`, 'utf8'));
const css = files.filter(f => f.endsWith('.css')).map(f => readFileSync(`${dir}/${f}`, 'utf8')).join('\n');
if (js.length !== 1) throw new Error(`expected one script, found ${js.length}`);
const html = readFileSync('dist-artifact/index.html', 'utf8');
const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>')).replace(/<script[^>]*src=[^>]*><\/script>/g, '');
const out = `<title>Ribbit Reads</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Fredoka:wght@500;600;700&family=Nunito:wght@600;800;900&display=swap">
<style>${css}</style>
${body}
<script type="module">${js[0].replace(/<\/script/gi, '<\\/script')}</script>
`;
writeFileSync('artifact.html', out);
console.log(`artifact.html ${(out.length / 1024).toFixed(0)} KB`);
