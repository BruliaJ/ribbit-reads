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

function gameRhyme(stage){stage.innerHTML=arenaHTML();const A=$("#arena"),hud=$("#ghud");const fams=RHY();let target=pick(fams),pops=0,t0=performance.now(),last=0;const DUR=45000;const items=[];
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
const cleanWord=t=>t.replace(/[^A-Za-z' -]/g,"").replace(/['-]/g,"").replace(/\s+/g," ").trim();
const capName=t=>t.split(" ").map(x=>x?x[0].toUpperCase()+x.slice(1).toLowerCase():x).join(" ");
/* "how do you spell dinosaur" -> dinosaur; "my name is mia" -> Mia (a name) */
function parseAsk(raw){let t=String(raw||"").trim().replace(/[?.!,]+$/,"");let name=false;
  let m=t.match(/(?:my name is|my name's|i am|i'm|call me)\s+(.+)/i);if(m){name=true;t=m[1]}
  else{m=t.match(/(?:how (?:do|can|would) (?:you|i|we) (?:spell|write)|can you (?:teach me to )?(?:spell|write)|teach me (?:to spell|to write|how to spell|how to write)?|help me (?:spell|write)|spell|write)\s+(?:the word\s+|my\s+)?(.+)/i);if(m)t=m[1]}
  m=t.match(/^(?:my (?:brother|sister|mom|dad|friend|dog|cat)(?:'s)? name(?:,)?\s*)(.+)/i);if(m){name=true;t=m[1]}
  t=cleanWord(t).split(" ").slice(0,2).join(" ");return {word:t,name}}
let DICT=null,micBtn=null;const SRC=window.SpeechRecognition||window.webkitSpeechRecognition;let micOK=!!SRC;
function renderWords(){$("#wordsFrog").innerHTML=frogSVG(undefined,undefined,"bob");const inp=$("#inWord"),nm=$("#isName");
  const upd=()=>{const raw=cleanWord(inp.value);const w=nm.checked?capName(raw):raw.toLowerCase();$("#wordPrev").innerHTML=w?`<div class="wordshow">${[...w].map(c=>`<span>${c===" "?"&nbsp;":esc(c)}</span>`).join("")}</div>`:`<p class="hint">Your word shows up here.</p>`;
    $("#teachBtn").disabled=!w;$("#wordNote").textContent=nm.checked&&w?`Names start with a capital letter, so we write ${w}.`:"Tip: you can fix the spelling by typing.";};
  inp.oninput=nm.onchange=upd;upd();
  $("#teachBtn").onclick=()=>{const raw=cleanWord(inp.value);if(!raw)return;teachWord(raw,nm.checked)};
  $("#savedWords").innerHTML=S.mine.length?S.mine.map(x=>`<button class="chip" data-w="${esc(x)}">${esc(x)}</button>`).join(""):`<p class="hint">Words you learn are saved here to practice again.</p>`;
  $("#savedWords").querySelectorAll(".chip").forEach(c=>c.onclick=()=>teachWord(c.dataset.w,/^[A-Z]/.test(c.dataset.w)));
  document.querySelectorAll(".mic").forEach(b=>{b.hidden=!micOK;b.onclick=()=>listen(b)});$("#askNote").hidden=!micOK;$("#noMic").hidden=micOK}
function teachWord(raw,isName){let w=cleanWord(raw).slice(0,16);if(!w)return;w=isName?capName(w):w.toLowerCase();
  if(!S.mine.includes(w))S.mine.unshift(w);S.mine=S.mine.slice(0,24);if(isName&&!S.name&&/my name/i.test(raw))S.name=w;save();
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
  const w=LS.word;S.coins+=10;S.got["M:"+w]=1;save();renderHUD();show("reward");
  $("#reward").innerHTML=`<div class="card reward"><h2>${LS.isName?`You can write ${esc(w)}!`:`You learned ${esc(w)}!`}</h2><div class="wordshow">${esc(w)}</div><div class="coinsup">+10 coins</div>
   <div class="stage-duo dance">${frogSVG()}${buddySVG()}</div><div class="row ctr"><button class="btn big" id="ag">✨ Another word</button><button class="btn alt" id="mp">🗺️ Map</button></div></div>`;
  sfx.win();celebrate();say(`You learned ${w}!`);$("#ag").onclick=()=>{$("#inWord").value="";show("words")};$("#mp").onclick=()=>show("map")}
/* voice: Claude dictation inside claude.ai, the browser's speech recognition elsewhere, typing always */
function applyHeard(text,b){const inp=$("#inWord");if(b.dataset.ask){const r=parseAsk(text);inp.value=r.word;$("#isName").checked=r.name||$("#isName").checked}else inp.value=cleanWord(text);inp.dispatchEvent(new Event("input"))}
function listen(b){if(micBtn===b){DICT?DICT.stop().catch(()=>{}):micBtn.rec&&micBtn.rec.stop();return}if(micBtn)return;stopSay();
  if(DICT){micBtn=b;b.heard="";b.classList.add("on");DICT.start().catch(e=>{b.classList.remove("on");micBtn=null;toast(e&&e.code==="not_granted"?"The microphone is off. You can type instead!":"Pip couldn't hear that. Try again or type it.")});return}
  if(!SRC)return;const rec=new SRC();rec.lang="en-US";rec.interimResults=true;rec.maxAlternatives=1;micBtn=b;b.rec=rec;b.classList.add("on");
  rec.onresult=e=>{let t="";for(const r of e.results)t+=r[0].transcript;applyHeard(t,b)};
  rec.onerror=e=>{toast(e.error==="not-allowed"?"The microphone is off. You can type instead!":"Pip couldn't hear that. Try again or type it.")};
  rec.onend=()=>{b.classList.remove("on");micBtn=null};try{rec.start()}catch(e){b.classList.remove("on");micBtn=null}}
function wireDictation(d){DICT=d;micOK=true;
  d.onPartial(({text})=>{if(micBtn&&text)applyHeard(((micBtn.heard||"")+" "+text).trim(),micBtn)});
  d.onFinal(({text})=>{if(!micBtn)return;micBtn.heard=((micBtn.heard||"")+" "+text).trim();applyHeard(micBtn.heard,micBtn)});
  d.onState(({state,reason})=>{if(state!=="idle")return;const b=micBtn;micBtn=null;if(b){b.classList.remove("on");const v=cleanWord($("#inWord").value);if(v&&b.dataset.ask&&reason!=="not_granted"){say(`Let's learn ${v}!`)}}
    if(reason==="unavailable"){micOK=SRC?true:false;DICT=null;if(!$("#words").hidden)renderWords()}});
  if(!$("#words").hidden)renderWords()}

/* ===================== GROWN-UPS ===================== */
const NUMW=["zero","one","two","three","four","five","six","seven","eight","nine"];const TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];const TEENS=["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const inWords=n=>{const h=n/100|0,r=n%100;const t=r<10?NUMW[r]:r<20?TEENS[r-10]:TENS[r/10|0]+(r%10?"-"+NUMW[r%10]:"");return `${NUMW[h]} hundred${r?" "+t:""}`};
let gateOK=false,gateN=0;
function renderGrown(){const host=$("#grownBody");if(!gateOK){gateN=200+Math.floor(Math.random()*780);
    host.innerHTML=`<div class="card gate"><h2>For grown-ups</h2><p class="hint">Type this number in digits to open settings:</p><b style="font-size:22px">${inWords(gateN)}</b><input id="gateIn" inputmode="numeric" autocomplete="off" aria-label="The number in digits"><button class="btn" id="gateGo">Open</button><p class="hint" id="gateMsg"></p></div>`;
    const go=()=>{if(+$("#gateIn").value.trim()===gateN){gateOK=true;renderGrown()}else{$("#gateMsg").textContent="That's not it. Try again.";renderGrownSoon()}};
    $("#gateGo").onclick=go;$("#gateIn").onkeydown=e=>{if(e.key==="Enter")go()};return}
  const st=S.set;const words=Object.keys(S.got).filter(k=>k.startsWith("R:")).length,spelled=Object.keys(S.got).filter(k=>k.startsWith("S:")).length;
  host.innerHTML=`<div class="col">
   <div class="card" style="justify-items:stretch"><h2 style="text-align:left">Progress on this device</h2><div class="statgrid">
    <div class="stat"><b>${doneCount()}/${LESSONS}</b><span>lessons done</span></div><div class="stat"><b>${totalStars()}</b><span>stars</span></div>
    <div class="stat"><b>${ORDER.filter(l=>S.got["L:"+l]).length}</b><span>letters met</span></div><div class="stat"><b>${words}</b><span>words read</span></div>
    <div class="stat"><b>${spelled}</b><span>words spelled</span></div><div class="stat"><b>${S.mine.length}</b><span>My Words</span></div></div>
    <p class="hint">Next up: lesson ${nextLesson()+1}, letter “${esc(ORDER[nextLesson()])}”. Skills this lesson: ${esc(skillsFor(nextLesson()))}.</p></div>
   <div class="card" style="justify-items:stretch"><h2 style="text-align:left">Settings</h2><div class="set">
    <label>Child's name (stays on this device)<input id="setName" maxlength="16" value="${esc(S.name)}" style="font:inherit;padding:8px 10px;border-radius:12px;border:2px solid var(--shadow);background:var(--card2);color:var(--ink);min-height:44px;max-width:200px"></label>
    <label>Voice speed<select id="setRate"><option value="0.8">Slower</option><option value="1">Normal</option><option value="1.15">Faster</option></select></label>
    ${TT.cl?`<label>Voice<select id="setVoice"><option value="device">This device's voice (fastest)</option><option value="claude">Claude voice</option></select></label>`:""}
    <label>Trace capital letters too<input type="checkbox" id="setCaps" ${st.caps!==false?"checked":""} style="width:26px;height:26px"></label>
    <label>Calmer celebrations<input type="checkbox" id="setCalm" ${st.calm?"checked":""} style="width:26px;height:26px"></label>
    <label>Open lessons up to<select id="setJump">${ORDER.map((l,i)=>`<option value="${i}">Lesson ${i+1}: ${esc(l)}</option>`).join("")}</select></label>
    <p class="hint">Use “Open lessons up to” if your child already knows some letters. Nothing that was earned is ever taken away.</p></div></div>
   <div class="card prose" style="justify-items:stretch"><h2>How Ribbit Reads teaches</h2>
    <p>Every lesson follows the same short daily routine used by the Heggerty phonemic awareness curriculum, done out loud with pictures so no reading is needed: rhyming, blending, finding a sound, breaking words apart, then adding, taking away and swapping sounds. Each skill gets a little harder over 30 lessons.</p>
    <p>Then comes phonics: a letter of the day (in the common s, a, t, p, i, n order), its sound and a mouth tip, tracing the little and capital letter, and reading and spelling words made only from letters already taught. Every fifth lesson ends with a short story your child can decode, with ❤️ heart words underlined.</p>
    <h3>When sounds are out loud</h3><p>The device voice says single sounds as close as it can (mmm, sss, buh). For the best sounds, say them with your child: short and crisp for b, d, t; stretched for m, s, f.</p>
    <h3>My Words and the microphone</h3><p>Your child can type, or tap 🎤 and ask (“How do you spell dinosaur?”, “My name is Mia”). The microphone turns on only after a tap. Inside Claude, speech is turned into text by Claude's dictation and the game only receives the words. No audio is kept. Progress and saved words stay in this browser only.</p>
    <p class="hint">Ribbit Reads is an independent game. It is not made by or affiliated with Heggerty.</p></div>
   <div class="card" style="justify-items:start"><h2>Start over</h2><p class="hint">Erases all lessons, coins, pals and saved words on this device.</p><button class="btn berry" id="resetBtn">Erase progress…</button></div></div>`;
  $("#setRate").value=String(st.rate||1);$("#setRate").onchange=e=>{S.set.rate=+e.target.value;save();say("This is how fast I talk.")};
  if($("#setVoice")){$("#setVoice").value=st.voice;$("#setVoice").onchange=e=>{S.set.voice=e.target.value;save();say("Hi! I'm Pip.")}}
  $("#setCaps").onchange=e=>{S.set.caps=e.target.checked;save()};$("#setCalm").onchange=e=>{S.set.calm=e.target.checked;save()};
  $("#setJump").value=String(Math.max(openUpTo(),S.set.jump||0));$("#setJump").onchange=e=>{S.set.jump=Math.max(S.set.jump||0,+e.target.value);save();toast(`Lessons 1 to ${S.set.jump+1} are open.`)};
  $("#setName").onchange=e=>{S.name=capName(cleanWord(e.target.value)).slice(0,16);save()};
  $("#resetBtn").onclick=()=>{const d=document.createElement("div");d.className="confirm";d.innerHTML=`<div class="card" role="dialog" aria-label="Erase progress"><h2>Erase everything?</h2><p class="hint">This can't be undone.</p><div class="row ctr"><button class="btn alt" id="no">Keep it</button><button class="btn berry" id="yes">Erase</button></div></div>`;
    document.body.appendChild(d);d.querySelector("#no").onclick=()=>d.remove();d.querySelector("#yes").onclick=()=>{d.remove();S=fresh();save();bdNow="";renderBackdrop();toast("Progress erased.");show("map")}}}
function renderGrownSoon(){setTimeout(()=>{if(!gateOK&&!$("#grown").hidden){const m=$("#gateMsg")?.textContent;renderGrown();if($("#gateMsg"))$("#gateMsg").textContent=m||""}},1200)}
function skillsFor(n){return planLesson(n).map(s=>({rhymeYN:"rhyme yes/no",rhymePick:"find a rhyme",onset:"blend start + end",syllBlend:"blend word parts",blend:"blend sounds",iso:"find a sound",syllCount:"clap parts",segment:"count sounds",addS:"add a sound",delS:"take away a sound",subS:"swap a sound",meet:"letter of the day",trace:"tracing",letterQuiz:"letter sounds",read:"read a word",spell:"spell a word",write:"write a word",cover:"story",page:"",storyQ:""}[s.t])).filter((x,i,a)=>x&&a.indexOf(x)===i).join(", ")}

/* ===================== BOOT ===================== */
document.querySelectorAll("header [data-go]").forEach(b=>b.onclick=()=>{stopSay();show(b.dataset.go)});
$("#abcBtn").onclick=()=>show("abc");
$("#muteBtn").onclick=()=>{S.mute=!S.mute;save();if(S.mute)stopSay();renderHUD()};
if(window.claude&&window.claude.use){
  window.claude.use("tts").then(t=>{if(t){TT.cl=t;if(!$("#grown").hidden)renderGrown()}}).catch(()=>{});
  window.claude.use("dictation").then(d=>{if(d)wireDictation(d)}).catch(()=>{})}
renderBackdrop();show("map");
