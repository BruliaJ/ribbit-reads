cd "$(dirname "$0")"
python3 - <<'PY'
s=open('page.html').read()
js="\n".join(open(f).read() for f in ['hats.js','pals.js','glyphs.js','data.js','app.js','extras.js'])
s=s.replace('/*CSS*/',open('style.css').read()).replace('/*JS*/',js)
open('../index.html','w').write(s)
PY
