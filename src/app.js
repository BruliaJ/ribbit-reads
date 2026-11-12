/* ===================== HELPERS ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.random()*a.length|0];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
const PRAISE=["You heard it!","Great listening!","You kept at it!","Yes! You worked it out!","Nice hopping!","Good ears!","You did it!"];

/* ===================== SKINS ===================== */
const FROGS={
 lime:{n:"Lily green",price:0,a:"#8EDB6E",b:"#3E9B3A",belly:"#EAF8C4",ch:"#FF9BB0"},
 pink:{n:"Bubblegum",price:30,a:"#FFAED2",b:"#E0518F",belly:"#FFE8F2",ch:"#FF5A8A"},
 blue:{n:"Blue raspberry",price:30,a:"#8FD0FF",b:"#2E7FD0",belly:"#E6F5FF",ch:"#FF9BB0"},
 sunset:{n:"Sunset",price:45,a:"#FFC94F",b:"#F0612E",belly:"#FFF3CF",ch:"#FF6B6B"},
 grape:{n:"Grape",price:45,a:"#BE9BFF",b:"#6B3FD8",belly:"#F1E9FF",ch:"#FF8FC4"},
 galaxy:{n:"Galaxy",price:70,a:"#6A5FE8",b:"#1D1453",belly:"#C2BCFF",ch:"#FF8FC4",stars:1},
 rainbow:{n:"Rainbow",price:80,a:"#FF6B6B",b:"#7A5AF8",belly:"#FFFFFF",ch:"#FF8FC4",rainbow:1},
 gold:{n:"Golden",price:100,a:"#FFEA8F",b:"#D49A00",belly:"#FFF9DC",ch:"#FF9BB0",shine:1}};
const HATS={none:{n:"No hat",price:0},bow:{n:"Big bow",price:20},flower:{n:"Daisy",price:20},party:{n:"Party hat",price:25},cowboy:{n:"Cowboy hat",price:35},crown:{n:"Crown",price:40},wizard:{n:"Wizard hat",price:45}};
const THEMES={
 lily:{n:"Lily pond",price:0,e:"🪷",bg:"linear-gradient(180deg,#CFEFFF 0%,#E6F8F0 45%,#A6DFC9 100%)",hill:["#7FCF9A","#4FAE74"],parts:i=>i%3?`<div class="amb drift" style="top:${50+(i*11)%40}vh;font-size:${26+(i*7)%20}px;animation-duration:${36+(i*7)%30}s;animation-delay:-${(i*6)%40}s">🪷</div>`:`<div class="amb flyb" style="left:${(i*29)%90}vw;top:${10+(i*13)%40}vh;font-size:26px;animation-delay:-${i}s">🐞</div>`},
 candy:{n:"Candy creek",price:35,e:"🍭",bg:"linear-gradient(180deg,#FFE0F0 0%,#FFF3F8 50%,#FFC9DF 100%)",hill:["#FF9EC7","#F06FA8"],parts:i=>`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${18+(i*5)%14}px;animation-duration:${9+(i*3)%8}s;animation-delay:-${(i*1.3)%10}s">${["🍬","🍭","🧁","🍓"][i%4]}</div>`},
 moon:{n:"Moonlight",price:45,e:"🌙",bg:"linear-gradient(180deg,#1C2456 0%,#33408F 60%,#5B67B8 100%)",hill:["#2C3A7A","#1B2557"],parts:i=>`<div class="amb tw ffly" style="left:${(i*41)%100}vw;top:${(i*23)%75}vh;animation-delay:-${(i*.7)%2}s"></div>`},
 jungle:{n:"Jungle",price:45,e:"🦜",bg:"linear-gradient(180deg,#C9F2C2 0%,#EAF9DF 50%,#8CCB6E 100%)",hill:["#5BAA47","#3C8A2E"],parts:i=>i%4?`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${18+(i*5)%14}px;animation-duration:${10+(i*3)%8}s;animation-delay:-${(i*1.3)%10}s">🍃</div>`:`<div class="amb drift" style="top:${8+(i*7)%30}vh;font-size:34px;animation-duration:${18+i}s;animation-delay:-${i*2}s">🦜</div>`},
 snow:{n:"Snow day",price:55,e:"❄️",bg:"linear-gradient(180deg,#C7DDFF 0%,#EEF5FF 55%,#FFFFFF 100%)",hill:["#FFFFFF","#DDEBFF"],parts:i=>`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${12+(i*5)%16}px;color:#fff;text-shadow:0 0 4px #8FB4E8;animation-duration:${9+(i*3)%8}s;animation-delay:-${(i*1.1)%10}s">❄</div>`},
 space:{n:"Outer space",price:70,e:"🪐",bg:"linear-gradient(180deg,#0E1033 0%,#251E5C 60%,#3E2E85 100%)",hill:["#4A3C99","#2B2366"],parts:i=>i%5?`<div class="amb tw" style="left:${(i*41)%100}vw;top:${(i*23)%80}vh;font-size:${8+(i*5)%12}px;color:#FFF6B0;animation-delay:-${(i*.7)%2}s">✦</div>`:`<div class="amb drift" style="top:${10+(i*9)%40}vh;font-size:40px;animation-duration:${30+i}s;animation-delay:-${i*3}s">${i%2?"🪐":"🛸"}</div>`}};
const PENS={
 blue:{n:"Pond blue",price:0,c:"#1F5FBF",d:"#9CC8FF"},
 leaf:{n:"Leaf green",price:20,c:"#1F8A44",d:"#7FE3A3"},
 berry:{n:"Berry pink",price:25,c:"#D12B6E",d:"#FF8CC0"},
 grape:{n:"Grape",price:25,c:"#6B3FD8",d:"#C4A8FF"},
 neon:{n:"Glow slime",price:40,c:"#0FAE5C",d:"#3DFF95",glow:1},
 rainbow:{n:"Rainbow",price:60,rainbow:1},
 gold:{n:"Gold glitter",price:70,c:"#B98000",d:"#FFD54A",glow:1}};
const PARTIES={
 confetti:{n:"Confetti",price:0,e:"🎊"},
 bubbles:{n:"Bubble storm",price:30,e:"🫧"},
 fireworks:{n:"Fireworks",price:45,e:"🎆"},
 chorus:{n:"Frog choir",price:60,e:"🎶"},
 parade:{n:"Pal parade",price:60,e:"🎈"}};
const CATS=[["frog","Pip's colors",FROGS],["hat","Hats",HATS],["theme","Ponds",THEMES],["pen","Pens",PENS],["party","Celebrations",PARTIES]];
/* surprise gifts come in this order, one every 3rd lesson (never random) */
const GIFT_ORDER=[["hat","bow"],["pen","leaf"],["frog","blue"],["party","bubbles"],["hat","party"],["theme","candy"],["pen","berry"],["frog","pink"],["hat","flower"],["party","fireworks"]];

/* ===================== STATE ===================== */
const KEY="ribbitreads.v1";
try{if(!localStorage.getItem(KEY)&&localStorage.getItem("soundhop.v1"))localStorage.setItem(KEY,localStorage.getItem("soundhop.v1"))}catch(e){}
const fresh=()=>({v:1,name:"",coins:20,stars:{},done:{},plays:0,gifts:0,own:{frog:["lime"],hat:["none"],theme:["lily"],pen:["blue"],party:["confetti"]},eq:{frog:"lime",hat:"none",theme:"lily",pen:"blue",party:"confetti"},
  got:{},world:"flower",unl:{},buddy:{},mine:[],games:{},mute:false,set:{rate:1,voice:"device",calm:false,caps:true}});
function loadState(){let raw=null;try{raw=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}
  const f=fresh();if(!raw||typeof raw!=="object")return f;const s=Object.assign(f,raw);
  ["stars","done","got","unl","buddy","games"].forEach(k=>{if(!s[k]||typeof s[k]!=="object")s[k]={}});
  s.own=Object.assign(fresh().own,s.own||{});s.eq=Object.assign(fresh().eq,s.eq||{});s.set=Object.assign(fresh().set,s.set||{});
  CATS.forEach(([c,,set])=>{if(!Array.isArray(s.own[c]))s.own[c]=[Object.keys(set)[0]];s.own[c]=s.own[c].filter(id=>set[id]);if(!s.own[c].length)s.own[c]=[Object.keys(set)[0]];if(!set[s.eq[c]]||!s.own[c].includes(s.eq[c]))s.eq[c]=s.own[c][0]});
  if(!Array.isArray(s.mine))s.mine=[];s.coins=Math.max(0,+s.coins||0);return s}
let S=loadState();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const totalStars=()=>Object.values(S.stars).reduce((a,b)=>a+(+b||0),0);
const doneCount=()=>Object.keys(S.done).filter(k=>/^\d+$/.test(k)).length;
const nextLesson=()=>{for(let i=0;i<LESSONS;i++)if(!S.done[i])return i;return LESSONS-1};
const openUpTo=()=>{let m=0;for(let i=0;i<LESSONS;i++)if(S.done[i])m=i+1;return Math.min(LESSONS-1,Math.max(m,S.set.jump||0))};

/* ===================== PALS (shared with Loopaloo) ===================== */
const WORLDS=[
 {id:"flower",name:"Flower Garden",ic:"🌷"},{id:"mermaid",name:"Mermaid Cove",ic:"🧜‍♀️"},{id:"truck",name:"Truck Town",ic:"🚚"},{id:"dragon",name:"Dragon Peaks",ic:"🐉"}];
