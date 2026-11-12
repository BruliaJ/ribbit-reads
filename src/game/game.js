/* The game screens. Pure rules live in src/logic (tested); platform differences in src/host. */
import { SND, VOW, ORDER, LESSONS, KEYW, LSND, DEC_PIC, HEART, STORIES, PONDS, CAPSENT } from '../content/data';
import { glyph, layoutText } from '../content/glyphs';
import { FROGS, HATS, THEMES, PENS, PARTIES, CATS, GIFT_ORDER } from '../content/shop';
import { sn, ONE, MULTI, pics, rimeOf, onsetOf, rimeText, RHY, chunks, chunkSnd, DEC, letterSet, decodableAt, ADDP, SUBP, ABC, confusers, capWrong } from '../logic/phonics';
import { planLesson, skillsFor } from '../logic/plan';
import { parseAsk, cleanWord, capName } from '../logic/ask';
import { fresh, parseSave, mergeSaves } from '../logic/state';
import { speakOnce, stopSpeech, unlockSpeech, voiceStatus, setClaudeTTS, hasClaudeTTS } from '../host/speech';
import { readRaw, writeRaw, backup, restoreFromApp, onOtherTabSave } from '../host/storage';
import { isApp, onAndroidBack } from '../host/app';
import { ROSTER, palSVG } from './pals';
import { hatSVG } from './hats';

/* ===================== HELPERS ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.random()*a.length|0];
const rand=(a,b)=>a+Math.random()*(b-a);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
const PRAISE=["You heard it!","Great listening!","You kept at it!","Yes! You worked it out!","Nice hopping!","Good ears!","You did it!"];

/* ===================== STATE ===================== */
let S=fresh(),base=fresh();
function loadState(){const raw=readRaw();const r=parseSave(raw);if(!r)return fresh();if(r.damaged&&raw)backup(raw);return r.save}
/* save: if another tab saved since we loaded, keep what both earned (progress only grows) */
function save(){const cur=parseSave(readRaw());let out=S;if(cur&&!cur.damaged&&cur.save.rev!==base.rev)out=mergeSaves(base,S,cur.save);
  out.rev=Math.max(out.rev,cur&&!cur.damaged?cur.save.rev:0)+1;S=out;base=structuredClone(S);writeRaw(JSON.stringify(S))}
const totalStars=()=>Object.values(S.stars).reduce((a,b)=>a+(+b||0),0);
const doneCount=()=>Object.keys(S.done).length;
const nextLesson=()=>{for(let i=0;i<LESSONS;i++)if(!S.done[i])return i;return LESSONS-1};
const openUpTo=()=>{let m=0;for(let i=0;i<LESSONS;i++)if(S.done[i])m=i+1;return Math.min(LESSONS-1,Math.max(m,S.set.jump||0))};

/* ===================== PALS (shared with Loopaloo) ===================== */
export const WORLDS=[
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
let sayId=0;
function stopSay(){sayId++;stopSpeech()}
function speak1(text,rate=1){if(S.mute||!text)return sleep(200);return speakOnce(text,rate*(S.set.rate||1),S.set.voice==="claude")}
async function say(text,rate){stopSay();const id=sayId;await speak1(text,rate);return id===sayId}
/* say a list of pieces one by one; on(i) lights each piece; resolves false if interrupted */
async function sayParts(parts,{gap=420,rate=.85,on,lead=""}={}){stopSay();const id=sayId;if(lead){await speak1(lead,1);if(id!==sayId)return false;await sleep(150)}
  for(let i=0;i<parts.length;i++){if(id!==sayId)return false;on&&on(i);await speak1(parts[i],rate);if(id!==sayId)return false;await sleep(gap)}
  on&&on(-1);return id===sayId}
async function sayThen(...pieces){stopSay();const id=sayId;for(const p of pieces){if(id!==sayId)return false;if(typeof p==="number"){await sleep(p);continue}if(typeof p==="function"){p();continue}await speak1(p,1)}return id===sayId}

/* ===================== NAVIGATION =====================
   Every screen has its own #address, so the browser's Back (and Android's Back) returns to where the child was.
   Leaving a lesson by ✕ or Back only pauses it: the pond shows "Keep going" at the same step. */
const SECTIONS=["map","lesson","reward","games","game","closet","book","words","grown","abc"];
const ROUTE={map:"pond",abc:"abc",words:"words",games:"games",closet:"closet",book:"stickers",grown:"grownups",lesson:"lesson",reward:"done",game:"play"};
const BYROUTE=Object.fromEntries(Object.entries(ROUTE).map(([k,v])=>[v,k]));
let current="map",PAUSED=null;
function show(id,{push=true}={}){
  if(current==="lesson"&&id!=="lesson")pauseLesson();
  if(id!=="lesson"&&id!=="game"){killPad();stopGame()}
  current=id;SECTIONS.forEach(s=>$("#"+s).hidden=s!==id);
  document.body.classList.toggle("focus",id==="lesson"||id==="game");
  document.querySelectorAll("header [data-go]").forEach(b=>b.setAttribute("aria-current",b.dataset.go===id?"true":"false"));scrollTo(0,0);
  ({map:renderMap,abc:renderAbc,games:renderGames,closet:renderCloset,book:renderBook,words:renderWords,grown:renderGrown})[id]?.();renderHUD();
  const h="#"+ROUTE[id];if(push&&location.hash!==h){try{history.pushState(null,"",h)}catch(e){location.hash=h}}
  const t=$("#"+id+" h1, #"+id+" h2");if(t&&push){t.setAttribute("tabindex","-1");t.focus({preventScroll:true})}}
function route(){const id=BYROUTE[(location.hash||"#pond").slice(1)]||"map";
  if(id===current)return;
  if(id==="lesson"&&PAUSED){resumeLesson();return}
  if(["lesson","reward","game"].includes(id)){show("map",{push:false});try{history.replaceState(null,"","#pond")}catch(e){}return}
  show(id,{push:false})}
addEventListener("popstate",route);addEventListener("hashchange",route);
function goBack(){if(current==="map")return;if(history.length>1)history.back();else show("map")}
function renderHUD(){$("#muteBtn").textContent=S.mute?"🔇":"🔊";$("#muteBtn").setAttribute("aria-pressed",S.mute?"true":"false");$("#starCount").textContent=totalStars();$("#coinCount").textContent=S.coins;$("#brandFrog").innerHTML=frogSVG()}
function toast(t){const el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2800)}

let bdNow="";function renderBackdrop(){const th=THEMES[S.eq.theme]||THEMES.lily;if(bdNow===S.eq.theme)return;bdNow=S.eq.theme;const bd=$("#bd");
  bd.style.background=th.bg;bd.innerHTML=`<div class="hill" style="background:${th.hill[0]}"></div><div class="hill h2" style="background:${th.hill[1]}"></div>`+(REDUCED?"":Array.from({length:14},(_,i)=>th.parts(i)).join(""))}
