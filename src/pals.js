/* ===================== PALS — mermaids, trucks and dragons =====================
   Every pal is drawn in a 120×120 box standing on y≈112. `hat` is where a hat sits (x, y, scale). */
const SKN={a:"#FFDCC2",b:"#F2C29B",c:"#D79A6B",d:"#A86B44",e:"#7A4B2E"};
const PK=(n,sp,o)=>Object.assign({n,sp},o);
const ROSTER={
 flower:[PK("Sunny","flower",{kind:"sun",pet:"#FFC531",mid:"#C98B4E",pot:"#E2674E"}),PK("Daisy","flower",{kind:"round",pet:"#FFFFFF",mid:"#FFD23F",pot:"#3E8EF0"}),PK("Tulip","flower",{kind:"tulip",pet:"#FF5A7A",mid:"#FFD9E0",pot:"#FFB81F"}),
  PK("Violet","flower",{kind:"round",pet:"#9B6BFF",mid:"#FFE27A",pot:"#12A386"}),PK("Rosie","flower",{kind:"tulip",pet:"#E8352E",mid:"#FFD6D6",pot:"#8E6BD8"}),PK("Poppy","flower",{kind:"point",pet:"#FF6B3D",mid:"#FFE3B3",pot:"#3E8EF0"}),
  PK("Bluebell","flower",{kind:"point",pet:"#5CA8FF",mid:"#FFF1CC",pot:"#FF8FC4"}),PK("Petal","flower",{kind:"round",pet:"#FF9EC7",mid:"#FFE27A",pot:"#5CC98F"}),PK("Clover","flower",{kind:"clover",pet:"#5CC98F",mid:"#D7FFE3",pot:"#C8743A"}),
  PK("Lily","flower",{kind:"tulip",pet:"#FFF6D8",mid:"#FFE27A",pot:"#2C3AA0"}),PK("Pansy","flower",{kind:"point",pet:"#B48CFF",mid:"#FFD23F",pot:"#FFB81F"}),PK("Goldbloom","flower",{kind:"sun",pet:"#FFE27A",mid:"#E0A100",pot:"#FFD23F",gold:1})],
 mermaid:[PK("Marina","mermaid",{skin:SKN.b,hair:"#E8504F",tail:"#22B8A7",top:"#FFD23F"}),PK("Coral","mermaid",{skin:SKN.d,hair:"#2B1B14",tail:"#FF7FA8",top:"#7FE3D4"}),PK("Kai","mermaid",{skin:SKN.c,hair:"#1D2B53",tail:"#3E8EF0",top:"",boy:1}),
  PK("Pearl","mermaid",{skin:SKN.a,hair:"#F4D35E",tail:"#B48CFF",top:"#FFFFFF"}),PK("Nami","mermaid",{skin:SKN.e,hair:"#7A3FE0",tail:"#FFB81F",top:"#FF6FA8"}),PK("Finn","mermaid",{skin:SKN.a,hair:"#C8743A",tail:"#12A386",top:"",boy:1}),
  PK("Shelly","mermaid",{skin:SKN.c,hair:"#FF8FC4",tail:"#5CC8FF",top:"#FFE27A"}),PK("Ripple","mermaid",{skin:SKN.b,hair:"#3EC6A8",tail:"#7A3FE0",top:"#FFFFFF"}),PK("Luna","mermaid",{skin:SKN.d,hair:"#E9EEF9",tail:"#2C3AA0",top:"#B4C2FF"}),
  PK("Splash","mermaid",{skin:SKN.e,hair:"#111",tail:"#FF6B3D",top:"",boy:1}),PK("Bubbles","mermaid",{skin:SKN.a,hair:"#7FD3FF",tail:"#FF8FC4",top:"#FFD23F"}),PK("Goldie","mermaid",{skin:SKN.b,hair:"#FFC531",tail:"#E0A100",top:"#FFF2A6",gold:1})],
 truck:[PK("Dumpy","truck",{kind:"dump",c:"#FFB81F"}),PK("Siren","truck",{kind:"fire",c:"#E8352E"}),PK("Sprinkles","truck",{kind:"icecream",c:"#FF9EC7"}),
  PK("Bigfoot","truck",{kind:"monster",c:"#3EB65A"}),PK("Chomp","truck",{kind:"garbage",c:"#2F8F5B"}),PK("Mixie","truck",{kind:"mixer",c:"#3E8EF0"}),
  PK("Rusty","truck",{kind:"tow",c:"#C8743A"}),PK("Scoop","truck",{kind:"icecream",c:"#7FE3D4"}),PK("Dash","truck",{kind:"monster",c:"#7A3FE0"}),
  PK("Tipper","truck",{kind:"dump",c:"#FF6B3D"}),PK("Blaze","truck",{kind:"fire",c:"#FF8A1F"}),PK("Goldy","truck",{kind:"mixer",c:"#E0A100",gold:1})],
 dragon:[PK("Ember","dragon",{c:"#5CC98F",c2:"#2E8B57",belly:"#FFE6A8"}),PK("Frost","dragon",{c:"#8FD3FF",c2:"#3E7FD8",belly:"#FFFFFF"}),PK("Blossom","dragon",{c:"#FF9EC7",c2:"#B0487A",belly:"#FFF1CC"}),
  PK("Sparky","dragon",{c:"#FFC531",c2:"#E0742A",belly:"#FFF6D8"}),PK("Mochi","dragon",{c:"#F4F0FF",c2:"#8E6BD8",belly:"#FFE3EF"}),PK("Blaze","dragon",{c:"#FF6B5B",c2:"#B8322A",belly:"#FFE0A3"}),
  PK("Pebble","dragon",{c:"#A9B3C2",c2:"#5D6488",belly:"#E9EEF5"}),PK("Ziggy","dragon",{c:"#B48CFF",c2:"#5524AE",belly:"#D7FFF3"}),PK("Glacier","dragon",{c:"#DDF6FF",c2:"#5CC8D8",belly:"#FFFFFF"}),
  PK("Moss","dragon",{c:"#8BC34A",c2:"#4E7A22",belly:"#F3FFD6"}),PK("Night","dragon",{c:"#2C3AA0",c2:"#141B3D",belly:"#9FB0FF"}),PK("Goldscale","dragon",{c:"#FFD23F",c2:"#C98500",belly:"#FFF6C9",gold:1})]};