const STARTERS=3,PER=2;
const Wd=()=>WORLDS.find(w=>w.id===S.world)||WORLDS[0];
const unl=w=>Math.min(ROSTER[w.id].length,(S.unl&&S.unl[w.id])||STARTERS);
const buddyIdx=w=>Math.min((S.buddy&&S.buddy[w.id])||0,unl(w)-1);
const buddy=()=>ROSTER[Wd().id][buddyIdx(Wd())];
const buddySVG=(cls="")=>palSVG(buddy(),"none",cls);

/* ===================== PIP THE FROG ===================== */
let uid=0;
function frogSVG(sk=FROGS[S.eq.frog],hat=S.eq.hat,cls=""){const id="fg"+(++uid);
  const body=sk.rainbow?`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${["#FF6B6B","#FFB13D","#FFE14D","#5CD66E","#4DB0FF","#9C6BFF"].map((c,i)=>`<stop offset="${i/5}" stop-color="${c}"/>`).join("")}</linearGradient>`:
    `<radialGradient id="${id}" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${sk.a}"/><stop offset="1" stop-color="${sk.b}"/></radialGradient>`;
  const f=`url(#${id})`,dk=sk.b;
  const stars=sk.stars?[[40,70],[78,62],[86,86],[34,92],[60,58]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%2?1.6:2.4}" fill="#fff"/>`).join(""):"";
  const shine=sk.shine?`<path d="M30 64 Q36 52 50 48" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`:"";
  const hs=hat&&hat!=="none"?`<g transform="translate(${60-56*.72} ${30-18*.72}) scale(.72)">${hatSVG(hat)}</g>`:"";
  return `<svg class="frog ${cls}" viewBox="0 -14 120 132" aria-hidden="true"><defs>${body}</defs>
  <ellipse cx="60" cy="113" rx="42" ry="5" fill="rgba(0,0,0,.13)"/>
  <g class="sb">
   <ellipse cx="24" cy="100" rx="19" ry="11" fill="${dk}"/><ellipse cx="96" cy="100" rx="19" ry="11" fill="${dk}"/>
   <ellipse cx="60" cy="78" rx="42" ry="34" fill="${f}"/>
   ${stars}${shine}
   <ellipse cx="60" cy="90" rx="26" ry="19" fill="${sk.belly}" opacity=".92"/>
   <g class="al"><ellipse cx="27" cy="92" rx="8" ry="13" fill="${f}" transform="rotate(20 27 92)"/></g>
   <g class="ar"><ellipse cx="93" cy="92" rx="8" ry="13" fill="${f}" transform="rotate(-20 93 92)"/></g>
   <circle cx="37" cy="44" r="18" fill="${f}"/><circle cx="83" cy="44" r="18" fill="${f}"/>
   <g class="eyes"><circle cx="37" cy="44" r="12.5" fill="#fff"/><circle cx="83" cy="44" r="12.5" fill="#fff"/>
    <circle cx="39" cy="46" r="7.5" fill="#1E2340"/><circle cx="85" cy="46" r="7.5" fill="#1E2340"/>
    <circle cx="36" cy="42.5" r="2.8" fill="#fff"/><circle cx="82" cy="42.5" r="2.8" fill="#fff"/></g>
   <ellipse cx="28" cy="68" rx="7.5" ry="4.5" fill="${sk.ch}" opacity=".75"/><ellipse cx="92" cy="68" rx="7.5" ry="4.5" fill="${sk.ch}" opacity=".75"/>
   <path class="mm" d="M44 66 Q60 79 76 66" stroke="#1E2340" stroke-width="3.5" fill="none" stroke-linecap="round"/>
   <g class="mo"><path d="M44 64 Q60 88 76 64 Z" fill="#7A1F3D"/><ellipse cx="60" cy="76" rx="8" ry="5" fill="#FF7A9A"/></g>
   <path class="ms" d="M46 73 Q60 64 74 73" stroke="#1E2340" stroke-width="3.5" fill="none" stroke-linecap="round"/>
   <ellipse cx="44" cy="111" rx="11" ry="5" fill="${dk}"/><ellipse cx="76" cy="111" rx="11" ry="5" fill="${dk}"/>
   ${hs}
  </g></svg>`}
function mood(el,cls,ms=700){if(!el)return;el.classList.remove("happy","sad");void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms)}

/* ===================== AUDIO ===================== */
let AC=null;function tone(f,d=.12,type="sine",v=.12,when=0){if(S.mute)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;o.connect(g);g.connect(AC.destination);const t=AC.currentTime+when;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d)}catch(e){}}
const sfx={good:()=>{tone(660,.12,"triangle");tone(990,.18,"triangle",.1,.1)},bad:()=>tone(200,.18,"sine",.08),pop:()=>tone(880,.06,"triangle",.08),
  hop:()=>{tone(420,.08,"sine",.1);tone(640,.1,"sine",.08,.06)},coin:()=>{tone(1200,.08,"square",.04);tone(1600,.12,"square",.04,.07)},
  win:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.25,"triangle",.1,i*.12)),ribbit:()=>{tone(180,.09,"sawtooth",.06);tone(150,.12,"sawtooth",.06,.11)}};
