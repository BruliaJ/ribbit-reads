/* Worlds: free to switch any time; every world plays the same 30 lessons with the same progress.
   A world reskins the map (region names, stops), the background scene, the lesson trail and Pip's gear. */
export interface World {
  id: string; n: string; e: string; blurb: string;
  regions: { n: string; e: string }[];   // one per 5 lessons
  bg: string; hill: [string, string]; parts: (i: number) => string;
  stop: { a: string; b: string; shadow: string; ink: string; radius: string };
  trail: string;                           // the little stops on the lesson trail
  gearUnder?: string; gearOver?: string;   // Pip's costume, drawn behind / in front (0 -14 120 132 box)
}
export const WORLDS_PLAY: World[] = [
 { id: "pond", n: "Lily Pond", e: "🐸", blurb: "Hop across lily pads with Pip.",
   regions: [{n:"Sunny Pond",e:"☀️"},{n:"Mossy Log",e:"🪵"},{n:"Reed Island",e:"🌾"},{n:"Firefly Creek",e:"✨"},{n:"Splashy Falls",e:"💦"},{n:"Moon Pond",e:"🌙"}],
   bg: "linear-gradient(180deg,#CFEFFF 0%,#E6F8F0 45%,#A6DFC9 100%)", hill: ["#7FCF9A","#4FAE74"], parts: i=>i%3?`<div class="amb drift" style="top:${50+(i*11)%40}vh;font-size:${26+(i*7)%20}px;animation-duration:${36+(i*7)%30}s;animation-delay:-${(i*6)%40}s">🌸</div>`:`<div class="amb flyb" style="left:${(i*29)%90}vw;top:${10+(i*13)%40}vh;font-size:26px;animation-delay:-${i}s">🐞</div>`,
   stop: { a: "#8BDD7E", b: "#3FA24A", shadow: "#2A7A36", ink: "#0F3B1A", radius: "50% 50% 50% 8%" }, trail: "#7FCF72" },
 { id: "space", n: "Outer Space", e: "🚀", blurb: "Fly from planet to planet in a space helmet.",
   regions: [{n:"Moon Base",e:"🌕"},{n:"Red Dunes",e:"🏜️"},{n:"Ring Planet",e:"🪐"},{n:"Comet Trail",e:"☄️"},{n:"Star Garden",e:"🌟"},{n:"Galaxy Gate",e:"🌌"}],
   bg: "linear-gradient(180deg,#0E1033 0%,#251E5C 60%,#3E2E85 100%)", hill: ["#4A3C99","#2B2366"], parts: i=>i%5?`<div class="amb tw" style="left:${(i*41)%100}vw;top:${(i*23)%80}vh;font-size:${8+(i*5)%12}px;color:#FFF6B0;animation-delay:-${(i*.7)%2}s">✦</div>`:`<div class="amb drift" style="top:${10+(i*9)%40}vh;font-size:40px;animation-duration:${30+i}s;animation-delay:-${i*3}s">${i%2?"🪐":"🛸"}</div>`,
   stop: { a: "#C9B6FF", b: "#6B4FD8", shadow: "#3B2A8F", ink: "#FFFFFF", radius: "50%" }, trail: "#B9A6FF",
   gearOver: `<circle cx="60" cy="62" r="58" fill="rgba(190,225,255,.18)" stroke="#E3EEFF" stroke-width="3.5"/><path d="M22 42 Q28 20 50 10" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/><line x1="60" y1="4" x2="60" y2="-6" stroke="#C3CEE0" stroke-width="3"/><circle cx="60" cy="-8" r="4.5" fill="#FF5A7A"/>` },
 { id: "sea", n: "Under the Sea", e: "🐠", blurb: "Swim from shell to shell with a snorkel.",
   regions: [{n:"Coral Reef",e:"🐚"},{n:"Kelp Forest",e:"🌿"},{n:"Turtle Bay",e:"🐢"},{n:"Shipwreck",e:"⚓"},{n:"Pearl Cave",e:"🦪"},{n:"Glow Deep",e:"🐙"}],
   bg: "linear-gradient(180deg,#9FE3FF 0%,#4CB8E6 55%,#2A7FC0 100%)", hill: ["#F4E3B9","#E5CD93"], parts: i=>i%3?`<div class="amb rise bub" style="left:${(i*37)%100}vw;width:${14+(i*7)%26}px;height:${14+(i*7)%26}px;animation-duration:${9+(i*3)%9}s;animation-delay:-${(i*1.7)%12}s"></div>`:`<div class="amb drift" style="top:${20+(i*13)%60}vh;font-size:${28+(i*5)%16}px;animation-duration:${22+(i*5)%20}s;animation-delay:-${(i*4)%30}s">${["🐠","🐟","🐡","🐢"][i%4]}</div>`,
   stop: { a: "#FFD6E5", b: "#F48FB1", shadow: "#C25E85", ink: "#5A1A33", radius: "50% 50% 38% 38%" }, trail: "#FFC1D8",
   gearOver: `<rect x="17" y="28" width="86" height="34" rx="16" fill="rgba(160,225,255,.32)" stroke="#FF8A3D" stroke-width="5"/><path d="M103 42 Q116 42 116 28 L116 4" stroke="#FFD23F" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="110" y="-2" width="12" height="8" rx="3" fill="#FF8A3D"/>` },
 { id: "dino", n: "Dino Valley", e: "🦕", blurb: "Stomp from egg to egg in a dino suit.",
   regions: [{n:"Fern Valley",e:"🌿"},{n:"Volcano Hill",e:"🌋"},{n:"River Rapids",e:"🌊"},{n:"Egg Nest",e:"🥚"},{n:"Fossil Cliff",e:"🦴"},{n:"Tall Neck Woods",e:"🌴"}],
   bg: "linear-gradient(180deg,#C9F2C2 0%,#EAF9DF 50%,#8CCB6E 100%)", hill: ["#5BAA47","#3C8A2E"], parts: i=>i%4?`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${18+(i*5)%14}px;animation-duration:${10+(i*3)%8}s;animation-delay:-${(i*1.3)%10}s">🍃</div>`:`<div class="amb drift" style="top:${8+(i*7)%30}vh;font-size:34px;animation-duration:${18+i}s;animation-delay:-${i*2}s">🦕</div>`,
   stop: { a: "#FFF6DD", b: "#E8D3A2", shadow: "#B39457", ink: "#5A3A12", radius: "50% 50% 46% 46% / 60% 60% 40% 40%" }, trail: "#F1E2B8",
   gearUnder: `<path d="M28 34 L36 8 L46 30Z M50 30 L60 0 L70 30Z M74 30 L84 8 L92 34Z" fill="#FF8A3D" stroke="#C25A12" stroke-width="2.5" stroke-linejoin="round"/><path d="M94 96 Q124 98 120 70 Q112 86 94 84Z" fill="#FF8A3D" stroke="#C25A12" stroke-width="2.5"/>` },
 { id: "sweets", n: "Sweet Hills", e: "🧁", blurb: "Skip along cookies and cupcakes.",
   regions: [{n:"Gumdrop Path",e:"🍬"},{n:"Cocoa River",e:"🍫"},{n:"Sprinkle Hills",e:"🧁"},{n:"Lollipop Woods",e:"🍭"},{n:"Cookie Castle",e:"🍪"},{n:"Cloud Puffs",e:"☁️"}],
   bg: "linear-gradient(180deg,#FFE0F0 0%,#FFF3F8 50%,#FFC9DF 100%)", hill: ["#FF9EC7","#F06FA8"], parts: i=>`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${18+(i*5)%14}px;animation-duration:${9+(i*3)%8}s;animation-delay:-${(i*1.3)%10}s">${["🍬","🍭","🧁","🍓"][i%4]}</div>`,
   stop: { a: "#FFE3F1", b: "#FF8EC2", shadow: "#C0507F", ink: "#5A1438", radius: "40%" }, trail: "#FFB3D6",
   gearOver: `<path d="M60 90 L44 81 L44 99 Z M60 90 L76 81 L76 99 Z" fill="#FF6FA8" stroke="#B0306A" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="90" r="5.5" fill="#FFD23F" stroke="#B0306A" stroke-width="2"/><rect x="48" y="104" width="6" height="2.6" rx="1.3" fill="#3EA6FF" transform="rotate(25 51 105)"/><rect x="64" y="100" width="6" height="2.6" rx="1.3" fill="#FFD23F" transform="rotate(-30 67 101)"/>` },
];
export const WORLD_BY_ID: Record<string, World> = Object.fromEntries(WORLDS_PLAY.map(w => [w.id, w]));
/** old paid backgrounds (before worlds) and the world each became; coins spent on them are given back */
export const OLD_THEMES: Record<string, { price: number; to: string }> = { lily: { price: 0, to: "pond" }, candy: { price: 35, to: "sweets" }, moon: { price: 45, to: "space" }, jungle: { price: 45, to: "dino" }, snow: { price: 55, to: "pond" }, space: { price: 70, to: "space" } };