const STAR=on=>`<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.3l6.6-.8z" fill="${on?"#FFC531":"var(--locked)"}" stroke="${on?"#C98500":"transparent"}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const COIN=`<svg class="coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#FFD23F" stroke="#B87400" stroke-width="1.6"/><circle cx="12" cy="12" r="6" fill="none" stroke="#E0A100" stroke-width="1.4"/></svg>`;

/* ===================== MAP ===================== */
const lname=i=>{const L=ORDER[i];return L.length>1?`“${L}”`:`${L.toUpperCase()}${L}`};
function renderMap(){const n=nextLesson(),open=openUpTo(),L=ORDER[n],allDone=doneCount()>=LESSONS;
  $("#heroDuo").innerHTML=frogSVG(undefined,undefined,"bob")+buddySVG();
  $("#heroHi").textContent="Hop along with Pip: hear sounds, read words, write letters big and little.";
  renderVoiceNote();
  $("#playCard").innerHTML=`<div class="mode">${allDone?"Every pad hopped!":`Lesson ${n+1} of ${LESSONS} · ${esc(PONDS[n/5|0].n)}`}</div>
   <div class="today"><div class="lotd" aria-label="Letter of the day">${L.length>1?L:L.toUpperCase()+L}</div><div style="text-align:left;display:grid;gap:4px"><b style="font-family:var(--f-display);font-size:22px">${allDone?"Play any lesson again":"Today's letter"}</b><span class="hint">${allDone?"Or make your own lesson in My Words.":`${esc(KEYW[L][1])} ${esc(KEYW[L][0])}: rhymes, sounds, reading and writing.`}</span></div></div>
   ${PAUSED&&!PAUSED.custom?`<button class="btn big" id="resumeBtn">▶ Keep going</button><span class="hint">Lesson ${PAUSED.n+1}, step ${PAUSED.k+1} of ${PAUSED.steps.length}</span>`:`<button class="btn big" id="playBtn">▶ Play!</button>`}`;
  if($("#resumeBtn"))$("#resumeBtn").onclick=resumeLesson;else $("#playBtn").onclick=()=>startLesson(n);
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

/* ===================== LESSON ENGINE ===================== */
let LS=null,pad=null;
function killPad(){if(pad){pad.kill();pad=null}stopSay()}
function startLesson(n,custom){killPad();PAUSED=null;LS=custom||{n,steps:planLesson(n,{caps:S.set.caps!==false}),used:new Set()};LS.k=0;LS.miss=0;LS.oops=0;LS.used=LS.used||new Set();
  show("lesson");runStep()}
function pauseLesson(){if(LS&&LS.k<LS.steps.length&&!LS.finished){PAUSED=LS}killPad()}
function resumeLesson(){if(!PAUSED)return;LS=PAUSED;PAUSED=null;show("lesson");runStep()}
function leaveLesson(){const custom=LS&&LS.custom;if(custom){LS.finished=true}show(custom?(LS.abc?"abc":"words"):"map")}
function progress(){const T=LS.steps.length,f=LS.k/T;const tr=$("#trail");
  tr.innerHTML=`<div class="water"></div>${LS.steps.map((_,i)=>`<i class="lp ${i<LS.k?"done":""}" style="left:calc(28px + (100% - 76px) * ${i/(T-1||1)})"></i>`).join("")}<div class="walker" style="left:calc(7px + (100% - 76px) * ${f})">${frogSVG()}</div><div class="goal" aria-hidden="true">🏁</div>`}
function next(){if(current!=="lesson")return;LS.k++;if(LS.k>=LS.steps.length){LS.finished=true;return LS.custom?finishCustom():finish()}sfx.hop();runStep()}
function bubble(text){return `<div class="bubble"><span class="bs">${frogSVG()}</span><p>${text}</p></div>`}
const STEPS={};
function runStep(){killPad();progress();const s=LS.steps[LS.k];const stage=$("#stage");stage.innerHTML="";const card=document.createElement("div");card.className="card";stage.appendChild(card);
  try{STEPS[s.t](card,s)}catch(e){console.error(e);next()}}

/* --- picking words --- */
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
STEPS.rhymeYN=(card,s)=>{const a=fresh1(RHY);const yes=Math.random()<.5;
  const b=yes?pick(ONE.filter(x=>x!==a&&x.e&&rimeOf(x)===rimeOf(a))):pick(ONE.filter(x=>x.e&&rimeOf(x)!==rimeOf(a)&&x.ph[0]!==a.ph[0]));
  const items=[{w:"Yes, they rhyme",e:"👍",say:"yes",v:true},{w:"No, they don't rhyme",e:"👎",say:"no",v:false}];
  choice(card,{mode:"Rhyme time",text:`Do <b>${esc(a.w)}</b> and <b>${esc(b.w)}</b> rhyme? Rhymes sound the same at the end.`,items,nameThem:false,labels:false,
    optHTML:it=>`<span class="emo">${it.e}</span><small>${it.v?"Rhyme!":"No rhyme"}</small>`,
    isRight:it=>it.v===yes,
    prompt:async()=>{await sayThen("Do these rhyme?",250,()=>hl(0),a.w,300,()=>hl(1),b.w,()=>hl(-1))},
    after:async()=>{await sayThen(yes?`Yes! ${a.w}, ${b.w}. They rhyme!`:`No. ${a.w}, ${b.w}. They end differently.`)}});
  const pr=document.createElement("div");pr.className="row ctr";pr.innerHTML=`<span class="hero-pic" id="pa">${a.e}</span><span class="hero-pic" style="font-size:40px">＋</span><span class="hero-pic" id="pb">${b.e}</span>`;
  card.insertBefore(pr,card.querySelector(".opts"));function hl(i){["#pa","#pb"].forEach((q,k)=>{const el=card.querySelector(q);if(el)el.style.transform=k===i?"scale(1.15)":""})}};
STEPS.rhymePick=(card,s)=>{const a=fresh1(RHY);const r=pick(ONE.filter(x=>x!==a&&x.e&&rimeOf(x)===rimeOf(a)));
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
    else if(phase==="solo"){sfx.good();fb.textContent=pick(["Beautiful writing!","You wrote it!","Great job writing!"]);fb.className="feedback good";mood(card.querySelector(".bubble .frog"),"happy");if(!LS.custom||LS.abc)S.got["W:"+text]=1;save();confetti(40);setTimeout(()=>card.isConnected&&next(),1100)}
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

/* ===================== MINI-GAMES ===================== */
const GAMES={
 rhyme:{n:"Bubble Rhymes",e:"🫧",d:"Pop every bubble that rhymes with Pip's word.",need:0},
 fly:{n:"Fly Snack",e:"🪰",d:"Pip is hungry! Tap the fly wearing the letter Pip says.",need:1},
 hop:{n:"River Hop",e:"🪷",d:"Hop across the river by spelling the word, pad by pad.",need:3},
 match:{n:"Big & Little",e:"🃏",d:"Flip the cards to find each capital and its little partner.",need:2}};
let GS=null;
function stopGame(){if(GS){GS.dead=true;cancelAnimationFrame(GS.raf);GS.timers.forEach(clearTimeout);GS.timers.forEach(clearInterval);GS=null}}
function renderGames(){const d=doneCount();
  $("#gameGrid").innerHTML=Object.entries(GAMES).map(([id,g])=>{const lock=d<g.need;const best=S.games[id]||0;
    return `<button class="gcard ${lock?"lock":""}" data-g="${id}"><span class="gi" aria-hidden="true">${lock?"🔒":g.e}</span><h3>${esc(g.n)}</h3><p>${lock?`Opens after ${g.need} lesson${g.need>1?"s":""}.`:esc(g.d)}</p>${best&&!lock?`<p>🏆 Best: ${best}</p>`:""}</button>`}).join("");
  $("#gameGrid").querySelectorAll(".gcard").forEach(b=>b.onclick=()=>{const g=GAMES[b.dataset.g];if(doneCount()<g.need){sfx.bad();toast(`Finish ${g.need-doneCount()} more lesson${g.need-doneCount()>1?"s":""} to open ${g.n}!`);return}startGame(b.dataset.g)})}
function startGame(id){stopGame();GS={id,dead:false,raf:0,timers:[],score:0};show("game");$("#gtitle").textContent=GAMES[id].e+" "+GAMES[id].n;$("#gquit").onclick=()=>{stopGame();show("games")};
  ({rhyme:gameRhyme,fly:gameFly,hop:gameHop,match:gameMatch})[id]($("#gstage"))}
function arenaHTML(){const th=THEMES[S.eq.theme]||THEMES.lily;return `<div class="arena" id="arena" style="background:${th.bg}"><div class="ghud" id="ghud"></div></div>`}
function gameOver(stage,text){const g=GS;if(!g)return;const coins=Math.min(15,g.score);S.coins+=coins;S.games[g.id]=Math.max(S.games[g.id]||0,g.score);save();renderHUD();stopGame();
  stage.innerHTML=`<div class="card reward"><h2>${esc(text)}</h2><div class="stage-duo dance">${frogSVG()}${buddySVG()}</div><div class="coinsup">+${coins} coins</div>
   <div class="row ctr"><button class="btn big" id="again">▶ Play again</button><button class="btn alt" id="back">🎮 Games</button><button class="btn alt" id="mp">🗺️ Map</button></div></div>`;
  sfx.win();celebrate();$("#again").onclick=()=>startGame(g.id);$("#back").onclick=()=>show("games");$("#mp").onclick=()=>show("map")}
const taughtLetters=()=>{const n=Math.max(5,doneCount());return ORDER.slice(0,Math.min(LESSONS,n+1)).filter(l=>l.length===1)};

function gameRhyme(stage){stage.innerHTML=arenaHTML();const A=$("#arena"),hud=$("#ghud");const fams=RHY;let target=pick(fams),pops=0,t0=performance.now(),last=0;const DUR=45000;const items=[];
  const setHud=()=>{hud.innerHTML=`<button class="target" id="tg"><span class="emo">${target.e}</span>${esc(target.w)} 🔊</button><span class="pill">⭐ ${GS.score}</span><span class="pill">⏱️ ${Math.max(0,Math.ceil((DUR-(performance.now()-t0))/1000))}</span>`;$("#tg").onclick=()=>say(`Find words that rhyme with ${target.w}`)};
  setHud();say(`Pop the bubbles that rhyme with ${target.w}!`);
  function spawn(){const W=A.clientWidth,H=A.clientHeight;const rhyme=Math.random()<.42;const fam=ONE.filter(x=>x.e&&x!==target&&rimeOf(x)===rimeOf(target));
    const b=rhyme&&fam.length?pick(fam):pick(pics(ONE).filter(x=>rimeOf(x)!==rimeOf(target)));const el=document.createElement("button");el.className="gitem bubg";el.innerHTML=b.e;el.setAttribute("aria-label",b.w);
    const it={el,b,x:20+Math.random()*(W-120),y:H+10,v:45+Math.random()*35,ph:Math.random()*6,dead:false};A.appendChild(el);items.push(it);
    el.onclick=()=>{if(it.dead||!GS)return;if(rimeOf(b)===rimeOf(target)){it.dead=true;el.classList.add("pop");sfx.good();GS.score++;pops++;say(b.w);setTimeout(()=>el.remove(),350);
        if(pops%5===0){target=pick(fams.filter(x=>rimeOf(x)!==rimeOf(target)));setTimeout(()=>GS&&say(`New word! Rhymes with ${target.w}`),600)}setHud()}
      else{sfx.bad();el.animate([{transform:el.style.transform+" translateX(-8px)"},{transform:el.style.transform+" translateX(8px)"}],{duration:120,iterations:3});say(`${b.w}. No rhyme.`)}}}
  function frame(now){if(!GS||GS.dead)return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;if(now-t0>DUR)return gameOver(stage,`You popped ${GS.score} rhymes!`);
    if(!frame.n||now-frame.n>950){frame.n=now;spawn();setHud()}
    items.forEach(it=>{if(it.dead)return;it.y-=it.v*dt;it.ph+=dt*2;it.el.style.transform=`translate(${it.x+Math.sin(it.ph)*14}px,${it.y}px)`;if(it.y<-110){it.dead=true;it.el.remove()}});
    GS.raf=requestAnimationFrame(frame)}
  GS.raf=requestAnimationFrame(frame)}

function gameFly(stage){stage.innerHTML=arenaHTML();const A=$("#arena"),hud=$("#ghud");A.insertAdjacentHTML("beforeend",`<div class="gfrog">${frogSVG()}</div>`);
  const letters=taughtLetters();let round=0,target=null,flies=[],last=0;const ROUNDS=10;
  const setHud=()=>{hud.innerHTML=`<button class="target" id="tg">🔊 Hear the sound</button><span class="pill">🪰 ${GS.score}</span><span class="pill">${round}/${ROUNDS}</span>`;$("#tg").onclick=()=>sayThen(sn(LSND[target]),200,sn(LSND[target]))};
  function newRound(){flies.forEach(f=>f.el.remove());flies=[];if(round>=ROUNDS)return gameOver(stage,`Pip ate ${GS.score} flies. Yum!`);round++;
    const pool=shuffle(letters.filter(l=>l!=="q"));target=pool[0];const set=[target,...pool.filter(l=>LSND[l]!==LSND[target]).slice(0,3)];
    const W=A.clientWidth,H=A.clientHeight;
    set.forEach((l,i)=>{const el=document.createElement("button");el.className="gitem flyg";el.innerHTML=`🪰<b>${esc(l)}</b>`;el.setAttribute("aria-label","fly with letter "+l);A.appendChild(el);
      const f={el,l,cx:60+((i+.5)/set.length)*(W-180),cy:80+Math.random()*(H*.45),ph:Math.random()*6,sp:.6+Math.random()*.6,dead:false};flies.push(f);
      el.onclick=()=>{if(f.dead||!GS)return;if(l===target){f.dead=true;eat(f)}else{sfx.bad();f.cx=60+Math.random()*(A.clientWidth-180);f.ph+=2;say(sn(LSND[l]))}}});
    setHud();GS.timers.push(setTimeout(()=>GS&&sayThen("Find",sn(LSND[target])),300))}
  function eat(f){const fr=A.querySelector(".gfrog").getBoundingClientRect(),ar=A.getBoundingClientRect(),fl=f.el.getBoundingClientRect();
    const x0=fr.left-ar.left+fr.width/2,y0=fr.top-ar.top+fr.height*.55,x1=fl.left-ar.left+fl.width/2,y1=fl.top-ar.top+fl.height/2;
    const t=document.createElement("div");t.className="tongue";t.style.left=x0+"px";t.style.top=y0+"px";t.style.width=Math.hypot(x1-x0,y1-y0)+"px";t.style.transform=`rotate(${Math.atan2(y1-y0,x1-x0)}rad) scaleX(0)`;A.appendChild(t);
    t.animate([{transform:`rotate(${Math.atan2(y1-y0,x1-x0)}rad) scaleX(0)`},{transform:`rotate(${Math.atan2(y1-y0,x1-x0)}rad) scaleX(1)`},{transform:`rotate(${Math.atan2(y1-y0,x1-x0)}rad) scaleX(0)`}],{duration:380});
    sfx.ribbit();GS.score++;mood(A.querySelector(".gfrog"),"happy");setTimeout(()=>{t.remove();f.el.remove()},380);say(`${target.length>1?target:target} says ${sn(LSND[target])}`);GS.timers.push(setTimeout(()=>GS&&newRound(),1300))}
  function frame(now){if(!GS||GS.dead)return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;flies.forEach(f=>{if(f.dead)return;f.ph+=dt*f.sp*2;f.el.style.transform=`translate(${f.cx+Math.sin(f.ph)*40}px,${f.cy+Math.cos(f.ph*1.3)*26}px)`});GS.raf=requestAnimationFrame(frame)}
  newRound();GS.raf=requestAnimationFrame(frame)}

function gameHop(stage){let k=0;const ROUNDS=5;const n=Math.max(4,doneCount()-1);let dec=decodableAt(Math.min(LESSONS-1,n)).filter(d=>d.ch.length<=4);if(dec.length<5)dec=DEC.filter(d=>["cat","sat","pin","tap","sit","map","pan"].includes(d.w));
  const words=shuffle(dec).slice(0,ROUNDS);
  function round(){if(!GS)return;if(k>=words.length)return gameOver(stage,`You hopped across ${GS.score} rivers!`);const d=words[k];const L=taughtLetters().filter(c=>!d.ch.includes(c)&&c!=="q");const pads=shuffle([...d.ch,...shuffle(L).slice(0,3)]);let j=0;
    stage.innerHTML=`<div class="card"><div class="mode">River ${k+1} of ${ROUNDS}</div>${bubble(`Spell the word Pip says to hop across!`)}${d.e?`<span class="hero-pic">${d.e}</span>`:""}
     <div class="boxes">${d.ch.map((c,i)=>`<div class="box ${i===0?"cur":""}" data-i="${i}"></div>`).join("")}</div>
     <div class="river">${pads.map((c,i)=>`<button class="tile" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
     <div class="row ctr"><button class="btn alt sm" id="hear">🔊 Hear the word</button></div><div class="feedback" aria-live="polite"></div></div>`;
    const bx=[...stage.querySelectorAll(".box")],fb=stage.querySelector(".feedback");stage.querySelector("#hear").onclick=()=>sayThen(d.w);
    stage.querySelectorAll(".river .tile").forEach(t=>t.onclick=async()=>{if(j>=d.ch.length||t.classList.contains("used"))return;
      if(t.dataset.c===d.ch[j]){t.classList.add("used");bx[j].textContent=d.ch[j];bx[j].classList.add("filled");bx[j].classList.remove("cur");sfx.hop();say(sn(chunkSnd(d.ch[j])));j++;
        if(j<d.ch.length)bx[j].classList.add("cur");else{GS.score++;fb.textContent="Splash! You made it across!";fb.className="feedback good";mood(stage.querySelector(".bubble .frog"),"happy");await sleep(400);await sayThen(d.w+"!");k++;GS&&GS.timers.push(setTimeout(round,500))}}
      else{sfx.bad();t.classList.remove("wrong");void t.offsetWidth;t.classList.add("wrong");fb.textContent="Listen for the next sound.";fb.className="feedback bad";say(sn(chunkSnd(d.ch[j])))}});
    sayThen(`Spell ${d.w}.`)}
  round()}