let voice=null;function pickVoice(){try{const v=speechSynthesis.getVoices();voice=v.find(x=>/en[-_]US/i.test(x.lang)&&/samantha|ava|allison|google us|female|zira|jenny|aria/i.test(x.name)&&!/online|natural/i.test(x.name))||v.find(x=>/en[-_]US/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
const TT={cl:null};
let sayId=0;
function stopSay(){sayId++;try{speechSynthesis.cancel()}catch(e){}try{TT.cl&&TT.cl.stop()}catch(e){}}
function speak1(text,rate=1){return new Promise(res=>{let done=false;const fin=()=>{if(!done){done=true;res()}};
  if(S.mute||!text){setTimeout(fin,250);return}
  const r=Math.max(.5,Math.min(1.5,rate*(S.set.rate||1)));
  const dev=()=>{try{const u=new SpeechSynthesisUtterance(text);u.lang="en-US";if(voice)u.voice=voice;u.rate=r;u.pitch=1.12;u.onend=fin;u.onerror=fin;setTimeout(fin,700+text.length*95/r);speechSynthesis.speak(u)}catch(e){setTimeout(fin,400)}};
  if(S.set.voice==="claude"&&TT.cl){TT.cl.speak(text,{rate:Math.max(.7,Math.min(1.5,r))}).then(fin,e=>{if(e&&e.code==="viewer_stopped")fin();else dev()});return}
  dev()})}
async function say(text,rate){stopSay();const id=sayId;await speak1(text,rate);return id===sayId}
/* say a list of pieces one by one; on(i) lights each piece; resolves false if interrupted */
async function sayParts(parts,{gap=420,rate=.85,on,lead=""}={}){stopSay();const id=sayId;if(lead){await speak1(lead,1);if(id!==sayId)return false;await sleep(150)}
  for(let i=0;i<parts.length;i++){if(id!==sayId)return false;on&&on(i);await speak1(parts[i],rate);if(id!==sayId)return false;await sleep(gap)}
  on&&on(-1);return id===sayId}
async function sayThen(...pieces){stopSay();const id=sayId;for(const p of pieces){if(id!==sayId)return false;if(typeof p==="number"){await sleep(p);continue}if(typeof p==="function"){p();continue}await speak1(p,1)}return id===sayId}

/* ===================== NAV / HUD ===================== */
const SECTIONS=["map","lesson","reward","games","game","closet","book","words","grown","abc"];
function show(id){if(id!=="lesson"&&id!=="game"){killPad();stopGame&&stopGame()}
  SECTIONS.forEach(s=>$("#"+s).hidden=s!==id);
  document.querySelectorAll(".nav button").forEach(b=>b.setAttribute("aria-current",b.dataset.go===id?"true":"false"));scrollTo(0,0);
  ({map:renderMap,abc:renderAbc,games:renderGames,closet:renderCloset,book:renderBook,words:renderWords,grown:renderGrown})[id]?.();renderHUD()}
function renderHUD(){$("#muteBtn").textContent=S.mute?"🔇":"🔊";$("#muteBtn").setAttribute("aria-pressed",S.mute?"true":"false");$("#starCount").textContent=totalStars();$("#coinCount").textContent=S.coins;$("#brandFrog").innerHTML=frogSVG()}
function toast(t){const el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}
let bdNow="";function renderBackdrop(){const th=THEMES[S.eq.theme]||THEMES.lily;if(bdNow===S.eq.theme)return;bdNow=S.eq.theme;const bd=$("#bd");
  bd.style.background=th.bg;bd.innerHTML=`<div class="hill" style="background:${th.hill[0]}"></div><div class="hill h2" style="background:${th.hill[1]}"></div>`+(REDUCED?"":Array.from({length:14},(_,i)=>th.parts(i)).join(""))}
const STAR=on=>`<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.3l6.6-.8z" fill="${on?"#FFC531":"var(--locked)"}" stroke="${on?"#C98500":"transparent"}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const COIN=`<svg class="coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#FFD23F" stroke="#B87400" stroke-width="1.6"/><circle cx="12" cy="12" r="6" fill="none" stroke="#E0A100" stroke-width="1.4"/></svg>`;

/* ===================== MAP ===================== */
const lname=i=>{const L=ORDER[i];return L.length>1?`“${L}”`:`${L.toUpperCase()}${L}`};
function renderMap(){const n=nextLesson(),open=openUpTo(),L=ORDER[n],allDone=doneCount()>=LESSONS;
  $("#heroDuo").innerHTML=frogSVG(undefined,undefined,"bob")+buddySVG();
  $("#heroHi").textContent=S.name?`Hi, ${S.name}! Pip is ready to hop.`:"Hop along with Pip: hear sounds, read words, write letters.";
  $("#playCard").innerHTML=`<div class="mode">${allDone?"Every pad hopped!":`Lesson ${n+1} of ${LESSONS} · ${esc(PONDS[n/5|0].n)}`}</div>
   <div class="today"><div class="lotd" aria-label="Letter of the day">${L.length>1?L:L.toUpperCase()+L}</div><div style="text-align:left;display:grid;gap:4px"><b style="font-family:var(--f-display);font-size:22px">${allDone?"Play any lesson again":"Today's letter"}</b><span class="hint">${allDone?"Or make your own lesson in My Words.":`${esc(KEYW[L][1])} ${esc(KEYW[L][0])}: rhymes, sounds, reading and writing.`}</span></div></div>
   <button class="btn big" id="playBtn">▶ Play!</button>`;
  $("#playBtn").onclick=()=>startLesson(n);
  $("#ponds").innerHTML=PONDS.map((p,pi)=>{const pads=[0,1,2,3,4].map(k=>{const i=pi*5+k;const st=S.stars[i]||0;const lock=i>open;
      return `<button class="pad ${lock?"lock":""} ${i===n&&!lock&&!S.done[i]?"next":""}" data-i="${i}" aria-label="Lesson ${i+1}, letter ${ORDER[i]}${lock?", locked":""}${st?`, ${st} stars`:""}">${lock?"🔒":esc(ORDER[i])}${k===4?`<span class="bk" aria-hidden="true">📖</span>`:""}${st?`<span class="st" aria-hidden="true">${"⭐".repeat(st)}</span>`:""}</button>`}).join("");
    const got=[0,1,2,3,4].filter(k=>S.done[pi*5+k]).length;
    return `<div class="pond"><h3><span aria-hidden="true">${p.e}</span>${esc(p.n)}<small>${got}/5</small></h3><div class="pads">${pads}</div></div>`}).join("");
  $("#ponds").querySelectorAll(".pad").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i>openUpTo()){sfx.bad();toast("Finish the pad before it to hop here!");return}startLesson(i)});
  renderPalPicker($("#mapPals"))}
function renderPalPicker(host){const w=Wd();
  host.innerHTML=`<div class="tabs" role="group" aria-label="Pal worlds">${WORLDS.map(x=>`<button class="tab" data-w="${x.id}" aria-pressed="${x.id===w.id}">${x.ic} ${esc(x.name)}</button>`).join("")}</div>
   <div class="palrow">${ROSTER[w.id].map((p,i)=>`<button class="palbtn ${i===buddyIdx(w)?"on":""} ${i<unl(w)?"":"lockp"}" data-i="${i}" aria-label="${i<unl(w)?esc(p.n):"Locked pal"}">${palSVG(p)}<span>${i<unl(w)?esc(p.n):"???"}</span></button>`).join("")}</div>
   <p class="hint">${unl(w)} of ${ROSTER[w.id].length} pals. Every lesson you finish brings 2 new pals in this world.</p>`;
  host.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{S.world=b.dataset.w;save();renderPalPicker(host);if(!$("#map").hidden)$("#heroDuo").innerHTML=frogSVG(undefined,undefined,"bob")+buddySVG()});
  host.querySelectorAll(".palbtn").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i>=unl(w)){sfx.bad();toast("Finish lessons to meet this pal!");return}S.buddy[w.id]=i;save();sfx.pop();renderPalPicker(host);if(!$("#map").hidden)$("#heroDuo").innerHTML=frogSVG(undefined,undefined,"bob")+buddySVG()})}

/* ===================== LESSON PLAN (the daily routine) =====================
   Every lesson runs the same short routine, like a daily phonemic-awareness lesson:
   rhyme → blend → find a sound → break a word apart → change a sound → letter of the day
   → letter sounds → read a word → spell a word → write it. The skill inside each slot
   grows over the 30 lessons. */
function planLesson(n){const L=ORDER[n],steps=[];
  steps.push({t:n<6?"rhymeYN":"rhymePick"});
  steps.push({t:n<4?"onset":n<8?"syllBlend":"blend",max:n<16?3:4});
  steps.push({t:"iso",pos:n<8?"first":n<15?"last":"middle"});
  steps.push(n<6?{t:"syllCount"}:{t:"segment",max:n<14?3:4});
  if(n>=10)steps.push({t:n<16?"addS":n<22?"delS":"subS"});
  else if(n>=4)steps.push({t:"onset"});
  steps.push({t:"meet",L});
  steps.push({t:"trace",text:L,label:L.length>1?"Two letters, one sound":"Little letter"});
  if(L.length===1&&S.set.caps!==false)steps.push({t:"trace",text:L==="q"?"Qu":L.toUpperCase(),label:"Capital letter"});
  if(L.length===1)steps.push({t:"caseMatch"});
  if(n>=1)steps.push({t:"letterQuiz"});
  if(n>=3&&n%2===1)steps.push({t:"letterName"});
  if(decodableAt(n).length>=3){steps.push({t:"read"});if(n>=2)steps.push({t:"spell"});if(n>=3&&n%2===1)steps.push({t:"write"})}
  if(n>=8&&n%2===0)steps.push({t:"capFix"});
  if(n%5===4){const st=STORIES[n/5|0];steps.push({t:"cover",s:st});st.pages.forEach(p=>steps.push({t:"page",p,s:st}));steps.push({t:"storyQ",s:st})}
  return steps}

/* ===================== LESSON ENGINE ===================== */
let LS=null,pad=null;
function killPad(){if(pad){pad.kill();pad=null}stopSay()}
function startLesson(n,custom){killPad();LS=custom||{n,steps:planLesson(n),k:0,miss:0,oops:0,used:new Set()};LS.k=0;LS.miss=0;LS.oops=0;LS.used=LS.used||new Set();
  show("lesson");$("#quit").onclick=()=>leaveLesson();runStep()}
function leaveLesson(){if(LS&&LS.k>0&&!$("#confirm")){const d=document.createElement("div");d.className="confirm";d.id="confirm";
    d.innerHTML=`<div class="card" role="dialog" aria-label="Leave the lesson?"><div>${frogSVG(undefined,undefined,"sad")}</div><h2>Hop out now?</h2><p class="hint">This lesson's stars only count when you reach the end.</p><div class="row ctr"><button class="btn" id="stay">Keep going</button><button class="btn alt" id="go">Leave</button></div></div>`;
    document.body.appendChild(d);d.querySelector("#stay").onclick=()=>d.remove();d.querySelector("#go").onclick=()=>{d.remove();killPad();show(LS.custom?"words":"map")};d.querySelector("#stay").focus();return}
  killPad();show(LS&&LS.custom?"words":"map")}
function progress(){const T=LS.steps.length,f=LS.k/T;const tr=$("#trail");
  tr.innerHTML=`<div class="water"></div>${LS.steps.map((_,i)=>`<i class="lp ${i<LS.k?"done":""}" style="left:calc(28px + (100% - 76px) * ${i/(T-1||1)})"></i>`).join("")}<div class="walker" style="left:calc(7px + (100% - 76px) * ${f})">${frogSVG()}</div><div class="goal" aria-hidden="true">🏁</div>`}
function next(){LS.k++;if(LS.k>=LS.steps.length)return LS.custom?finishCustom():finish();sfx.hop();runStep()}
function bubble(text){return `<div class="bubble"><span class="bs">${frogSVG()}</span><p>${text}</p></div>`}
const STEPS={};
function runStep(){killPad();progress();const s=LS.steps[LS.k];const stage=$("#stage");stage.innerHTML="";const card=document.createElement("div");card.className="card";stage.appendChild(card);
  try{STEPS[s.t](card,s)}catch(e){console.error(e);next()}}

/* --- picking words --- */
const pics=a=>a.filter(b=>b.e);
function fresh1(pool,pred=()=>true){const c=shuffle(pool).filter(pred);const f=c.find(b=>!LS.used.has(b.w))||c[0];if(f)LS.used.add(f.w);return f}
function others(pool,n,bad){return shuffle(pool.filter(b=>!bad(b))).filter((b,i,a)=>a.findIndex(x=>x.e===b.e)===i).slice(0,n)}
let STREAK=0;
function streak(ok){if(!ok){STREAK=0;return}STREAK++;const n=STREAK;if(n===3||n===6||n===10||(n>=15&&n%5===0))party(n)}
function party(n){if(S.set.calm)return;const d=document.createElement("div");d.className="party";d.innerHTML=`<div class="pbanner">${n} in a row! ${pick(["🎉","🌟","🐸","💚"])}</div><div class="pdancer dance">${frogSVG()}</div>`;
  document.body.appendChild(d);confetti(60);[523,659,784,1046,1318].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09));setTimeout(()=>d.classList.add("out"),1500);setTimeout(()=>d.remove(),1900)}
