/* ===================== PRINT LETTERS (ball-and-stick) =====================
   Grid: y=0 top line, y=1 dashed middle line, y=2 base line, y=3 under the line.
   A letter is strokes split by "|"; a stroke is segments split by ";".
   L x1 y1 x2 y2 = straight line; A cx cy rx ry from° to° = arc (screen angles, y down:
   -90 is the top, 90 the bottom; going from a bigger to a smaller angle runs counter-clockwise);
   D x y = a dot to tap. Stroke order follows what is usually taught in kindergarten. */
export const GL: Record<string, string> = {
a:"A .5 1.5 .5 .5 -25 -385|L 1 1 1 2",
b:"L 0 0 0 2|A .5 1.5 .5 .5 180 540",
c:"A .55 1.5 .55 .5 -40 -320",
d:"A .5 1.5 .5 .5 -25 -385|L 1 0 1 2",
e:"L 0 1.5 1 1.5;A .5 1.5 .5 .5 0 -320",
f:"A .7 .45 .32 .4 -20 -180;L .38 .45 .38 2|L 0 1 .8 1",
g:"A .5 1.5 .5 .5 -25 -385|L 1 1 1 2.6;A .55 2.6 .45 .4 0 160",
h:"L 0 0 0 2|A .5 1.5 .5 .5 180 360;L 1 1.5 1 2",
i:"L .3 1 .3 2|D .3 .45",
j:"L .6 1 .6 2.6;A .25 2.6 .35 .4 0 160|D .6 .45",
k:"L 0 0 0 2|L .85 1 .05 1.6|L .3 1.4 .9 2",
l:"L .3 0 .3 2",
m:"L 0 1 0 2|A .3 1.4 .3 .4 180 360;L .6 1.4 .6 2|A .9 1.4 .3 .4 180 360;L 1.2 1.4 1.2 2",
n:"L 0 1 0 2|A .5 1.5 .5 .5 180 360;L 1 1.5 1 2",
o:"A .5 1.5 .5 .5 -90 -450",
p:"L 0 1 0 3|A .5 1.5 .5 .5 180 540",
q:"A .5 1.5 .5 .5 -25 -385|L 1 1 1 3;L 1 3 1.25 2.75",
r:"L 0 1 0 2|A .5 1.5 .5 .5 180 300",
s:"A .5 1.25 .42 .25 -30 -270;A .5 1.75 .45 .25 -90 150",
t:"L .4 .3 .4 2|L 0 1 .8 1",
u:"L 0 1 0 1.5;A .5 1.5 .5 .5 180 0|L 1 1 1 2",
v:"L 0 1 .5 2;L .5 2 1 1",
w:"L 0 1 .3 2;L .3 2 .6 1.2;L .6 1.2 .9 2;L .9 2 1.2 1",
x:"L 0 1 1 2|L 1 1 0 2",
y:"L 0 1 .5 2|L 1 1 .2 3",
z:"L 0 1 1 1;L 1 1 0 2;L 0 2 1 2",
A:"L .6 0 0 2|L .6 0 1.2 2|L .25 1.3 .95 1.3",
B:"L 0 0 0 2|L 0 0 .55 0;A .55 .5 .42 .5 -90 90;L .55 1 0 1|L 0 1 .62 1;A .62 1.5 .45 .5 -90 90;L .62 2 0 2",
C:"A .62 1 .62 1 -40 -320",
D:"L 0 0 0 2|L 0 0 .45 0;A .45 1 .65 1 -90 90;L .45 2 0 2",
E:"L 0 0 0 2|L 0 0 .9 0|L 0 1 .75 1|L 0 2 .9 2",
F:"L 0 0 0 2|L 0 0 .9 0|L 0 1 .75 1",
G:"A .62 1 .62 1 -40 -360;L 1.24 1 .75 1",
H:"L 0 0 0 2|L 1 0 1 2|L 0 1 1 1",
I:"L .45 0 .45 2|L 0 0 .9 0|L 0 2 .9 2",
J:"L .8 0 .8 1.45;A .42 1.45 .38 .55 0 180",
K:"L 0 0 0 2|L .95 0 .05 1.15|L .35 .85 1 2",
L:"L 0 0 0 2;L 0 2 .9 2",
M:"L 0 0 0 2|L 0 0 .65 1.4;L .65 1.4 1.3 0;L 1.3 0 1.3 2",
N:"L 0 0 0 2|L 0 0 1.05 2;L 1.05 2 1.05 0",
O:"A .65 1 .65 1 -90 -450",
P:"L 0 0 0 2|L 0 0 .5 0;A .5 .5 .45 .5 -90 90;L .5 1 0 1",
Q:"A .65 1 .65 1 -90 -450|L .75 1.45 1.35 2.15",
R:"L 0 0 0 2|L 0 0 .5 0;A .5 .5 .45 .5 -90 90;L .5 1 0 1|L .4 1 1 2",
S:"A .55 .5 .5 .5 -25 -270;A .55 1.5 .52 .5 -90 155",
T:"L 0 0 1.2 0|L .6 0 .6 2",
U:"L 0 0 0 1.4;A .55 1.4 .55 .6 180 0;L 1.1 1.4 1.1 0",
V:"L 0 0 .6 2;L .6 2 1.2 0",
W:"L 0 0 .35 2;L .35 2 .7 .6;L .7 .6 1.05 2;L 1.05 2 1.4 0",
X:"L 0 0 1.1 2|L 1.1 0 0 2",
Y:"L 0 0 .6 1|L 1.2 0 .6 1|L .6 1 .6 2",
Z:"L 0 0 1.1 0;L 1.1 0 0 2;L 0 2 1.1 2"};
export type Pt = [number, number];
export interface Stroke { pts: Pt[]; dot: boolean }
export interface Glyph { strokes: Stroke[]; minx: number; maxx: number; w: number }
const GCACHE: Record<string, Glyph> = {};
export function glyph(ch: string): Glyph | null {if(GCACHE[ch])return GCACHE[ch];const src=GL[ch];if(!src)return null;
  const strokes: Stroke[]=src.split("|").map(st=>{let pts: Pt[]=[],dot=false;
    st.split(";").forEach(seg=>{const p=seg.trim().split(/\s+/);const k=p.shift();const n=p.map(Number) as number[];
      if(k==="L"){const [x1=0,y1=0,x2=0,y2=0]=n;const len=Math.hypot(x2-x1,y2-y1);const m=Math.max(2,Math.ceil(len/.04));for(let i=0;i<=m;i++){if(pts.length&&i===0)continue;pts.push([x1+(x2-x1)*i/m,y1+(y2-y1)*i/m])}}
      else if(k==="A"){const [cx=0,cy=0,rx=0,ry=0,a0=0,a1=0]=n;const len=Math.abs(a1-a0)/360*2*Math.PI*Math.max(rx,ry);const m=Math.max(4,Math.ceil(len/.04));for(let i=0;i<=m;i++){if(pts.length&&i===0)continue;const a=(a0+(a1-a0)*i/m)*Math.PI/180;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)])}}
      else if(k==="D"){dot=true;pts=[[n[0]??0,n[1]??0]]}});
    return {pts,dot}});
  let minx=1e9,maxx=-1e9;strokes.forEach(s=>s.pts.forEach(p=>{minx=Math.min(minx,p[0]);maxx=Math.max(maxx,p[0])}));
  return GCACHE[ch]={strokes,minx,maxx,w:maxx-minx}}
/* lay out a word: letters side by side with a little gap; spaces are wider */
export interface Laid { ch: string; strokes: Stroke[] }
export function layoutText(t: string): { letters: Laid[]; w: number; desc: boolean } {let x=0;const out: Laid[]=[];for(const ch of t){if(ch===" "){x+=.9;continue}const g=glyph(ch);if(!g)continue;
  out.push({ch,strokes:g.strokes.map(s=>({dot:s.dot,pts:s.pts.map((p): Pt=>[p[0]-g.minx+x,p[1]])}))});x+=g.w+.42}
  const hasDesc=out.some(o=>o.strokes.some(s=>s.pts.some(p=>p[1]>2.2)));
  return {letters:out,w:Math.max(.5,x-.42),desc:hasDesc}}