function gameMatch(stage){const L=shuffle(taughtLetters().filter(l=>l!=="q")).slice(0,6);while(L.length<6){const x=pick(ABC);if(!L.includes(x))L.push(x)}
  const cards=shuffle(L.flatMap(l=>[{l,f:l.toUpperCase()},{l,f:l}]));let open=[],found=0,flips=0,busy=false;
  stage.innerHTML=`<div class="card"><div class="mode">Find the partners</div>${bubble("Flip two cards. Find a capital letter and its little partner!")}<div class="mgrid">${cards.map((c,i)=>`<button class="mcard" data-i="${i}" aria-label="card ${i+1}"><span>?</span></button>`).join("")}</div><div class="feedback" aria-live="polite"></div></div>`;
  const els=[...stage.querySelectorAll(".mcard")],fb=stage.querySelector(".feedback");say("Find the big and little partners!");
  els.forEach(b=>b.onclick=async()=>{const i=+b.dataset.i,c=cards[i];if(busy||b.classList.contains("up")||!GS)return;b.classList.add("up");b.innerHTML=`<span>${esc(c.f)}</span>`;sfx.pop();say((/[A-Z]/.test(c.f)?"capital ":"little ")+lname2(c.l));open.push(i);
    if(open.length<2)return;flips++;const [x,y]=open;open=[];
    if(cards[x].l===cards[y].l){found++;GS.score=Math.max(1,12-Math.max(0,flips-6));els[x].classList.add("got");els[y].classList.add("got");sfx.good();fb.textContent=`${cards[x].l.toUpperCase()} and ${cards[x].l}. Partners!`;fb.className="feedback good";
      if(found===6){GS.score=Math.max(4,15-Math.max(0,flips-6));await sleep(700);gameOver(stage,`You matched all 6 in ${flips} tries!`)}}
    else{busy=true;await sleep(900);[x,y].forEach(k=>{els[k].classList.remove("up");els[k].innerHTML="<span>?</span>"});busy=false}})}