/* a picture-choice question; prompt() replays the question out loud */
function choice(card,{mode,text,items,isRight,prompt,nameThem=true,after,labels=false,optHTML}){
  card.innerHTML=`<div class="mode">${mode}</div>${bubble(text)}<div class="opts">${items.map((b,i)=>`<button class="opt" data-i="${i}" aria-label="${esc(b.w)}">${optHTML?optHTML(b):`<span class="emo">${b.e}</span>${labels?`<small>${esc(b.w)}</small>`:""}`}</button>`).join("")}</div>
   <div class="row ctr"><button class="btn alt sm" id="again">🔊 Hear it again</button></div><div class="feedback" aria-live="polite"></div>`;
  const opts=[...card.querySelectorAll(".opt")],fb=card.querySelector(".feedback");let tries=0,locked=false;
  const nameAll=async()=>{if(!nameThem)return;await sleep(200);for(let i=0;i<items.length;i++){if(!card.isConnected)return;opts.forEach(o=>o.classList.toggle("hl",+o.dataset.i===i));const ok=await speak1(items[i].say||items[i].w,1);await sleep(250)}opts.forEach(o=>o.classList.remove("hl"))};
  const ask=async()=>{const id=++sayId;stopSay();const me=sayId;await prompt();if(me!==sayId)return;await nameAll()};
  card.querySelector("#again").onclick=ask;
  opts.forEach(o=>o.onclick=async()=>{if(locked||o.disabled)return;const b=items[+o.dataset.i];
    if(isRight(b)){locked=true;stopSay();opts.forEach(x=>x.classList.remove("hl"));o.classList.add("right");streak(!tries);sfx.good();fb.textContent=pick(PRAISE);fb.className="feedback good";mood(card.querySelector(".bubble .frog"),"happy");
      if(after){await after(b,card)}else{await sayThen(b.say||b.w);await sleep(350)}if(card.isConnected)next()}
    else{tries++;LS.miss++;streak(0);o.classList.add("wrong");o.disabled=true;sfx.bad();fb.textContent="Not that one. Listen again!";fb.className="feedback bad";mood(card.querySelector(".bubble .frog"),"sad");await sleep(500);if(card.isConnected)ask()}});
  setTimeout(ask,350)}

/* ----- 1. rhyme ----- */
const RHY=()=>pics(ONE).filter(b=>ONE.filter(x=>x!==b&&rimeOf(x)===rimeOf(b)).length>0);
STEPS.rhymeYN=(card,s)=>{const a=fresh1(RHY());const yes=Math.random()<.5;
  const b=yes?pick(ONE.filter(x=>x!==a&&x.e&&rimeOf(x)===rimeOf(a))):pick(ONE.filter(x=>x.e&&rimeOf(x)!==rimeOf(a)&&x.ph[0]!==a.ph[0]));
  const items=[{w:"Yes, they rhyme",e:"👍",say:"yes",v:true},{w:"No, they don't rhyme",e:"👎",say:"no",v:false}];
  choice(card,{mode:"Rhyme time",text:`Do <b>${esc(a.w)}</b> and <b>${esc(b.w)}</b> rhyme? Rhymes sound the same at the end.`,items,nameThem:false,labels:false,
    optHTML:it=>`<span class="emo">${it.e}</span><small>${it.v?"Rhyme!":"No rhyme"}</small>`,
    isRight:it=>it.v===yes,
    prompt:async()=>{await sayThen("Do these rhyme?",250,()=>hl(0),a.w,300,()=>hl(1),b.w,()=>hl(-1))},
    after:async()=>{await sayThen(yes?`Yes! ${a.w}, ${b.w}. They rhyme!`:`No. ${a.w}, ${b.w}. They end differently.`)}});
  const pr=document.createElement("div");pr.className="row ctr";pr.innerHTML=`<span class="hero-pic" id="pa">${a.e}</span><span class="hero-pic" style="font-size:40px">＋</span><span class="hero-pic" id="pb">${b.e}</span>`;
  card.insertBefore(pr,card.querySelector(".opts"));function hl(i){["#pa","#pb"].forEach((q,k)=>{const el=card.querySelector(q);if(el)el.style.transform=k===i?"scale(1.15)":""})}};
STEPS.rhymePick=(card,s)=>{const a=fresh1(RHY());const r=pick(ONE.filter(x=>x!==a&&x.e&&rimeOf(x)===rimeOf(a)));
  const items=shuffle([r,...others(pics(ONE),2,x=>rimeOf(x)===rimeOf(a)||x.e===a.e)]);
  choice(card,{mode:"Rhyme time",text:`What rhymes with <b>${esc(a.w)}</b> ${a.e}?`,items,isRight:b=>b===r,
    prompt:()=>sayThen(`What rhymes with ${a.w}?`),after:async b=>{await sayThen(`${a.w}, ${b.w}. They rhyme!`)}})};

/* ----- 2. blending ----- */
function padsHTML(n){return `<div class="padrow" aria-hidden="true">${Array.from({length:n},(_,i)=>`<div class="spad" data-p="${i}"></div>`).join("")}</div>`}
function lightPads(card,i){card.querySelectorAll(".spad").forEach(p=>p.classList.toggle("lit",+p.dataset.p===i));if(i>=0)sfx.hop()}
STEPS.onset=(card,s)=>{const a=fresh1(pics(ONE),b=>onsetOf(b).length>=1&&b.w!=="key"&&rimeText(b).length>=2);const on=onsetOf(a);
  const items=shuffle([a,...others(pics(ONE),2,x=>x.e===a.e||rimeOf(x)===rimeOf(a)&&x.ph[0]===a.ph[0])]);
  const parts=[on.map(sn).join(" "),rimeText(a)];
  choice(card,{mode:"Put it together",text:`Pip says the start, then the end. Glue them together! <b>${esc(on.map(p=>"/"+p+"/").join(""))} … ${esc(rimeText(a))}</b>`,items,isRight:b=>b===a,
    prompt:async()=>{await sayParts(parts,{lead:"Put it together.",gap:500,on:i=>lightPads(card,i)});await sleep(200)},
    after:async()=>{await sayThen(`${parts[0]}, ${parts[1]}. ${a.w}!`)}});
  card.querySelector(".opts").insertAdjacentHTML("beforebegin",padsHTML(2))};
STEPS.syllBlend=(card,s)=>{const a=fresh1(MULTI);const items=shuffle([a,...others(MULTI,2,x=>x===a)]);
  choice(card,{mode:"Put the parts together",text:`Listen to the parts. What's the word? <b>${a.sy.join(" · ")}</b>`,items,isRight:b=>b===a,
    prompt:()=>sayParts(a.sy,{lead:"What's the word?",gap:450,on:i=>lightPads(card,i)}),after:async()=>{await sayThen(a.w+"!")}});
  card.querySelector(".opts").insertAdjacentHTML("beforebegin",padsHTML(a.sy.length))};
STEPS.blend=(card,s)=>{const pool=pics(ONE).filter(b=>b.ph.length>=3&&b.ph.length<=s.max);const a=fresh1(pool);
  const near=pics(ONE).filter(x=>x!==a&&x.e!==a.e&&x.ph.length===a.ph.length&&(x.ph[0]===a.ph[0]||rimeOf(x)===rimeOf(a)));
  const items=shuffle([a,...shuffle(near).slice(0,2),...others(pics(ONE),2,x=>x===a||near.includes(x))].slice(0,3));
  choice(card,{mode:"Blend the sounds",text:`Pip hops one pad for each sound. Blend them into a word!`,items,isRight:b=>b===a,
    prompt:()=>sayParts(a.ph.map(sn),{lead:"Blend these sounds.",gap:380,rate:.8,on:i=>lightPads(card,i)}),after:async()=>{await sayThen(a.w+"!")}});
  card.querySelector(".opts").insertAdjacentHTML("beforebegin",padsHTML(a.ph.length))};

/* ----- 3. isolating a sound ----- */
STEPS.iso=(card,s)=>{const pos=s.pos;const at=b=>pos==="first"?b.ph[0]:pos==="last"?b.ph[b.ph.length-1]:(b.ph.length===3&&VOW.has(b.ph[1])?b.ph[1]:null);
  const a=fresh1(pics(ONE),b=>at(b)&&!(pos!=="first"&&["ks"].includes(at(b))));const p=at(a);
  const items=shuffle([a,...others(pics(ONE),2,x=>!at(x)||at(x)===p||x.ph.includes(p)&&pos!=="middle")]);
  const word={first:"starts with",last:"ends with",middle:"has this sound in the middle:"}[pos];
  choice(card,{mode:pos==="first"?"First sound":pos==="last"?"Last sound":"Middle sound",text:`Which one ${word} <b>/${esc(p)}/</b>?`,items,isRight:b=>at(b)===p,
    prompt:()=>sayThen(`Which one ${word}`,120,sn(p),200,sn(p)),
    after:async b=>{await sayThen(b.w,200,`${pos==="first"?"starts":pos==="last"?"ends":"has"} ${sn(p)}`)}})};

/* ----- 4. segmenting ----- */
function countChoice(card,{mode,text,a,n,unit,show,sayIt,demo}){const opts=[1,2,3,4,5].filter(k=>k>=Math.max(1,n-2)).slice(0,3);if(!opts.includes(n))opts[2]=n;
  const items=opts.map(k=>({w:`${k}`,k,e:""}));
  choice(card,{mode,text,items,nameThem:false,isRight:b=>b.k===n,optHTML:b=>`<span style="font-family:var(--f-display);font-size:40px">${b.k}</span><span class="clap" aria-hidden="true">${unit.repeat(b.k)}</span>`,
    prompt:sayIt,after:demo});
  card.querySelector(".bubble").insertAdjacentHTML("afterend",`<span class="hero-pic">${a.e}</span>`+(show||""))}
STEPS.syllCount=(card,s)=>{const a=fresh1(Math.random()<.75?MULTI:pics(ONE).filter(b=>b.ph.length<=3));const n=a.sy.length;
  countChoice(card,{mode:"Clap the parts",text:`Say <b>${esc(a.w)}</b> and clap each part. How many claps?`,a,n,unit:"👏",
    sayIt:()=>sayThen(`${a.w}. How many parts? Clap it out!`),
    demo:async()=>{await sayParts(a.sy,{gap:300,on:i=>{if(i>=0){tone(300,.05,"square",.08)}}});await sayThen(`${n} ${n===1?"part":"parts"}!`)}})};