const OL="#262150";const SKW=`stroke="${OL}" stroke-width="2.6" stroke-linejoin="round"`;
function shadeC(hex,a){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=a<0?0:255,t=Math.abs(a);r=Math.round(r+(f-r)*t);g=Math.round(g+(f-g)*t);b=Math.round(b+(f-b)*t);return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function faceEyes(x1,x2,y,r=4.6){return `<g class="eyes">${[x1,x2].map(x=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*1.22}" fill="${OL}"/><circle cx="${x+1.5}" cy="${y-2}" r="${r*.42}" fill="#fff"/><circle cx="${x-1.4}" cy="${y+2}" r="${r*.2}" fill="#fff"/>`).join("")}</g>`}
function mouth(x,y,w=6){return `<path class="mm" d="M${x-w} ${y} Q${x} ${y+w*.9} ${x+w} ${y}" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path class="mo" d="M${x-w} ${y-1} Q${x} ${y+w*1.5} ${x+w} ${y-1}Z" fill="#B23A4A" stroke="${OL}" stroke-width="2.2" stroke-linejoin="round"/><path class="ms" d="M${x-w*.8} ${y+3} Q${x} ${y-2} ${x+w*.8} ${y+3}" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`}
function mermaidSVG(p){const sk=p.skin,h=p.hair,t=p.tail,td=shadeC(t,-.25),tl=shadeC(t,.35);
  const longHair=p.boy?"":`<path d="M34 40 Q28 62 32 86 Q38 92 46 84 Q42 64 46 44Z M86 40 Q92 62 88 86 Q82 92 74 84 Q78 64 74 44Z" fill="${h}" ${SKW}/>`;
  const scales=[[54,84],[64,84],[58,92],[68,92],[63,99],[73,98]].map(([x,y])=>`<path d="M${x-4} ${y} q4 4 8 0" stroke="${td}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join("");
  return `<g class="tl"><path d="M46 74 C40 96 52 108 70 106 C84 105 92 98 96 90 L92 84 C86 92 78 95 70 94 C60 93 60 84 74 76 Z" fill="${t}" ${SKW}/>
   <path d="M93 88 C99 74 114 74 117 82 C108 84 104 90 107 102 C99 101 94 95 93 88Z" fill="${tl}" ${SKW}/><path d="M100 84 l8 -3 M101 90 l9 1" stroke="${td}" stroke-width="1.8" stroke-linecap="round"/></g>${scales}
   ${longHair}
   <path d="M42 62 Q60 56 78 62 L76 80 Q60 86 44 80Z" fill="${sk}" ${SKW}/>
   ${p.top?`<path d="M44 64 Q52 60 58 66 Q60 70 62 66 Q68 60 76 64 L75 72 Q68 68 62 73 Q60 75 58 73 Q52 68 45 72Z" fill="${p.top}" ${SKW}/>`:`<path d="M52 70 q3 2 6 0 M62 70 q3 2 6 0" stroke="${shadeC(sk,-.25)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`}
   <path d="M43 76 Q60 84 77 76 L76 82 Q60 90 44 82Z" fill="${td}" ${SKW}/>
   <path class="al" d="M44 64 Q34 70 36 80 Q40 82 42 78 Q42 72 47 68Z" fill="${sk}" ${SKW}/><path class="ar" d="M76 64 Q86 70 84 80 Q80 82 78 78 Q78 72 73 68Z" fill="${sk}" ${SKW}/>
   <circle cx="60" cy="40" r="23" fill="${sk}" ${SKW}/>
   <path d="M37 42 Q34 14 60 14 Q87 14 83 42 Q80 30 72 27 Q70 33 62 33 Q66 28 64 25 Q56 32 44 31 Q40 35 37 42Z" fill="${h}" ${SKW}/>
   ${faceEyes(51,69,44)}<circle cx="45" cy="51" r="4" fill="#FF8FA3" opacity=".55"/><circle cx="75" cy="51" r="4" fill="#FF8FA3" opacity=".55"/>${mouth(60,53,5)}
   <g transform="translate(80 22) rotate(18)"><path d="M0 -7 L2 -2 7 -2 3 1.5 4.6 6.5 0 3.6 -4.6 6.5 -3 1.5 -7 -2 -2 -2Z" fill="${p.gold?"#FFD23F":"#FF8A5B"}" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/></g>
   ${p.gold?`<path d="M44 18 l4 -8 4 6 8 -10 8 10 4 -6 4 8Z" fill="#FFD23F" ${SKW}/>`:""}`}
function dragonSVG(p){const c=p.c,c2=p.c2,b=p.belly;
  return `<g class="tl"><path d="M80 92 Q100 96 104 80 Q106 70 112 66" stroke="${OL}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M80 92 Q100 96 104 80 Q106 70 112 66" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M108 58 L120 62 L112 72 Z" fill="${c2}" ${SKW}/></g>
   <path class="al" d="M40 64 Q14 44 10 62 Q18 62 18 70 Q26 66 30 74 Q34 68 42 74Z" fill="${c2}" ${SKW}/><path class="ar" d="M80 64 Q106 44 110 62 Q102 62 102 70 Q94 66 90 74 Q86 68 78 74Z" fill="${c2}" ${SKW}/>
   <ellipse cx="60" cy="82" rx="26" ry="24" fill="${c}" ${SKW}/><ellipse cx="60" cy="86" rx="16" ry="17" fill="${b}" ${SKW}/>
   <path d="M47 80 h26 M46 88 h28 M49 96 h22" stroke="${shadeC(b,-.18)}" stroke-width="2" stroke-linecap="round"/>
   <ellipse cx="46" cy="106" rx="9" ry="6" fill="${c}" ${SKW}/><ellipse cx="74" cy="106" rx="9" ry="6" fill="${c}" ${SKW}/>
   <path d="M44 22 L40 6 L52 18Z M76 22 L80 6 L68 18Z" fill="${c2}" ${SKW}/>
   <path d="M52 17 l4 -8 4 7 4 -7 4 8" fill="${c2}" ${SKW}/>
   <ellipse cx="60" cy="42" rx="28" ry="25" fill="${c}" ${SKW}/>
   <ellipse cx="60" cy="54" rx="15" ry="9" fill="${shadeC(c,.3)}" stroke="${OL}" stroke-width="2"/><circle cx="55" cy="51" r="1.6" fill="${OL}"/><circle cx="65" cy="51" r="1.6" fill="${OL}"/>
   ${faceEyes(48,72,38,5.2)}<circle cx="38" cy="50" r="4.4" fill="#FF8FA3" opacity=".5"/><circle cx="82" cy="50" r="4.4" fill="#FF8FA3" opacity=".5"/>${mouth(60,58,6)}<path d="M64 60 l1.6 4 1.8 -4.4" fill="#fff" stroke="${OL}" stroke-width="1.2"/>
   ${p.gold?`<path d="M44 16 l4 -8 4 6 8 -10 8 10 4 -6 4 8Z" fill="#FFD23F" ${SKW}/>`:""}`}
function truckSVG(p){const c=p.c,cd=shadeC(c,-.28),cl=shadeC(c,.35),k=p.kind,big=k==="monster";const dy=big?-12:0;
  let back="",top="";
  if(k==="dump")back=`<path d="M14 ${30+dy} L106 ${30+dy} L100 ${50+dy} L20 ${50+dy}Z" fill="${cd}" ${SKW}/><path d="M18 ${36+dy} h84" stroke="${cl}" stroke-width="3"/><path d="M40 ${30+dy} q6 -10 14 -6 q8 -8 16 0 q8 -4 10 6Z" fill="#A8743A" ${SKW}/>`;
  if(k==="fire")back=`<path d="M22 ${36+dy} L98 ${28+dy}" stroke="#C9CED8" stroke-width="8" stroke-linecap="round"/><path d="M22 ${36+dy} L98 ${28+dy}" stroke="${OL}" stroke-width="1.6" stroke-dasharray="1 8"/>`,top=`<rect x="48" y="${32+dy}" width="24" height="10" rx="5" fill="#3E8EF0" ${SKW}/><rect x="48" y="${32+dy}" width="12" height="10" rx="5" fill="#FF4D4D" class="blink"/>`;
  if(k==="icecream")top=`<path d="M52 ${40+dy} L60 ${18+dy} L68 ${40+dy}Z" fill="#E0A85A" ${SKW}/><circle cx="60" cy="${14+dy}" r="11" fill="#FFF1F7" ${SKW}/><circle cx="60" cy="${6+dy}" r="8" fill="#FF8FC4" ${SKW}/><circle cx="60" cy="${-2+dy}" r="3" fill="#E8352E" stroke="${OL}" stroke-width="1.6"/>`;
  if(k==="garbage")back=`<rect x="16" y="${26+dy}" width="88" height="22" rx="6" fill="${cd}" ${SKW}/><path d="M30 ${26+dy} v22 M50 ${26+dy} v22 M70 ${26+dy} v22 M90 ${26+dy} v22" stroke="${cl}" stroke-width="2.5"/><path d="M84 ${24+dy} q4 -10 12 -4" stroke="${OL}" stroke-width="2.4" fill="none"/><circle cx="96" cy="${18+dy}" r="4" fill="#9ACB55" stroke="${OL}" stroke-width="2"/>`;
  if(k==="mixer")back=`<ellipse cx="60" cy="${34+dy}" rx="44" ry="16" fill="${cl}" ${SKW}/><path d="M28 ${24+dy} q10 20 20 22 M52 ${20+dy} q10 22 20 26 M78 ${22+dy} q10 18 14 22" stroke="${cd}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if(k==="tow")back=`<path d="M86 ${44+dy} L104 ${16+dy} L108 ${24+dy}" stroke="#5D6488" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M108 ${24+dy} v10 q0 6 -6 4" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>`,top=`<rect x="50" y="${34+dy}" width="20" height="8" rx="4" fill="#FFB81F" ${SKW}/>`;
  const wy=big?96:94,wr=big?14:9;
  const wheels=[30,90].map(x=>big?`<g><circle cx="${x}" cy="${wy}" r="${wr}" fill="#2B2B38" ${SKW}/><circle cx="${x}" cy="${wy}" r="6" fill="#C9CED8" stroke="${OL}" stroke-width="2"/></g>`:`<rect x="${x-9}" y="${wy-4}" width="18" height="20" rx="6" fill="#2B2B38" ${SKW}/>`).join("");
  return `${back}${wheels}
   <path d="M22 ${46+dy} Q22 ${40+dy} 28 ${40+dy} H92 Q98 ${40+dy} 98 ${46+dy} V${90+dy} H22Z" fill="${c}" ${SKW}/>
   <rect x="31" y="${46+dy}" width="58" height="24" rx="9" fill="#BFE9FF" ${SKW}/><path d="M36 ${50+dy} l10 0 -8 10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
   <g transform="translate(0 ${dy})">${faceEyes(49,71,58,5)}</g>
   <rect x="42" y="${74+dy}" width="36" height="12" rx="6" fill="#E9EEF5" ${SKW}/><g transform="translate(0 ${dy})">${mouth(60,78,7)}</g>
   <circle cx="31" cy="${80+dy}" r="5" fill="#FFE27A" ${SKW}/><circle cx="89" cy="${80+dy}" r="5" fill="#FFE27A" ${SKW}/>
   <rect x="16" y="${88+dy}" width="88" height="8" rx="4" fill="#A9B3C2" ${SKW}/>
   <rect x="12" y="${50+dy}" width="9" height="12" rx="3" fill="${cd}" ${SKW}/><rect x="99" y="${50+dy}" width="9" height="12" rx="3" fill="${cd}" ${SKW}/>
   <circle cx="34" cy="${66+dy}" r="3.6" fill="#FF8FA3" opacity=".6"/><circle cx="86" cy="${66+dy}" r="3.6" fill="#FF8FA3" opacity=".6"/>
   ${top}${p.gold?`<path d="M30 ${44+dy} l60 0" stroke="#fff" stroke-width="3" opacity=".7"/>`:""}`}