/* ===================== ABC PRACTICE (every letter, little and big) ===================== */
function renderAbc(){const known=new Set(ORDER.slice(0,doneCount()+1));
  $("#abcBody").innerHTML=`<p class="hint" style="background:var(--chip);border-radius:14px;padding:8px 14px;max-width:none;margin-bottom:12px">Pick any letter to watch, trace and write it, little and big. ✓ marks show what you've written on your own. ⭐ letters are ones you've met in lessons.</p>
   <div class="book">${ABC.map(l=>{const lo=S.got["W:"+l],up=S.got["W:"+(l==="q"?"Qu":l.toUpperCase())];return `<button class="bk abck" data-l="${l}" aria-label="Practice ${l}"><span>${l.toUpperCase()}${l}</span><span class="p">${known.has(l)?"⭐ ":""}${lo?"✓"+l:"·"} ${up?"✓"+l.toUpperCase():"·"}</span></button>`}).join("")}</div>`;
  $("#abcBody").querySelectorAll(".abck").forEach(b=>b.onclick=()=>{const l=b.dataset.l;const n=Math.max(0,ORDER.indexOf(l));
    startLesson(n,{custom:true,abc:true,letter:l,n,steps:[{t:"meet",L:l},{t:"trace",text:l,label:"Little letter"},{t:"trace",text:l==="q"?"Qu":l.toUpperCase(),label:"Capital letter"},{t:"caseMatch",L:l,dir:"up"},{t:"caseMatch",L:l,dir:"down"}],used:new Set()})})}