STEPS.segment=(card,s)=>{const a=fresh1(pics(ONE),b=>b.ph.length>=2&&b.ph.length<=s.max);const n=a.ph.length;
  countChoice(card,{mode:"Break it apart",text:`Say <b>${esc(a.w)}</b> slowly. How many sounds? Pip hops one pad per sound.`,a,n,unit:"🪷",show:padsHTML(n).replace('class="padrow"','class="padrow" style="opacity:0" id="segpads"'),
    sayIt:()=>sayThen(`${a.w}. How many sounds do you hear?`),
    demo:async()=>{const pr=card.querySelector("#segpads");pr.style.opacity=1;await sayParts(a.ph.map(sn),{gap:330,rate:.8,on:i=>lightPads(card,i)});await sayThen(`${a.w}. ${n} sounds!`)}})};

/* ----- 5. changing sounds (add, take away, swap) ----- */
const same=(x,y)=>x.length===y.length&&x.every((v,i)=>v===y[i]);
const ADDP=[];pics(ONE).forEach(big=>pics(ONE).forEach(small=>{if(big.ph.length===small.ph.length+1&&same(big.ph.slice(1),small.ph))ADDP.push([small,big.ph[0],big])}));
const SUBP=[];pics(ONE).forEach(x=>pics(ONE).forEach(y=>{if(x!==y&&x.ph.length===y.ph.length&&x.e!==y.e){const d=x.ph.map((p,i)=>p!==y.ph[i]?i:-1).filter(i=>i>=0);if(d.length===1)SUBP.push([x,d[0],y])}}));
STEPS.addS=(card,s)=>{const [small,p,big]=pick(ADDP);const items=shuffle([big,small,...others(pics(ONE),1,x=>x===big||x===small)]);
  choice(card,{mode:"Add a sound",text:`Say <b>${esc(small.w)}</b> ${small.e}. Now add <b>/${esc(p)}/</b> to the start. What's the new word?`,items,isRight:b=>b===big,
    prompt:()=>sayThen(`Say ${small.w}.`,300,`Now add`,sn(p),`to the start. What's the new word?`),after:async()=>{await sayThen(`${sn(p)}, ${small.w}. ${big.w}!`)}})};
STEPS.delS=(card,s)=>{const [small,p,big]=pick(ADDP);const items=shuffle([small,big,...others(pics(ONE),1,x=>x===big||x===small)]);
  choice(card,{mode:"Take a sound away",text:`Say <b>${esc(big.w)}</b> ${big.e}. Now say it without <b>/${esc(p)}/</b>. What's left?`,items,isRight:b=>b===small,
    prompt:()=>sayThen(`Say ${big.w}.`,300,`Now say it without`,sn(p),`What's left?`),after:async()=>{await sayThen(`${big.w} without ${sn(p)} is ${small.w}!`)}})};
STEPS.subS=(card,s)=>{const [x,i,y]=pick(SUBP);const items=shuffle([y,x,...others(pics(ONE),1,b=>b===x||b===y)]);const from=x.ph[i],to=y.ph[i];
  choice(card,{mode:"Swap a sound",text:`Say <b>${esc(x.w)}</b> ${x.e}. Change <b>/${esc(from)}/</b> to <b>/${esc(to)}/</b>. What's the new word?`,items,isRight:b=>b===y,
    prompt:()=>sayThen(`Say ${x.w}.`,300,`Change`,sn(from),`to`,sn(to),`What's the new word?`),after:async()=>{await sayThen(`${x.w} turns into ${y.w}!`)}})};

/* ----- 6. letter of the day ----- */
STEPS.meet=(card,s)=>{const L=s.L,[kw,ke,tip]=KEYW[L];const snd=sn(LSND[L]);const big=L.length>1?L:`${L.toUpperCase()}<span>${L}</span>`;
  card.innerHTML=`<div class="mode">Letter of the day</div><div class="big-letter" aria-label="Letter ${esc(L)}">${big}</div>
   <div class="row ctr"><span class="hero-pic">${ke}</span><b style="font-family:var(--f-read);font-size:34px">${esc(kw)}</b></div>
   ${bubble(L.length>1?`<b>${L}</b> is two letters that make one sound.`:`This is <b>${L}</b>. Its name is “${L}” and it says <b>/${esc(LSND[L])}/</b>.`)}
   <div class="tip">👄 ${esc(tip)}</div>
   <div class="row ctr"><button class="btn sky" id="hs">🔊 Sound</button>${L.length===1?`<button class="btn alt" id="hn">🔤 Name</button>`:""}<button class="btn alt" id="hk">${ke} ${esc(kw)}</button></div>
   <button class="btn big" id="go">Got it →</button>`;
  card.querySelector("#hs").onclick=()=>sayThen(snd,250,snd);
  if(L.length===1)card.querySelector("#hn").onclick=()=>say(L==="a"?"ay":L);
  card.querySelector("#hk").onclick=()=>sayThen(snd,200,kw);
  card.querySelector("#go").onclick=()=>next();
  S.got["L:"+L]=1;save();
  setTimeout(()=>sayThen(L.length>1?`${L.split("").join(" ")}. Two letters, one sound.`:`This is the letter ${L==="a"?"ay":L}.`,200,"It says",snd,200,`like ${kw}.`),300)};
STEPS.letterQuiz=(card,s)=>{const n=LS.n;const known=ORDER.slice(0,n+1);const target=Math.random()<.5?ORDER[n]:pick(known);
  const pool=known.filter(l=>LSND[l]!==LSND[target]);while(pool.length<2)pool.push(pick(["m","s","t","b"].filter(l=>l!==target&&!pool.includes(l))));
  const items=shuffle([target,...shuffle(pool).slice(0,2)]).map(l=>({w:l,l,say:sn(LSND[l])}));
  choice(card,{mode:"Letter sounds",text:`Which letter says <b>/${esc(LSND[target])}/</b>?`,items,nameThem:false,isRight:b=>b.l===target,optHTML:b=>`<span style="font-size:58px">${esc(b.l)}</span>`,
    prompt:()=>sayThen("Which letter says",120,sn(LSND[target]),250,sn(LSND[target])),after:async()=>{await sayThen(`${target.length>1?target.split("").join(" "):target} says`,sn(LSND[target]),`like ${KEYW[target][0]}.`)}})};


/* ----- big and little letters (read both cases) ----- */
const CONF={b:"dpq",d:"bpq",p:"qbd",q:"pdg",n:"mhu",m:"nw",u:"nvy",h:"nk",i:"jlt",l:"it",j:"ig",t:"fl",f:"t",a:"oe",e:"ca",c:"eo",o:"ca",g:"qy",y:"gv",v:"wy",w:"vm",s:"z",z:"s",k:"h",r:"n",x:"k"};
const ABC="abcdefghijklmnopqrstuvwxyz".split("");
function confusers(t,n){const c=(CONF[t]||"").split("").filter(Boolean);return shuffle([...new Set([...shuffle(c),...shuffle(ABC)])].filter(x=>x!==t)).sort((x,y)=>(c.includes(y)?1:0)-(c.includes(x)?1:0)).slice(0,n)}
const lname2=l=>l==="a"?"ay":l;
STEPS.caseMatch=(card,s)=>{const n=LS.n;const known=ORDER.slice(0,n+1).filter(l=>l.length===1);let target=s.L||(Math.random()<.6&&ORDER[n].length===1?ORDER[n]:pick(known.length?known:ABC));
  const up=s.dir?s.dir==="up":Math.random()<.5;const shown=up?target.toUpperCase():target;const conv=x=>up?x:x.toUpperCase();
  const pool=confusers(target,2);const items=shuffle([target,...pool]).map(l=>({w:conv(l),l,say:(up?"little ":"capital ")+lname2(l)}));
  choice(card,{mode:"Big and little",text:`Every letter has a <b>big</b> (capital) and a <b>little</b> shape. Find the ${up?"little":"big"} partner of <b style="font-family:var(--f-read);font-size:26px">${esc(shown)}</b>.`,items,nameThem:false,isRight:b=>b.l===target,
    optHTML:b=>`<span style="font-size:60px">${esc(b.w)}</span>`,
    prompt:()=>sayThen(`This is ${up?"capital":"little"} ${lname2(target)}. Find ${up?"little":"capital"} ${lname2(target)}.`),
    after:async()=>{await sayThen(`${target.toUpperCase()} and ${target}. Partners!`)}});
  card.querySelector(".bubble").insertAdjacentHTML("afterend",`<div class="big-letter" aria-hidden="true">${esc(shown)}</div>`)};
STEPS.letterName=(card,s)=>{const n=LS.n;const known=ORDER.slice(0,n+1).filter(l=>l.length===1);const target=pick(known);const big=Math.random()<.5;
  const opts=shuffle([target,...confusers(target,3)]).map(l=>{const b=l===target?big:Math.random()<.5;return {l,big:b,w:b?l.toUpperCase():l}});
  choice(card,{mode:"Letter names",text:`Find <b>${big?"capital":"little"} ${esc(target)}</b>. Look carefully: some letters are tricky twins!`,items:opts,nameThem:false,isRight:b=>b.l===target&&b.big===big,
    optHTML:b=>`<span style="font-size:56px">${esc(b.w)}</span>`,prompt:()=>sayThen(`Find ${big?"capital":"little"} ${lname2(target)}.`),after:async()=>{await sayThen(`${big?"Capital":"Little"} ${lname2(target)}!`)}})};