function flowerSVG(p){const k=p.kind,pc=p.pet,pd=shadeC(pc,-.22),cx=60,cy=42;let petals="";
  if(k==="round"||k==="point"||k==="sun"||k==="clover"){const n=k==="sun"?16:k==="clover"?4:k==="point"?8:7;const r=k==="sun"?27:k==="clover"?22:25;
    for(let i=0;i<n;i++){const a=i*360/n;petals+=k==="point"?`<path d="M0 -14 Q9 -26 0 -42 Q-9 -26 0 -14Z" fill="${pc}" ${SKW} transform="translate(${cx} ${cy}) rotate(${a})"/>`:k==="clover"?`<path d="M0 -10 C-16 -16 -20 -36 -6 -38 Q0 -38 0 -32 Q0 -38 6 -38 C20 -36 16 -16 0 -10Z" fill="${pc}" ${SKW} transform="translate(${cx} ${cy}) rotate(${a+45})"/>`:`<ellipse cx="0" cy="${-r}" rx="${k==="sun"?6:11}" ry="${k==="sun"?13:14}" fill="${pc}" ${SKW} transform="translate(${cx} ${cy}) rotate(${a})"/>`}}
  if(k==="tulip")petals=`<path d="M34 46 Q30 18 42 8 Q50 22 60 14 Q70 22 78 8 Q90 18 86 46 Q60 60 34 46Z" fill="${pc}" ${SKW}/><path d="M60 14 Q52 30 54 50 M60 14 Q68 30 66 50" stroke="${pd}" stroke-width="2.4" fill="none"/>`;
  const faceR=k==="sun"?19:k==="tulip"?0:17;
  return `<path d="M60 60 Q58 80 60 96" stroke="#3E9E4A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M60 60 Q58 80 60 96" stroke="${OL}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".0"/>
   <path class="al" d="M59 80 Q42 62 30 70 Q40 84 59 84Z" fill="#6CCB5F" ${SKW}/><path class="ar" d="M61 76 Q78 58 90 66 Q80 80 61 80Z" fill="#6CCB5F" ${SKW}/>
   <g class="tl" style="transform-origin:60px 60px">${petals}${faceR?`<circle cx="${cx}" cy="${cy}" r="${faceR}" fill="${p.mid}" ${SKW}/>`:""}
   ${k==="sun"?Array.from({length:10},(_,i)=>`<circle cx="${cx+Math.cos(i*.63)*12}" cy="${cy+Math.sin(i*.63)*12}" r="1.4" fill="${shadeC(p.mid,-.3)}"/>`).join(""):""}
   ${faceEyes(52,68,k==="tulip"?36:39,4.2)}<circle cx="47" cy="47" r="3.4" fill="#FF8FA3" opacity=".55"/><circle cx="73" cy="47" r="3.4" fill="#FF8FA3" opacity=".55"/>${mouth(60,48,5)}</g>
   <path d="M40 94 H80 L76 112 H44Z" fill="${p.pot}" ${SKW}/><rect x="36" y="88" width="48" height="9" rx="4" fill="${shadeC(p.pot,.25)}" ${SKW}/>
   ${p.gold?`<path d="M46 98 l28 0" stroke="#fff" stroke-width="3" opacity=".7"/>`:""}`}
const HATPOS={flower:[60,6,.55],mermaid:[60,18,.62],dragon:[60,19,.6],truck:[60,40,.62]};
function palCore(p,hat){const draw={mermaid:mermaidSVG,dragon:dragonSVG,truck:truckSVG,flower:flowerSVG}[p.sp](p);let hp=HATPOS[p.sp];if(p.sp==='flower'&&p.kind==='tulip')hp=[60,10,.55];if(p.sp==="truck"&&p.kind==="monster")hp=[60,28,.62];
  if(p.sp==="truck"&&(p.kind==="icecream"))hp=[60,-6,.5];if(p.sp==="truck"&&p.kind==="fire")hp=[60,20,.55];
  const hs=hat&&hat!=="none"?`<g transform="translate(${hp[0]-56*hp[2]} ${hp[1]-18*hp[2]}) scale(${hp[2]})">${hatSVG(hat)}</g>`:"";
  return `<ellipse cx="60" cy="113" rx="40" ry="5" fill="rgba(0,0,0,.13)"/><g class="sb">${draw}${hs}</g>`}
function palSVG(p,hat="none",cls=""){return `<svg class="snail pal ${cls}" viewBox="0 -14 120 132" aria-hidden="true">${palCore(p,hat)}</svg>`}