/* ===================== CLOSET ===================== */
function itemIcon(cat,id){const it=CATS.find(c=>c[0]===cat)[2][id];
  if(cat==="frog")return frogSVG(FROGS[id],S.eq.hat);if(cat==="hat")return frogSVG(undefined,id);
  if(cat==="theme")return `<div style="width:100%;height:100%;display:grid;place-items:center;background:${it.bg};font-size:44px">${it.e}</div>`;
  if(cat==="pen")return `<span style="font-family:var(--f-read);font-weight:700;font-size:44px;${it.rainbow?"background:linear-gradient(90deg,#FF4D4D,#FFB13D,#FFE14D,#4CD964,#3EA6FF,#8E5BFF);-webkit-background-clip:text;background-clip:text;color:transparent":`color:${it.c}`};${it.glow?`text-shadow:0 0 10px ${it.d||it.c}`:""}">abc</span>`;
  return `<span>${it.e}</span>`}
function renderCloset(){const pv=$("#closetPreview");pv.innerHTML=`<span class="dance">${frogSVG()}</span><span>${buddySVG()}</span><div style="display:grid;gap:6px;text-align:left"><b style="font-family:var(--f-display);font-size:22px">Pip and ${esc(buddy().n)}</b><span class="hint">Earn coins in lessons and games. Every 3rd lesson brings a surprise gift.</span></div>`;
  $("#closetBody").innerHTML=CATS.map(([cat,label,set])=>`<div class="section-title"><h2>${label}</h2>${cat==="party"?`<span>Plays when you finish a lesson. Tap a picture to preview it.</span>`:""}</div><div class="shop">${Object.entries(set).map(([id,it])=>{const own=S.own[cat].includes(id),eq=S.eq[cat]===id;
    return `<div class="item ${eq?"equipped":""}"><div class="ico" ${cat==="party"?`role="button" tabindex="0" data-prev="${id}" aria-label="Preview ${esc(it.n)}"`:""}>${itemIcon(cat,id)}</div><h3>${esc(it.n)}</h3>${eq?`<button class="btn sm" disabled>Using</button>`:own?`<button class="btn sm" data-eq="${cat}:${id}">Use</button>`:`<button class="btn sun sm ${S.coins<it.price?"poor":""}" data-buy="${cat}:${id}">${COIN} ${it.price}</button>`}</div>`}).join("")}</div>`).join("")+
   `<div class="section-title"><h2>Buddy pals</h2><span>Your buddy cheers you on</span></div><div class="card" id="closetPals" style="justify-items:stretch"></div>`;
  renderPalPicker($("#closetPals"));
  $("#closetBody").querySelectorAll("[data-prev]").forEach(el=>{el.onclick=el.onkeydown=e=>{if(e.type==="keydown"&&e.key!=="Enter"&&e.key!==" ")return;celebrate(el.dataset.prev)}});
  $("#closetBody").querySelectorAll("[data-eq]").forEach(b=>b.onclick=()=>{const [c,id]=b.dataset.eq.split(":");S.eq[c]=id;save();sfx.pop();if(c==="theme")renderBackdrop();renderCloset();renderHUD()});
  $("#closetBody").querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{const [c,id]=b.dataset.buy.split(":");const it=CATS.find(x=>x[0]===c)[2][id];
    if(S.coins<it.price){sfx.bad();toast(`You need ${it.price-S.coins} more coins. Finish a lesson or play a game to earn them!`);return}
    S.coins-=it.price;S.own[c].push(id);S.eq[c]=id;save();sfx.coin();toast(`New ${it.n}!`);if(c==="theme")renderBackdrop();renderCloset();renderHUD();confetti(80)})}

/* ===================== STICKERS ===================== */
function renderBook(){const g=S.got;const lettersGot=ORDER.filter(l=>g["L:"+l]).length;
  const words=Object.keys(g).filter(k=>/^[RS]:/.test(k)).map(k=>k.slice(2)).filter((w,i,a)=>a.indexOf(w)===i);
  $("#bookBody").innerHTML=`<p class="hint" style="background:var(--chip);border-radius:14px;padding:8px 14px;max-width:none;margin-bottom:12px">${lettersGot} of ${ORDER.length} letter stickers · ${words.length} words read or spelled · tap a sticker to hear it.</p>
   <div class="section-title"><h2 style="font-size:20px">Letters</h2></div><div class="book">${ORDER.map(l=>`<button class="bk ${g["L:"+l]?"":"no"}" data-say="${esc(l)}" aria-label="${g["L:"+l]?"letter "+esc(l):"not earned yet"}">${l.length>1?esc(l):esc(l.toUpperCase()+l)}<span class="p">${esc(KEYW[l][1])}</span></button>`).join("")}</div>
   <div class="section-title"><h2 style="font-size:20px">Words I read and spelled</h2></div><div class="book">${words.length?words.map(w=>`<button class="bk" data-w="${esc(w)}"><span class="emo">${DEC_PIC[w]||"📖"}</span><span style="font-size:24px">${esc(w)}</span></button>`).join(""):`<p class="hint">Read a word in a lesson to start your word stickers.</p>`}</div>
   <div class="section-title"><h2 style="font-size:20px">Stories</h2></div><div class="book">${STORIES.map(s=>`<div class="bk ${g["T:"+s.t]?"":"no"}"><span class="emo">${s.e}</span><span class="p">${esc(s.t)}</span></div>`).join("")}</div>
   ${WORLDS.map(w=>`<div class="section-title"><h2 style="font-size:20px">${w.ic} ${esc(w.name)} pals</h2><span>${unl(w)} of ${ROSTER[w.id].length}</span></div><div class="book">${ROSTER[w.id].map((p,i)=>`<div class="bk ${i<unl(w)?"":"no"}">${palSVG(p)}<span class="p">${i<unl(w)?esc(p.n):"???"}</span></div>`).join("")}</div>`).join("")}`;
  $("#bookBody").querySelectorAll("[data-say]").forEach(b=>b.onclick=()=>{const l=b.dataset.say;if(!S.got["L:"+l])return;sayThen(sn(LSND[l]),200,KEYW[l][0])});
  $("#bookBody").querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>say(b.dataset.w))}