/* ----- capitals in sentences ----- */
const CAPSENT=["Pip sat on a log.","Dad got a red cap.","Max and Pip ran.","Sam has a big dog.","The cat is on the mat.","Kim can hop.","A bug is in the cup.","Ben fed the fish."];
function capWrong(t){const out=new Set();out.add(t[0].toLowerCase()+t.slice(1));const w=t.split(" ");
  w.forEach((x,i)=>{if(i>0&&/^[A-Z]/.test(x)){const c=w.slice();c[i]=x[0].toLowerCase()+x.slice(1);out.add(c.join(" "))}});
  const k=1+Math.floor(Math.random()*(w.length-1));const c=w.slice();if(/^[a-z]/.test(c[k])){c[k]=c[k][0].toUpperCase()+c[k].slice(1);out.add(c.join(" "))}
  out.delete(t);return shuffle([...out]).slice(0,2)}
STEPS.capFix=(card,s)=>{const sent=pick(CAPSENT);const items=shuffle([sent,...capWrong(sent)]).map(x=>({w:x}));
  choice(card,{mode:"Capital letters",text:`Which one is written the right way? A sentence starts with a capital. Names start with a capital too.`,items,nameThem:false,isRight:b=>b.w===sent,
    optHTML:b=>`<span style="font-size:clamp(20px,5vw,28px);line-height:1.3">${esc(b.w)}</span>`,prompt:()=>sayThen(sent,250,"Which one has capitals in the right places?"),
    after:async()=>{await sayThen("Yes! A capital at the start"+(sent.split(" ").slice(1).some(x=>/^[A-Z]/.test(x))?", and a capital for the name.":"."))}});
  card.querySelector(".opts").style.gridTemplateColumns="1fr"};

/* ----- 7. reading a word ----- */
function pickDec(n,pred=()=>true){const L=ORDER[n];const all=decodableAt(n).filter(pred);const withL=all.filter(d=>d.ch.includes(L)||d.ch.some(c=>c[0]===L));const pool=withL.length>=2&&Math.random()<.7?withL:all;
  return shuffle(pool).find(d=>!LS.used.has(d.w))||pool[0]}
function wordTiles(d){return `<div class="readword">${d.ch.map((c,i)=>`<button class="letter" data-i="${i}" aria-label="sound ${esc(c)}">${esc(c)}</button>`).join("")}</div>`}
function wireTiles(card,d){const ls=[...card.querySelectorAll(".letter")];const lit=i=>ls.forEach((x,k)=>x.classList.toggle("lit",k===i));
  ls.forEach(b=>b.onclick=()=>{const i=+b.dataset.i;lit(i);sayThen(sn(chunkSnd(d.ch[i])),()=>lit(-1))});
  return async()=>{await sayParts(d.ch.map(c=>sn(chunkSnd(c))),{gap:260,rate:.8,on:lit});await speak1(d.w,.9)}}
STEPS.read=(card,s)=>{const n=LS.n;const d=pickDec(n);LS.used.add(d.w);LS.lastRead=d;S.got["R:"+d.w]=1;
  if(d.e){const pool=[...DEC.filter(x=>x.e),...pics(ONE)].filter(x=>x.e!==d.e&&x.w!==d.w);const items=shuffle([d,...shuffle(pool).slice(0,2)]);
    choice(card,{mode:"Read it",text:`Tap each letter to hear its sound, then blend. Which picture is it?`,items,nameThem:false,isRight:b=>b===d,prompt:()=>sayThen("Read the word. Which picture is it?"),after:async()=>{await sayThen(d.w+"!")}});
    card.querySelector(".bubble").insertAdjacentHTML("afterend",wordTiles(d)+`<button class="btn sky sm" id="blend">🐸 Blend it with Pip</button>`);
    const bl=wireTiles(card,d);card.querySelector("#blend").onclick=bl}
  else{const pool=decodableAt(n).filter(x=>x.w!==d.w&&x.ch.length===d.ch.length);const near=pool.filter(x=>x.ch.filter((c,i)=>c===d.ch[i]).length>=d.ch.length-1);
    const opts=shuffle([d,...shuffle(near.length>=2?near:pool).slice(0,2)]);
    choice(card,{mode:"Read it",text:`Pip says a word. Read the words and tap the one Pip said.`,items:opts.map(x=>({...x,say:x.w})),nameThem:false,isRight:b=>b.w===d.w,
      optHTML:b=>`<span style="font-size:44px">${esc(b.w)}</span>`,prompt:()=>sayThen("Find the word",200,d.w),after:async()=>{await sayThen(d.w+"!")}})}};

/* ----- 8. spelling with sound boxes ----- */
STEPS.spell=(card,s)=>{const n=LS.n;const d=LS.lastRead&&LS.lastRead.ch.length<=4&&Math.random()<.4?LS.lastRead:pickDec(n,x=>x.ch.length<=4);LS.used.add(d.w);LS.lastSpell=d;
  const L=[...letterSet(n)].filter(c=>c.length===1&&c!=="q"&&!d.ch.includes(c));const tiles=shuffle([...d.ch,...shuffle(L).slice(0,Math.min(3,L.length))]);
  card.innerHTML=`<div class="mode">Spell it</div>${bubble(`Spell the word Pip says. One box for each sound. Tap a box to hear its sound.`)}
   ${d.e?`<span class="hero-pic">${d.e}</span>`:""}<div class="boxes">${d.ch.map((c,i)=>`<button class="box ${i===0?"cur":""}" data-i="${i}" aria-label="sound box ${i+1}"></button>`).join("")}</div>
   <div class="tiles">${tiles.map((c,i)=>`<button class="tile" data-c="${esc(c)}" data-i="${i}">${esc(c)}</button>`).join("")}</div>
   <div class="row ctr"><button class="btn alt sm" id="again">🔊 Hear the word</button></div><div class="feedback" aria-live="polite"></div>`;
  let k=0,tries=0;const boxes=[...card.querySelectorAll(".box")],fb=card.querySelector(".feedback");
  const ask=()=>sayThen(`Spell ${d.w}.`,200,d.w);card.querySelector("#again").onclick=ask;
  boxes.forEach(b=>b.onclick=()=>say(sn(chunkSnd(d.ch[+b.dataset.i]))));
  card.querySelectorAll(".tile").forEach(t=>t.onclick=async()=>{if(k>=d.ch.length||t.classList.contains("used"))return;
    if(t.dataset.c===d.ch[k]){t.classList.add("used");boxes[k].textContent=d.ch[k];boxes[k].classList.add("filled");boxes[k].classList.remove("cur");sfx.pop();say(sn(chunkSnd(d.ch[k])));k++;
      if(k<d.ch.length)boxes[k].classList.add("cur");else{streak(!tries);sfx.good();fb.textContent=pick(PRAISE);fb.className="feedback good";S.got["S:"+d.w]=1;mood(card.querySelector(".bubble .frog"),"happy");await sleep(500);await sayThen(d.w+"!",150,`You spelled ${d.w}.`);if(card.isConnected)next()}}
    else{tries++;LS.miss++;streak(0);t.classList.remove("wrong");void t.offsetWidth;t.classList.add("wrong");sfx.bad();fb.textContent="Listen to this box's sound.";fb.className="feedback bad";await sleep(300);say(sn(chunkSnd(d.ch[k])))}});
  setTimeout(ask,300)};

