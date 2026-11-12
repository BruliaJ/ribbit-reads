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
export type Cat = "frog" | "hat" | "pen" | "party";
export const CATS: [Cat, string, Record<string, Item>][] = [["frog","Pip's colors",FROGS],["hat","Hats",HATS],["pen","Pens",PENS],["party","Celebrations",PARTIES]];
/* surprise gifts come in this order, one every 3rd lesson (never random) */
export const GIFT_ORDER: [Cat, string][] = [["hat","bow"],["pen","leaf"],["frog","blue"],["party","bubbles"],["hat","party"],["pen","grape"],["pen","berry"],["frog","pink"],["hat","flower"],["party","fireworks"]];