/* ===================== MY WORDS (type or ask with your voice) ===================== */
let DICT=null,micBtn=null;/* no browser speech recognition: Chrome sends that audio to Google. Voice only through Claude dictation. */
let micOK=false;
function renderWords(){$("#wordsFrog").innerHTML=frogSVG(undefined,undefined,"bob");const inp=$("#inWord"),nm=$("#isName");
  const upd=()=>{const raw=cleanWord(inp.value);const w=nm.checked?capName(raw):raw.toLowerCase();$("#wordPrev").innerHTML=w?`<div class="wordshow">${[...w].map(c=>`<span>${c===" "?"&nbsp;":esc(c)}</span>`).join("")}</div>`:`<p class="hint">Your word shows up here.</p>`;
    $("#teachBtn").disabled=!w;$("#wordNote").textContent=nm.checked&&w?`Names start with a capital letter, so we write ${w}. Names are never saved.`:"Tip: you can fix the spelling by typing.";};
  inp.oninput=nm.onchange=upd;upd();
  $("#teachBtn").onclick=()=>{const raw=cleanWord(inp.value);if(!raw)return;teachWord(raw,nm.checked)};
  $("#savedWords").innerHTML=S.mine.length?S.mine.map(x=>`<button class="chip" data-w="${esc(x)}">${esc(x)}</button>`).join(""):`<p class="hint">Words you learn are saved here to practice again.</p>`;
  $("#savedWords").querySelectorAll(".chip").forEach(c=>c.onclick=()=>teachWord(c.dataset.w,/^[A-Z]/.test(c.dataset.w)));
  document.querySelectorAll(".mic").forEach(b=>{b.hidden=!micOK;b.onclick=()=>listen(b)});$("#askNote").hidden=!micOK;$("#noMic").hidden=micOK}
function teachWord(raw,isName){let w=cleanWord(raw).slice(0,16);if(!w)return;w=isName?capName(w):w.toLowerCase();
  /* names are practised but never kept: they may be a child's real name */
  if(!isName){if(!S.mine.includes(w))S.mine.unshift(w);S.mine=S.mine.slice(0,24);save()}
  startLesson(0,{custom:true,word:w,isName,steps:[{t:"cmeet",w},{t:"cbuild",w},{t:"trace",text:w,label:"Write it"},{t:"cread",w}],used:new Set()})}
const lname1=c=>{c=c.toLowerCase();return c==="a"?"ay":c};
STEPS.cmeet=(card,s)=>{const w=s.w;const ls=[...w].filter(c=>c!==" ");
  card.innerHTML=`<div class="mode">${LS.isName?"Learn a name":"Learn a word"}</div>${bubble(`${LS.isName?"This name":"This word"} has <b>${ls.length} letters</b>. Listen to Pip spell it!`)}
   <div class="wordshow" id="ws">${[...w].map((c,i)=>`<span data-i="${i}">${c===" "?"&nbsp;":esc(c)}</span>`).join("")}</div>
   ${LS.isName?`<div class="tip">👑 Names start with a big capital letter: <b style="font-family:var(--f-read)">${esc(w[0])}</b>.</div>`:""}
   <div class="row ctr"><button class="btn sky" id="sp">🔤 Spell it again</button><button class="btn alt" id="sw">🔊 Say it</button></div><button class="btn big" id="go">Next →</button>`;
  const sp=[...card.querySelectorAll("#ws span")];const lit=i=>sp.forEach((x,k)=>x.classList.toggle("lit",k===i));
  const idx=[...w].map((c,i)=>c===" "?-1:i).filter(i=>i>=0);
  const spell=async()=>{if(!await sayThen(w))return;await sleep(250);await sayParts(idx.map(i=>lname1(w[i])),{gap:250,rate:.9,on:k=>lit(k<0?-1:idx[k])});await speak1(w,1)};
  card.querySelector("#sp").onclick=spell;card.querySelector("#sw").onclick=()=>say(w);card.querySelector("#go").onclick=next;setTimeout(spell,300)};