/* ----- 9. writing (trace pad) ----- */
STEPS.trace=(card,s)=>traceStep(card,s.text,s.label);
STEPS.write=(card,s)=>{const d=LS.lastSpell||pickDec(LS.n);traceStep(card,d.w,"Write the word",d)};
function traceStep(card,text,label,word){
  card.innerHTML=`<div class="mode">${esc(label)}</div>${bubble(word?`Write <b>${esc(text)}</b>${word.e?" "+word.e:""}. Watch Pip first, then trace it.`:`Watch Pip write <b>${esc(text)}</b>. Then it's your turn!`)}
   <div class="padwrap" id="pw"></div><div class="feedback" aria-live="polite">Watch…</div>
   <div class="row ctr"><button class="btn alt sm" id="watch">👀 Watch again</button><button class="btn alt sm" id="redo">🧽 Start over</button><button class="btn alt sm" id="skip">Skip ⏭</button></div>`;
  const fb=card.querySelector(".feedback");let phase="demo";
  const go=(mode)=>{phase=mode;if(pad)pad.kill();pad=new TracePad(card.querySelector("#pw"),text,mode,done);pad.setFb(fb)};
  function done(oops){LS.oops+=oops;if(phase==="trace"){sfx.good();fb.textContent="Now on your own! Start at the green dot.";fb.className="feedback good";say("Now write it on your own.");setTimeout(()=>card.isConnected&&go("solo"),900)}
    else if(phase==="solo"){sfx.good();fb.textContent=pick(["Beautiful writing!","You wrote it!","Great job writing!"]);fb.className="feedback good";mood(card.querySelector(".bubble .frog"),"happy");S.got["W:"+text]=1;save();confetti(40);setTimeout(()=>card.isConnected&&next(),1100)}
    else{fb.textContent="Your turn! Start at the green dot and follow the arrow.";fb.className="feedback";go("trace")}}
  card.querySelector("#watch").onclick=()=>go("demo");card.querySelector("#redo").onclick=()=>go(phase==="demo"?"trace":phase);
  card.querySelector("#skip").onclick=()=>{LS.oops+=3;next()};
  requestAnimationFrame(()=>go("demo"));
  if(text.length===1||text==="Qu"||ORDER.includes(text))say(text.length===1?`Watch me write ${/[A-Z]/.test(text)?"capital ":"little "}${text.toLowerCase()==="a"?"ay":text.toLowerCase()}.`:`Watch me write ${text}.`);else say(`Watch me write ${text}.`)}

/* ----- 10. stories ----- */
STEPS.cover=(card,s)=>{const st=s.s;card.innerHTML=`<div class="mode">Story time</div><div class="scene">${st.e}🐸</div><h2 style="font-size:clamp(30px,7vw,44px);font-family:var(--f-read)">${esc(st.t)}</h2>
  ${bubble("You can read this story with the letters you know! Tap a word to hear it. Words with a wavy line are ❤️ heart words: learn them by heart.")}<button class="btn big" id="go">Start reading</button>`;
  card.querySelector("#go").onclick=next;sayThen(st.t)};
STEPS.page=(card,s)=>{const [text,art]=s.p;const words=text.split(" ");
  card.innerHTML=`<div class="mode">${esc(s.s.t)}</div><div class="scene" aria-hidden="true">${art}</div>
   <div class="story-page">${words.map((w,i)=>{const bare=w.replace(/[^A-Za-z]/g,"");return `<button class="w ${HEART.has(bare)||HEART.has(bare.toLowerCase())?"heart":""}" data-i="${i}">${esc(w)}</button>`}).join("")}</div>
   <div class="row ctr"><button class="btn sky sm" id="rd">🔊 Read it to me</button><button class="btn big" id="go">Next page →</button></div>`;
  const ws=[...card.querySelectorAll(".w")];const lit=i=>ws.forEach((x,k)=>x.classList.toggle("lit",k===i));
  ws.forEach(b=>b.onclick=()=>{lit(+b.dataset.i);sayThen(words[+b.dataset.i].replace(/[^A-Za-z']/g,""),()=>lit(-1))});
  card.querySelector("#rd").onclick=()=>sayParts(words.map(w=>w.replace(/[^A-Za-z']/g,"")),{gap:60,rate:.95,on:lit});
  card.querySelector("#go").onclick=next};
STEPS.storyQ=(card,s)=>{const [q,a,wrong]=s.s.q;const items=shuffle([{w:"answer",e:a,ok:1},...wrong.map(e=>({w:"other",e}))]);
  choice(card,{mode:"Story question",text:esc(q),items,nameThem:false,isRight:b=>b.ok,prompt:()=>sayThen(q),after:async()=>{S.got["T:"+s.s.t]=1;await sayThen("Yes! You remembered the story.")}})};

/* ===================== TRACE PAD ===================== */
function TracePad(host,text,mode,onDone){
  const L=layoutText(text);const wrap=document.createElement("div");host.innerHTML="";host.appendChild(wrap);
  const cv=document.createElement("canvas");wrap.appendChild(cv);const ctx=cv.getContext("2d");
  const strokes=[];L.letters.forEach(l=>l.strokes.forEach(s=>strokes.push({...s,cum:null})));
  let W,H,U,ox,oy,dead=false,st={s:0,i:0},user=[],oops=0,offWarn=false,fbEl=null,demoOn=mode==="demo";
  const pen=PENS[S.eq.pen]||PENS.blue;const dark=document.documentElement.dataset.theme==="dark"||(!document.documentElement.dataset.theme&&matchMedia("(prefers-color-scheme: dark)").matches);
  const P=p=>[ox+p[0]*U,oy+p[1]*U];
  function geom(){W=host.clientWidth||320;const rows=L.desc?3.5:2.8;U=Math.min((W-40)/(L.w+.4),190/rows*1.0,90);U=Math.max(U,24);H=Math.round(U*(L.desc?3.9:3.2)+20);ox=(W-L.w*U)/2;oy=U*.55+6;
    const dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+"px";ctx.setTransform(dpr,0,0,dpr,0,0)}
  function ink(t=0){if(pen.rainbow)return `hsl(${(t*30)%360} 85% ${dark?65:48}%)`;return dark?pen.d:pen.c}
  function line(y,dash,c,w){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(8,y);ctx.lineTo(W-8,y);ctx.stroke();ctx.restore()}
  function poly(pts,w,color){if(pts.length<2)return;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=w;
    if(pen.rainbow&&color==="ink"){for(let i=1;i<pts.length;i++){ctx.strokeStyle=ink(i);ctx.beginPath();ctx.moveTo(...P(pts[i-1]));ctx.lineTo(...P(pts[i]));ctx.stroke()}return}
    ctx.strokeStyle=color==="ink"?ink():color;if(color==="ink"&&pen.glow){ctx.shadowColor=ink();ctx.shadowBlur=12}ctx.beginPath();ctx.moveTo(...P(pts[0]));pts.slice(1).forEach(p=>ctx.lineTo(...P(p)));ctx.stroke();ctx.shadowBlur=0}
  function dot(p,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(...P(p),r,0,7);ctx.fill()}
  function arrow(s,i){const a=s.pts[Math.min(i,s.pts.length-1)],b=s.pts[Math.min(i+4,s.pts.length-1)];if(!b||a===b)return;const [x1,y1]=P(a),[x2,y2]=P(b);const ang=Math.atan2(y2-y1,x2-x1);
    ctx.save();ctx.translate(x1,y1);ctx.rotate(ang);ctx.fillStyle="#F5A623";ctx.beginPath();ctx.moveTo(26,0);ctx.lineTo(12,-8);ctx.lineTo(12,8);ctx.closePath();ctx.fill();ctx.restore()}
  function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle=dark?"#13252C":"#FFFFFF";ctx.fillRect(0,0,W,H);
    const lc=dark?"rgba(160,200,230,.55)":"#8DB8E8";line(oy,[],lc,2.5);line(oy+U,[10,8],dark?"rgba(160,200,230,.35)":"#B9D3F0",2);line(oy+2*U,[],dark?"rgba(255,140,140,.6)":"#E58A8A",3);if(L.desc)line(oy+3*U,[4,8],lc,1.5);
    const guideA=mode==="solo"?(dark?.10:.07):(dark?.22:.16);
    strokes.forEach(s=>{if(s.dot)dot(s.pts[0],U*.11,`rgba(120,140,170,${guideA*2})`);else poly(s.pts,U*.3,`rgba(120,140,170,${guideA*1.6})`)});
    strokes.forEach((s,k)=>{const upto=k<st.s?s.pts.length:k===st.s?st.i+1:0;if(!upto)return;if(s.dot)dot(s.pts[0],U*.12,ink());else poly(s.pts.slice(0,upto),Math.max(5,U*.13),"ink")});
    if(st.s<strokes.length&&!demoOn){const s=strokes[st.s];const p0=s.pts[st.i];ctx.save();dot(p0,Math.max(11,U*.16),"#12C38E");ctx.restore();
      if(!s.dot&&mode!=="solo")arrow(s,st.i);
      ctx.fillStyle="#fff";ctx.font=`900 ${Math.max(11,U*.17)}px Nunito,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";const [x,y]=P(p0);ctx.fillText(st.s+1,x,y+1)}
    if(user.length>1){ctx.save();ctx.globalAlpha=.25;ctx.strokeStyle=ink();ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(user[0][0],user[0][1]);user.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();ctx.restore()}}
  async function demo(){st={s:0,i:0};for(let k=0;k<strokes.length;k++){if(dead)return;st.s=k;st.i=0;const s=strokes[k];
      if(s.dot){draw();await sleep(350);st.i=0;st.s=k;continue}
      await new Promise(res=>{const t0=performance.now();const per=Math.max(500,s.pts.length*22);(function f(now){if(dead)return res();st.i=Math.min(s.pts.length-1,Math.floor((now-t0)/per*s.pts.length));draw();if(st.i>=s.pts.length-1)return res();requestAnimationFrame(f)})(t0)});
      await sleep(220)}
    st={s:strokes.length,i:0};draw();await sleep(500);if(!dead){demoOn=false;onDone(0)}}
  const tol=()=>Math.max(22,U*(mode==="solo"?.5:.42));
  function local(e){const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  let drawing=false;
  function onDown(e){if(demoOn||st.s>=strokes.length)return;e.preventDefault();const p=local(e);const s=strokes[st.s];
    if(dist(p,P(s.pts[st.i]))<tol()*1.25){if(s.dot){finishStroke();return}drawing=true;user=[p];try{cv.setPointerCapture(e.pointerId)}catch(_){}}
    else{oops++;fbt("Start at the green dot!","bad");sfx.bad();ring(P(s.pts[st.i]))}}
  function onMove(e){if(!drawing)return;e.preventDefault();const p=local(e);user.push(p);const s=strokes[st.s];let best=-1;
    for(let j=st.i+1;j<Math.min(s.pts.length,st.i+14);j++){if(dist(p,P(s.pts[j]))<tol())best=j}
    if(best>0){st.i=best;offWarn=false}else{let near=1e9;for(let j=Math.max(0,st.i-3);j<Math.min(s.pts.length,st.i+20);j++)near=Math.min(near,dist(p,P(s.pts[j])));if(near>tol()*2.2&&!offWarn){offWarn=true;oops++;fbt("Stay on the path. Go back to the dot!","bad")}}
    if(st.i>=s.pts.length-2){st.i=s.pts.length-1;finishStroke();return}draw()}
  function onUp(){if(!drawing)return;drawing=false;user=[];draw()}
  function finishStroke(){drawing=false;user=[];sfx.pop();st.s++;st.i=0;if(st.s>=strokes.length){draw();fbt("Done!","good");setTimeout(()=>!dead&&onDone(oops),250);return}
    const nx=strokes[st.s];fbt(nx.dot?"Now tap the dot!":`Line ${st.s+1}: start at the green dot.`,"good");draw()}
  function ring(p){if(REDUCED)return;const t0=performance.now();(function f(now){if(dead)return;const k=(now-t0)/600;draw();if(k>=1)return;ctx.save();ctx.strokeStyle="#12C38E";ctx.lineWidth=4;ctx.globalAlpha=1-k;ctx.beginPath();ctx.arc(p[0],p[1],12+k*36,0,7);ctx.stroke();ctx.restore();requestAnimationFrame(f)})(t0)}
  function fbt(t,c){if(fbEl){fbEl.textContent=t;fbEl.className="feedback "+c}}
  cv.addEventListener("pointerdown",onDown);cv.addEventListener("pointermove",onMove);cv.addEventListener("pointerup",onUp);cv.addEventListener("pointercancel",onUp);
  const ro=new ResizeObserver(()=>{if(dead)return;const w=host.clientWidth;if(w&&w!==W){geom();draw()}});ro.observe(host);
  geom();draw();if(mode==="demo")demo();
  this.kill=()=>{dead=true;ro.disconnect()};this.path=()=>strokes.map(s=>({dot:s.dot,pts:s.pts.map(P)}));this.setFb=el=>{fbEl=el;if(mode!=="demo")fbt(mode==="solo"?"Your turn! Start at the green dot.":"Trace it! Start at the green dot and follow the arrow.","")}}

