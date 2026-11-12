/* Closet catalog: everything a child can earn or buy with coins. */
export interface Item { n: string; price: number; [k: string]: unknown }
export const FROGS: Record<string, Item & { a: string; b: string; belly: string; ch: string; stars?: 1; rainbow?: 1; shine?: 1 }> = {
 lime:{n:"Lily green",price:0,a:"#8EDB6E",b:"#3E9B3A",belly:"#EAF8C4",ch:"#FF9BB0"},
 pink:{n:"Bubblegum",price:30,a:"#FFAED2",b:"#E0518F",belly:"#FFE8F2",ch:"#FF5A8A"},
 blue:{n:"Blue raspberry",price:30,a:"#8FD0FF",b:"#2E7FD0",belly:"#E6F5FF",ch:"#FF9BB0"},
 sunset:{n:"Sunset",price:45,a:"#FFC94F",b:"#F0612E",belly:"#FFF3CF",ch:"#FF6B6B"},
 grape:{n:"Grape",price:45,a:"#BE9BFF",b:"#6B3FD8",belly:"#F1E9FF",ch:"#FF8FC4"},
 galaxy:{n:"Galaxy",price:70,a:"#6A5FE8",b:"#1D1453",belly:"#C2BCFF",ch:"#FF8FC4",stars:1},
 rainbow:{n:"Rainbow",price:80,a:"#FF6B6B",b:"#7A5AF8",belly:"#FFFFFF",ch:"#FF8FC4",rainbow:1},
 gold:{n:"Golden",price:100,a:"#FFEA8F",b:"#D49A00",belly:"#FFF9DC",ch:"#FF9BB0",shine:1}};
export const HATS: Record<string, Item> = {none:{n:"No hat",price:0},bow:{n:"Big bow",price:20},flower:{n:"Daisy",price:20},party:{n:"Party hat",price:25},cowboy:{n:"Cowboy hat",price:35},crown:{n:"Crown",price:40},wizard:{n:"Wizard hat",price:45}};
export const THEMES: Record<string, Item & { e: string; bg: string; hill: [string, string]; parts: (i: number) => string }> = {
 lily:{n:"Lily pond",price:0,e:"🪷",bg:"linear-gradient(180deg,#CFEFFF 0%,#E6F8F0 45%,#A6DFC9 100%)",hill:["#7FCF9A","#4FAE74"],parts:i=>i%3?`<div class="amb drift" style="top:${50+(i*11)%40}vh;font-size:${26+(i*7)%20}px;animation-duration:${36+(i*7)%30}s;animation-delay:-${(i*6)%40}s">🪷</div>`:`<div class="amb flyb" style="left:${(i*29)%90}vw;top:${10+(i*13)%40}vh;font-size:26px;animation-delay:-${i}s">🐞</div>`},
 candy:{n:"Candy creek",price:35,e:"🍭",bg:"linear-gradient(180deg,#FFE0F0 0%,#FFF3F8 50%,#FFC9DF 100%)",hill:["#FF9EC7","#F06FA8"],parts:i=>`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${18+(i*5)%14}px;animation-duration:${9+(i*3)%8}s;animation-delay:-${(i*1.3)%10}s">${["🍬","🍭","🧁","🍓"][i%4]}</div>`},
 moon:{n:"Moonlight",price:45,e:"🌙",bg:"linear-gradient(180deg,#1C2456 0%,#33408F 60%,#5B67B8 100%)",hill:["#2C3A7A","#1B2557"],parts:i=>`<div class="amb tw ffly" style="left:${(i*41)%100}vw;top:${(i*23)%75}vh;animation-delay:-${(i*.7)%2}s"></div>`},
 jungle:{n:"Jungle",price:45,e:"🦜",bg:"linear-gradient(180deg,#C9F2C2 0%,#EAF9DF 50%,#8CCB6E 100%)",hill:["#5BAA47","#3C8A2E"],parts:i=>i%4?`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${18+(i*5)%14}px;animation-duration:${10+(i*3)%8}s;animation-delay:-${(i*1.3)%10}s">🍃</div>`:`<div class="amb drift" style="top:${8+(i*7)%30}vh;font-size:34px;animation-duration:${18+i}s;animation-delay:-${i*2}s">🦜</div>`},
 snow:{n:"Snow day",price:55,e:"❄️",bg:"linear-gradient(180deg,#C7DDFF 0%,#EEF5FF 55%,#FFFFFF 100%)",hill:["#FFFFFF","#DDEBFF"],parts:i=>`<div class="amb fall" style="left:${(i*37)%100}vw;font-size:${12+(i*5)%16}px;color:#fff;text-shadow:0 0 4px #8FB4E8;animation-duration:${9+(i*3)%8}s;animation-delay:-${(i*1.1)%10}s">❄</div>`},
 space:{n:"Outer space",price:70,e:"🪐",bg:"linear-gradient(180deg,#0E1033 0%,#251E5C 60%,#3E2E85 100%)",hill:["#4A3C99","#2B2366"],parts:i=>i%5?`<div class="amb tw" style="left:${(i*41)%100}vw;top:${(i*23)%80}vh;font-size:${8+(i*5)%12}px;color:#FFF6B0;animation-delay:-${(i*.7)%2}s">✦</div>`:`<div class="amb drift" style="top:${10+(i*9)%40}vh;font-size:40px;animation-duration:${30+i}s;animation-delay:-${i*3}s">${i%2?"🪐":"🛸"}</div>`}};
export const PENS: Record<string, Item & { c?: string; d?: string; glow?: 1; rainbow?: 1 }> = {
 blue:{n:"Pond blue",price:0,c:"#1F5FBF",d:"#9CC8FF"},
 leaf:{n:"Leaf green",price:20,c:"#1F8A44",d:"#7FE3A3"},
 berry:{n:"Berry pink",price:25,c:"#D12B6E",d:"#FF8CC0"},
 grape:{n:"Grape",price:25,c:"#6B3FD8",d:"#C4A8FF"},
 neon:{n:"Glow slime",price:40,c:"#0FAE5C",d:"#3DFF95",glow:1},
 rainbow:{n:"Rainbow",price:60,rainbow:1},
 gold:{n:"Gold glitter",price:70,c:"#B98000",d:"#FFD54A",glow:1}};
export const PARTIES: Record<string, Item & { e: string }> = {
 confetti:{n:"Confetti",price:0,e:"🎊"},
 bubbles:{n:"Bubble storm",price:30,e:"💦"},
 fireworks:{n:"Fireworks",price:45,e:"🎆"},
 chorus:{n:"Frog choir",price:60,e:"🎶"},
 parade:{n:"Pal parade",price:60,e:"🎈"}};
export type Cat = "frog" | "hat" | "theme" | "pen" | "party";
export const CATS: [Cat, string, Record<string, Item>][] = [["frog","Pip's colors",FROGS],["hat","Hats",HATS],["theme","Ponds",THEMES],["pen","Pens",PENS],["party","Celebrations",PARTIES]];
/* surprise gifts come in this order, one every 3rd lesson (never random) */
export const GIFT_ORDER: [Cat, string][] = [["hat","bow"],["pen","leaf"],["frog","blue"],["party","bubbles"],["hat","party"],["theme","candy"],["pen","berry"],["frog","pink"],["hat","flower"],["party","fireworks"]];