STEPS.cbuild=(card,s)=>{const w=s.w;const chars=[...w].filter(c=>c!==" ");const pool="abcdefghijklmnoprstuvwyz".split("").filter(c=>!chars.map(x=>x.toLowerCase()).includes(c));const tiles=shuffle([...chars,...shuffle(pool).slice(0,3)]);
  card.innerHTML=`<div class="mode">Build it</div>${bubble(`Build <b>${esc(w)}</b> with the letter tiles. Tap a box to hear which letter goes there.`)}
   <div class="boxes">${chars.map((c,i)=>`<button class="box ${i===0?"cur":""}" data-i="${i}" aria-label="letter box ${i+1}"></button>`).join("")}</div>
   <div class="tiles">${tiles.map(c=>`<button class="tile" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div><div class="feedback" aria-live="polite"></div>`;
  let k=0,tries=0;const bx=[...card.querySelectorAll(".box")],fb=card.querySelector(".feedback");
  bx.forEach(b=>b.onclick=()=>say(lname1(chars[+b.dataset.i])));
  card.querySelectorAll(".tile").forEach(t=>t.onclick=async()=>{if(k>=chars.length||t.classList.contains("used"))return;
    if(t.dataset.c===chars[k]){t.classList.add("used");bx[k].textContent=chars[k];bx[k].classList.add("filled");bx[k].classList.remove("cur");sfx.pop();say(lname1(chars[k]));k++;
      if(k<chars.length)bx[k].classList.add("cur");else{streak(!tries);sfx.good();fb.textContent=pick(PRAISE);fb.className="feedback good";mood(card.querySelector(".bubble .frog"),"happy");await sleep(400);await sayThen(`You built ${w}!`);if(card.isConnected)next()}}
    else{tries++;LS.miss++;t.classList.remove("wrong");void t.offsetWidth;t.classList.add("wrong");sfx.bad();fb.textContent=`Next comes ${chars[k]}.`;fb.className="feedback bad";say(`Next comes ${lname1(chars[k])}`)}});
  setTimeout(()=>sayThen(`Build ${w}.`),300)};
STEPS.cread=(card,s)=>{const w=s.w;const lw=w.toLowerCase();const fakes=new Set();const arr=[...w];
  for(let tries=0;fakes.size<2&&tries<40;tries++){const a=arr.slice();const i=1+Math.random()*(a.length-2)|0;if(Math.random()<.5&&a.length>2){[a[i],a[i+1]]=[a[i+1]||a[i],a[i]]}else{a[i]=pick("aeioumnstbdp".split("").filter(c=>c!==a[i]))}const f=a.join("");if(f.toLowerCase()!==lw&&f.trim())fakes.add(f)}
  if(fakes.size<2)fakes.add(w+w.slice(-1));
  const items=shuffle([w,...[...fakes].slice(0,2)]).map(x=>({w:x}));
  choice(card,{mode:"Find it",text:`Which one is spelled <b>right</b>? Look at every letter.`,items,nameThem:false,isRight:b=>b.w===w,optHTML:b=>`<span style="font-size:${w.length>8?26:36}px">${esc(b.w)}</span>`,
    prompt:()=>sayThen(`Which one says ${w}?`),after:async()=>{await sayThen(`Yes! That's ${w}.`)}})};
function finishCustom(){killPad();if(LS.abc){const l=LS.letter;S.coins+=5;save();renderHUD();show("reward");
  $("#reward").innerHTML=`<div class="card reward"><h2>You wrote ${l.toUpperCase()} and ${l}!</h2><div class="big-letter">${l.toUpperCase()}<span>${l}</span></div><div class="coinsup">+5 coins</div><div class="stage-duo dance">${frogSVG()}${buddySVG()}</div><div class="row ctr"><button class="btn big" id="ag">🔤 Another letter</button><button class="btn alt" id="mp">🗺️ Pond</button></div></div>`;
  sfx.win();celebrate();say(`You wrote big ${lname2(l)} and little ${lname2(l)}!`);$("#ag").onclick=()=>show("abc");$("#mp").onclick=()=>show("map");return}
  const w=LS.word;S.coins+=10;if(!LS.isName)S.got["M:"+w]=1;save();renderHUD();show("reward");
  $("#reward").innerHTML=`<div class="card reward"><h2>${LS.isName?`You can write ${esc(w)}!`:`You learned ${esc(w)}!`}</h2><div class="wordshow">${esc(w)}</div><div class="coinsup">+10 coins</div>
   <div class="stage-duo dance">${frogSVG()}${buddySVG()}</div><div class="row ctr"><button class="btn big" id="ag">✨ Another word</button><button class="btn alt" id="mp">🗺️ Map</button></div></div>`;
  sfx.win();celebrate();say(`You learned ${w}!`);$("#ag").onclick=()=>{$("#inWord").value="";show("words")};$("#mp").onclick=()=>show("map")}
/* voice: Claude dictation inside claude.ai only (never the browser's speech recognition, which sends audio to Google); typing always */
function applyHeard(text,b){const inp=$("#inWord");if(b.dataset.ask){const r=parseAsk(text);inp.value=r.word;$("#isName").checked=r.name||$("#isName").checked}else inp.value=cleanWord(text);inp.dispatchEvent(new Event("input"))}
function listen(b){if(micBtn===b){DICT?DICT.stop().catch(()=>{}):micBtn.rec&&micBtn.rec.stop();return}if(micBtn)return;stopSay();
  if(DICT){micBtn=b;b.heard="";b.classList.add("on");DICT.start().catch(e=>{b.classList.remove("on");micBtn=null;toast(e&&e.code==="not_granted"?"The microphone is off. You can type instead!":"Pip couldn't hear that. Try again or type it.")});return}}
function wireDictation(d){DICT=d;micOK=true;
  d.onPartial(({text})=>{if(micBtn&&text)applyHeard(((micBtn.heard||"")+" "+text).trim(),micBtn)});
  d.onFinal(({text})=>{if(!micBtn)return;micBtn.heard=((micBtn.heard||"")+" "+text).trim();applyHeard(micBtn.heard,micBtn)});
  d.onState(({state,reason})=>{if(state!=="idle")return;const b=micBtn;micBtn=null;if(b){b.classList.remove("on");const v=cleanWord($("#inWord").value);if(v&&b.dataset.ask&&reason!=="not_granted"){say(`Let's learn ${v}!`)}}
    if(reason==="unavailable"){micOK=false;DICT=null;if(!$("#words").hidden)renderWords()}});
  if(!$("#words").hidden)renderWords()}

/* ===================== GROWN-UPS ===================== */
const NUMW=["zero","one","two","three","four","five","six","seven","eight","nine"];const TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];const TEENS=["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const inWords=n=>{const h=n/100|0,r=n%100;const t=r<10?NUMW[r]:r<20?TEENS[r-10]:TENS[r/10|0]+(r%10?"-"+NUMW[r%10]:"");return `${NUMW[h]} hundred${r?" "+t:""}`};
let gateOK=false,gateN=0;
function renderGrown(){const host=$("#grownBody");if(!gateOK){gateN=200+Math.floor(Math.random()*780);
    host.innerHTML=`<div class="card gate"><h2>For grown-ups</h2><p class="hint">Type this number in digits to open settings:</p><b style="font-size:22px">${inWords(gateN)}</b><input id="gateIn" inputmode="numeric" autocomplete="off" aria-label="The number in digits"><button class="btn" id="gateGo">Open</button><p class="hint" id="gateMsg"></p></div>`;
    const go=()=>{if(+$("#gateIn").value.trim()===gateN){gateOK=true;renderGrown()}else{$("#gateMsg").textContent="That's not it. Try again.";$("#gateIn").value=""}};
    $("#gateGo").onclick=go;$("#gateIn").onkeydown=e=>{if(e.key==="Enter")go()};return}
  const st=S.set;const words=Object.keys(S.got).filter(k=>k.startsWith("R:")).length,spelled=Object.keys(S.got).filter(k=>k.startsWith("S:")).length;
  host.innerHTML=`<div class="col">
   <div class="card" style="justify-items:stretch"><h2 style="text-align:left">Progress on this device</h2><div class="statgrid">
    <div class="stat"><b>${doneCount()}/${LESSONS}</b><span>lessons done</span></div><div class="stat"><b>${totalStars()}</b><span>stars</span></div>
    <div class="stat"><b>${ORDER.filter(l=>S.got["L:"+l]).length}</b><span>letters met</span></div><div class="stat"><b>${words}</b><span>words read</span></div>
    <div class="stat"><b>${spelled}</b><span>words spelled</span></div><div class="stat"><b>${S.mine.length}</b><span>My Words</span></div></div>
    <p class="hint">Next up: lesson ${nextLesson()+1}, letter “${esc(ORDER[nextLesson()])}”. Skills this lesson: ${esc(skillsFor(nextLesson()))}.</p></div>
   <div class="card" style="justify-items:stretch"><h2 style="text-align:left">Settings</h2><div class="set">

    <label>Voice speed<select id="setRate"><option value="0.8">Slower</option><option value="1">Normal</option><option value="1.15">Faster</option></select></label>
    ${hasClaudeTTS()?`<label>Voice<select id="setVoice"><option value="device">This device's voice (fastest)</option><option value="claude">Claude voice</option></select></label>`:""}
    <label>Trace capital letters too<input type="checkbox" id="setCaps" ${st.caps!==false?"checked":""} style="width:26px;height:26px"></label>
    <label>Calmer celebrations<input type="checkbox" id="setCalm" ${st.calm?"checked":""} style="width:26px;height:26px"></label>
    <label>Open lessons up to<select id="setJump">${ORDER.map((l,i)=>`<option value="${i}">Lesson ${i+1}: ${esc(l)}</option>`).join("")}</select></label>
    <p class="hint">Use “Open lessons up to” if your child already knows some letters. Nothing that was earned is ever taken away.</p></div></div>
   <div class="card prose" style="justify-items:stretch"><h2>How Ribbit Reads teaches</h2>
    <p>Every lesson follows the same short daily routine used by the Heggerty phonemic awareness curriculum, done out loud with pictures so no reading is needed: rhyming, blending, finding a sound, breaking words apart, then adding, taking away and swapping sounds. Each skill gets a little harder over 30 lessons.</p>
    <p>Then comes phonics: a letter of the day (in the common s, a, t, p, i, n order), its sound and a mouth tip, tracing the little and capital letter, and reading and spelling words made only from letters already taught. Every fifth lesson ends with a short story your child can decode, with ❤️ heart words underlined.</p>
    <h3>When sounds are out loud</h3><p>The device voice says single sounds as close as it can (mmm, sss, buh). For the best sounds, say them with your child: short and crisp for b, d, t; stretched for m, s, f.</p>
    <h3>My Words and the microphone</h3><p>Your child types a word or name. When the game is opened inside Claude, they can also tap 🎤 and ask (“How do you spell dinosaur?”, “My name is Mia”): the microphone turns on only after a tap, Claude's dictation turns speech into text and the game only receives the words. On the website there is no microphone at all. Speech uses this device's own voices only. Progress and saved words stay in this browser only; nothing is sent anywhere.</p>
    <p class="hint">Ribbit Reads is an independent game. It is not made by or affiliated with Heggerty.</p></div>
   <div class="card" style="justify-items:start"><h2>Start over</h2><p class="hint">Erases all lessons, coins, pals and saved words on this device.</p><button class="btn berry" id="resetBtn">Erase progress…</button></div></div>`;
  $("#setRate").value=String(st.rate||1);$("#setRate").onchange=e=>{S.set.rate=+e.target.value;save();say("This is how fast I talk.")};
  if($("#setVoice")){$("#setVoice").value=st.voice;$("#setVoice").onchange=e=>{S.set.voice=e.target.value;save();say("Hi! I'm Pip.")}}
  $("#setCaps").onchange=e=>{S.set.caps=e.target.checked;save()};$("#setCalm").onchange=e=>{S.set.calm=e.target.checked;save()};
  $("#setJump").value=String(Math.max(openUpTo(),S.set.jump||0));$("#setJump").onchange=e=>{S.set.jump=Math.max(S.set.jump||0,+e.target.value);save();toast(`Lessons 1 to ${S.set.jump+1} are open.`)};
  $("#resetBtn").onclick=()=>{const d=document.createElement("div");d.className="confirm";d.innerHTML=`<div class="card" role="dialog" aria-label="Erase progress"><h2>Erase everything?</h2><p class="hint">This can't be undone.</p><div class="row ctr"><button class="btn alt" id="no">Keep it</button><button class="btn berry" id="yes">Erase</button></div></div>`;
    document.body.appendChild(d);d.querySelector("#no").onclick=()=>d.remove();d.querySelector("#yes").onclick=()=>{d.remove();S=fresh();save();bdNow="";renderBackdrop();toast("Progress erased.");show("map")}}}