/* ===================== REWARD ===================== */
function grantPals(){const wd=Wd(),before=unl(wd);S.unl[wd.id]=Math.min(ROSTER[wd.id].length,before+PER);return ROSTER[wd.id].slice(before,unl(wd))}
function grantGift(){S.plays=(S.plays||0)+1;if(S.plays%3)return null;for(let k=0;k<GIFT_ORDER.length;k++){const g=GIFT_ORDER[(S.gifts+k)%GIFT_ORDER.length];if(!S.own[g[0]].includes(g[1])){S.own[g[0]].push(g[1]);S.gifts=(S.gifts+k+1);return g}}
  const bonus=25;S.coins+=bonus;return ["coins",bonus]}
function giftHTML(g){if(!g)return `<p class="hint">Every 3rd lesson hides a surprise gift. ${3-S.plays%3} to go!</p>`;
  if(g[0]==="coins")return `<div class="gift"><div class="prev">🪙</div><div>Surprise! Pip found <b>${g[1]} bonus coins</b>.</div></div>`;
  const set=CATS.find(c=>c[0]===g[0])[2],it=set[g[1]];
  const prev=g[0]==="frog"?frogSVG(FROGS[g[1]],S.eq.hat):g[0]==="hat"?frogSVG(undefined,g[1]):(it.e||(g[0]==="pen"?"🖍️":"🎁"));
  return `<div class="gift"><div class="prev">${prev}</div><div>Surprise gift! Pip found <b>${esc(it.n)}</b>. Try it on in the Closet.</div></div>`}
function finish(){killPad();const n=LS.n;const pen=LS.miss+Math.floor(LS.oops/2);const stars=pen<=1?3:pen<=4?2:1;
  S.done[n]=true;S.stars[n]=Math.max(S.stars[n]||0,stars);const coins=10+stars*5;S.coins+=coins;const newPals=grantPals();const gift=grantGift();save();renderHUD();
  const nextOpen=n+1<LESSONS;show("reward");
  $("#reward").innerHTML=`<div class="card reward"><h2>${pick(["Lesson done!","You hopped the whole pond!","Ribbit! You did it!"])}</h2>
   <div class="bigstars" aria-label="${stars} stars">${[1,2,3].map(s=>STAR(s<=stars)).join("")}</div><div class="coinsup">+${coins} coins</div>
   <p class="hint">${stars===3?"You listened so carefully.":stars===2?"You kept trying and got there!":"You stuck with it all the way to the end."}</p>
   <div class="stage-duo dance">${frogSVG()}${buddySVG()}</div>
   <div class="row ctr">${nextOpen?`<button class="btn big" id="nx">Next lesson →</button>`:""}<button class="btn sun" id="gm">🎮 Play a game</button><button class="btn alt" id="mp">🗺️ Map</button></div>
   ${newPals.length?`<b style="font-family:var(--f-display);font-size:20px">New pals joined you!</b><div class="newpals">${newPals.map(p=>`<div class="ptile">${palSVG(p)}<span>${esc(p.n)}</span></div>`).join("")}</div>`:""}
   ${giftHTML(gift)}</div>`;
  sfx.win();celebrate();say(pick(["You did it!","Ribbit! Lesson done!","Hop hop hooray!"]));
  if(nextOpen)$("#nx").onclick=()=>startLesson(n+1);$("#gm").onclick=()=>show("games");$("#mp").onclick=()=>show("map")}

/* ===================== CELEBRATIONS ===================== */
function confetti(count=140){if(REDUCED)return;const c=$("#fx"),x=c.getContext("2d");const dpr=Math.min(2,devicePixelRatio||1);c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);
  const P=Array.from({length:count},()=>({x:innerWidth/2+(Math.random()-.5)*120,y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:Math.random()*6+4,c:pick(["#FF4D8D","#FFD93D","#3EA6FF","#4CD964","#8E5BFF","#FF9E2C"]),a:Math.random()*6,leaf:Math.random()<.3}));
  const t0=performance.now();(function f(now){x.clearRect(0,0,innerWidth,innerHeight);P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.a+=.15;x.save();x.translate(p.x,p.y);x.rotate(p.a);
    if(p.leaf){x.fillStyle="#3FA24A";x.beginPath();x.ellipse(0,0,p.r,p.r*.6,0,0,7);x.fill()}else{x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2)}x.restore()});
    if(now-t0<3000)requestAnimationFrame(f);else x.clearRect(0,0,innerWidth,innerHeight)})(t0)}
function fireworks(){if(REDUCED)return;const c=$("#fx"),x=c.getContext("2d");const dpr=Math.min(2,devicePixelRatio||1);c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);
  let P=[];const burst=()=>{const cx=innerWidth*(.2+Math.random()*.6),cy=innerHeight*(.15+Math.random()*.35),col=pick(["#FF4D8D","#FFD93D","#3EA6FF","#4CD964","#B48CFF"]);for(let i=0;i<46;i++){const a=i/46*6.28,v=2+Math.random()*4;P.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c:col})}tone(200+Math.random()*200,.25,"triangle",.06)};
  let k=0;const iv=setInterval(()=>{burst();if(++k>=6)clearInterval(iv)},420);const t0=performance.now();
  (function f(now){x.fillStyle="rgba(0,0,0,0)";x.clearRect(0,0,innerWidth,innerHeight);P.forEach(p=>{p.vy+=.05;p.x+=p.vx;p.y+=p.vy;p.l-=.012;x.globalAlpha=Math.max(0,p.l);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,3,0,7);x.fill()});x.globalAlpha=1;P=P.filter(p=>p.l>0);
    if(now-t0<4200)requestAnimationFrame(f);else x.clearRect(0,0,innerWidth,innerHeight)})(t0)}
function bubbleStorm(){if(REDUCED)return;for(let i=0;i<26;i++){const b=document.createElement("div");b.className="bubp bub";const s=24+Math.random()*60;b.style.cssText=`left:${Math.random()*96}vw;width:${s}px;height:${s}px;animation-delay:${Math.random()*1.4}s`;document.body.appendChild(b);setTimeout(()=>b.remove(),5200)}[700,900,1100].forEach((f,i)=>tone(f,.1,"sine",.06,i*.2))}
function chorus(){const d=document.createElement("div");d.className="chorus";const cols=Object.keys(FROGS);d.innerHTML=[0,1,2,3,4].map(i=>`<span class="dance" style="animation-delay:${i*.1}s">${frogSVG(FROGS[cols[(i*3)%cols.length]],i===2?S.eq.hat:"none")}</span>`).join("");document.body.appendChild(d);
  [523,587,659,784,659,784,1046].forEach((f,i)=>tone(f,.22,"triangle",.08,i*.22));
  if(!REDUCED)for(let i=0;i<10;i++)setTimeout(()=>{const n=document.createElement("div");n.className="note";n.textContent=pick(["🎵","🎶","♪"]);n.style.left=(10+Math.random()*80)+"vw";n.style.bottom="80px";document.body.appendChild(n);setTimeout(()=>n.remove(),2300)},i*220);
  setTimeout(()=>d.remove(),3600)}
function parade(){if(REDUCED)return;const w=Wd();const list=ROSTER[w.id].slice(0,unl(w));const cast=[frogSVG(),...shuffle(list).slice(0,5).map(p=>palSVG(p))];cast.forEach((h,i)=>{const d=document.createElement("div");d.className="paradep";d.style.animationDelay=(i*.55)+"s";d.innerHTML=`<span class="dance">${h}</span>`;document.body.appendChild(d);setTimeout(()=>d.remove(),5200+i*600)})}
function celebrate(kind=S.eq.party){if(S.set.calm){confetti(40);return}({confetti:()=>confetti(),bubbles:()=>{bubbleStorm();confetti(50)},fireworks:fireworks,chorus:()=>{chorus();confetti(50)},parade:()=>{parade();confetti(50)}}[kind]||confetti)()}