/* ===================== VOICE NOTE ===================== */
function voiceHelp(){const ua=navigator.userAgent;
  if(/iPad|iPhone/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1))return "On iPad or iPhone: Settings → Accessibility → Spoken Content → Voices → English, then download a voice.";
  if(/Macintosh/.test(ua))return "On a Mac: System Settings → Accessibility → Spoken Content → System voice → Manage Voices.";
  if(/Android/.test(ua))return "On Android: Settings → Accessibility → Text-to-speech output, then install English voice data.";
  if(/Windows/.test(ua))return "On Windows: Settings → Time & language → Speech → Add voices → English.";
  return "Add an English voice in this computer's speech settings, then reload.";}
function renderVoiceNote(){const el=$("#voiceNote");if(!el)return;const none=voiceStatus()==="none";el.hidden=!none;
  if(none)el.innerHTML=`<b>🔈 Pip can't talk on this device yet.</b> Pip's voice teaches the sounds, so a grown-up should add one. ${esc(voiceHelp())}`}

/* ===================== BOOT ===================== */
export async function boot(){
  await restoreFromApp();S=loadState();base=structuredClone(S);
  document.querySelectorAll("header [data-go]").forEach(b=>b.onclick=()=>{stopSay();show(b.dataset.go)});
  $("#abcBtn").onclick=()=>show("abc");$("#quit").onclick=()=>leaveLesson();
  $("#muteBtn").onclick=()=>{S.mute=!S.mute;save();if(S.mute)stopSay();renderHUD()};
  addEventListener("pointerdown",unlockSpeech,{once:true,capture:true});
  onOtherTabSave(()=>{if(current==="lesson"||current==="game")return;S=loadState();base=structuredClone(S);bdNow="";renderBackdrop();show(current,{push:false})});
  onAndroidBack(()=>current==="map",goBack);
  const cl=window.claude;
  if(cl&&cl.use){cl.use("tts").then(t=>{if(t){setClaudeTTS(t);if(current==="grown")renderGrown();renderVoiceNote()}}).catch(()=>{});
    cl.use("dictation").then(d=>{if(d)wireDictation(d)}).catch(()=>{})}
  renderBackdrop();
  const start=BYROUTE[(location.hash||"").slice(1)];
  show(start&&!["lesson","reward","game"].includes(start)?start:"map",{push:false});
  try{history.replaceState(null,"","#"+ROUTE[current])}catch(e){}
  setTimeout(renderVoiceNote,2800);
  if(new URLSearchParams(location.search).has("e2e"))window.__rr={S:()=>S,LS:()=>LS,pad:()=>pad,current:()=>current,startLesson,show,step:k=>{LS.k=k;runStep()},finish,finishCustom,startGame,teachWord,planLesson};
}
