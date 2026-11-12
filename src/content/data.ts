/* All teaching content: sounds, words, letter order, stories. Written for this game (no curriculum text is copied). */
export type Phoneme = string;
/* How the voice says each sound on its own. Stretchy sounds are held (mmm, sss); bouncy sounds get the shortest "uh". */
export const SND: Record<string, string> ={b:"buh",d:"duh",f:"fff",g:"guh",h:"huh",j:"juh",k:"kuh",l:"lll",m:"mmm",n:"nnn",p:"puh",r:"rrr",s:"sss",t:"tuh",v:"vvv",w:"wuh",y:"yuh",z:"zzz",
  sh:"shhh",ch:"chuh",th:"thhh",ng:"ng",ks:"ks",kw:"kwuh",
  a:"aah",e:"eh",i:"ih",o:"aw",u:"uh",A:"ay",E:"ee",I:"eye",O:"oh",U:"you",oo:"oo",ow:"ow",oi:"oy",ar:"ar",or:"or",er:"er",aw:"aw"};
export const VOW: ReadonlySet<string> = new Set(["a","e","i","o","u","A","E","I","O","U","oo","ow","oi","ar","or","er","aw"]);
/* letter of the day, in a common kindergarten order (most useful sounds first), then 4 digraphs */
export const ORDER: readonly string[] = ["s","a","t","p","i","n","m","d","g","o","c","k","e","u","r","h","b","f","l","j","v","w","x","y","z","q","sh","ch","th","ck"];
export const LESSONS = ORDER.length;
/* keyword, picture, mouth tip */
export const KEYW: Record<string, readonly [string, string, string]> ={s:["sun","☀️","Smile and let the air hiss like a snake: sss."],a:["apple","🍎","Open wide like at the doctor: aah."],t:["tiger","🐯","Tap your tongue behind your top teeth: t, t, t."],
 p:["pig","🐷","Pop your lips! Hold your hand in front and feel the puff."],i:["igloo","🧊","A little smile, a little sound: ih, ih."],n:["nut","🥜","Tongue up, hum through your nose: nnn."],
 m:["moon","🌙","Lips together and hum, like yummy food: mmm."],d:["dog","🐶","Tongue taps the top, and your voice turns on: d, d."],g:["goat","🐐","A sound from the back of your throat: g, g."],
 o:["octopus","🐙","Make your mouth a big round O."],c:["cat","🐱","A quiet sound from the back: k, k. No voice!"],k:["kite","🪁","Kicking k says the same sound as c: k, k."],
 e:["egg","🥚","Eh! Like when you can't hear somebody."],u:["umbrella","☂️","Uh, like you're thinking. Uh, uh."],r:["rabbit","🐰","Growl like a little puppy: rrr."],
 h:["hat","🎩","Breathe on a cold window: h, h."],b:["bear","🐻","Lips pop, with your voice on: b, b."],f:["fish","🐟","Top teeth on your bottom lip and blow: fff."],
 l:["lion","🦁","Tongue up behind your teeth and sing: lll."],j:["jet","✈️","Jumpy j: j, j, j."],v:["van","🚐","Like f, but your voice buzzes: vvv."],
 w:["web","🕸️","Make a tiny kiss, then open: w, w."],x:["fox","🦊","x hides at the end of words and says ks."],y:["yo-yo","🪀","Smile and say y, y, like in yes."],
 z:["zebra","🦓","Buzz like a bee: zzz."],q:["queen","👑","q almost always comes with u, and they say kw together."],
 sh:["ship","🚢","Two letters, one sound! Finger on your lips: shhh."],ch:["chick","🐤","Two letters, one sound, like a sneezing train: ch, ch."],
 th:["thumb","👍","Two letters, one sound. Peek your tongue out and blow: thhh."],ck:["duck","🦆","Two letters, one sound: k. You'll find ck at the end of short words."]};
export const LSND: Record<string, string> ={s:"s",a:"a",t:"t",p:"p",i:"i",n:"n",m:"m",d:"d",g:"g",o:"o",c:"k",k:"k",e:"e",u:"u",r:"r",h:"h",b:"b",f:"f",l:"l",j:"j",v:"v",w:"w",x:"ks",y:"y",z:"z",q:"kw",sh:"sh",ch:"ch",th:"th",ck:"k",qu:"kw"};;
/* Listening words (phonemic awareness, all pictures). word|picture|sounds|parts (parts only for longer words).
   Pictures avoid emoji newer than 2020 so older iPads show them. */
export const BANK_SRC = `cat|🐱|k a t
hat|🎩|h a t
bat|🦇|b a t
rat|🐀|r a t
map|🗺️|m a p
cap|🧢|k a p
bag|👜|b a g
flag|🚩|f l a g
van|🚐|v a n
pan|🍳|p a n
man|👨|m a n
crab|🦀|k r a b
ant|🐜|a n t
sun|☀️|s u n
bug|🐛|b u g
mug|☕|m u g
bus|🚌|b u s
cup|🥤|k u p
duck|🦆|d u k
truck|🚚|t r u k
drum|🥁|d r u m
nut|🥜|n u t
dog|🐶|d o g
log|🪵|l o g
frog|🐸|f r o g
mop|🧹|m o p
stop|🛑|s t o p
pot|🍲|p o t
dot|🔴|d o t
sock|🧦|s o k
rock|🪨|r o k
lock|🔒|l o k
clock|🕐|k l o k
fox|🦊|f o k s
box|📦|b o k s
ox|🐂|o k s
pig|🐷|p i g
pin|📌|p i n
fish|🐟|f i sh
dish|🍽️|d i sh
ship|🚢|sh i p
lip|👄|l i p
clip|📎|k l i p
kid|🧒|k i d
king|👑|k i ng
ring|💍|r i ng
six|6️⃣|s i k s
bed|🛏️|b e d
hen|🐔|h e n
pen|🖊️|p e n
ten|🔟|t e n
net|🥅|n e t
jet|✈️|j e t
web|🕸️|w e b
leg|🦵|l e g
bell|🔔|b e l
shell|🐚|sh e l
egg|🥚|e g
bee|🐝|b E
tree|🌳|t r E
three|3️⃣|th r E
cheese|🧀|ch E z
car|🚗|k ar
star|⭐|s t ar
shark|🦈|sh ar k
moon|🌙|m oo n
spoon|🥄|s p oo n
shoe|👟|sh oo
cake|🍰|k A k
snake|🐍|s n A k
nail|💅|n A l
snail|🐌|s n A l
rain|🌧️|r A n
train|🚂|t r A n
boat|⛵|b O t
goat|🐐|g O t
coat|🧥|k O t
ice|🧊|I s
dice|🎲|d I s
rice|🍚|r I s
mice|🐭|m I s
kite|🪁|k I t
cow|🐮|k ow
owl|🦉|ow l
house|🏠|h ow s
mouse|🐁|m ow s
horse|🐴|h or s
corn|🌽|k or n
fork|🍴|f or k
ball|⚽|b aw l
chick|🐤|ch i k
butterfly|🦋||but-ter-fly
banana|🍌||ba-na-na
pumpkin|🎃||pump-kin
rainbow|🌈||rain-bow
robot|🤖||ro-bot
dinosaur|🦕||di-no-saur
elephant|🐘||el-e-phant
cupcake|🧁||cup-cake
popcorn|🍿||pop-corn
apple|🍎||ap-ple
tiger|🐯||ti-ger
octopus|🐙||oc-to-pus
hamburger|🍔||ham-bur-ger
watermelon|🍉||wa-ter-mel-on
caterpillar|🐛||cat-er-pil-lar
alligator|🐊||al-li-ga-tor
ladybug|🐞||la-dy-bug
unicorn|🦄||u-ni-corn
cookie|🍪||cook-ie
rocket|🚀||rock-et
turtle|🐢||tur-tle
penguin|🐧||pen-guin
pizza|🍕||piz-za
tomato|🍅||to-ma-to
avocado|🥑||av-o-ca-do
helicopter|🚁||hel-i-cop-ter
kangaroo|🦘||kan-ga-roo
lemon|🍋||lem-on
zebra|🦓||ze-bra
pancake|🥞||pan-cake`;
/* Reading words: decodable once their letters are taught */
export const DEC_SRC = "at sat pat tap sap pit sit tip sip pip tin pin nap pan tan ant man mat map mad dad sad dip dig pig gap got dog pot top mop not dot cot cat can cap kid kit net pet ten men pen peg bed up cup cut nut mug bug tug sun run rat rag red rip rod hat hot hit hen hug hum bat bib bus bun bag big fan fit fig fog fun fin log lip lid leg lap jam jet jog jug van vet web wet wig win fox box six ox yes yum yak zip zap quit quiz ship shop fish dish shed chip chop chin rich much thin math bath path moth duck sock rock back kick neck pick lock deck";
export const DEC_PIC: Record<string, string> ={cat:"🐱",cap:"🧢",map:"🗺️",pig:"🐷",dog:"🐶",pot:"🍲",mop:"🧹",pan:"🍳",man:"👨",ant:"🐜",pin:"📌",tin:"🥫",sad:"😢",dig:"⛏️",net:"🥅",ten:"🔟",bed:"🛏️",cup:"🥤",nut:"🥜",mug:"☕",bug:"🐛",sun:"☀️",rat:"🐀",hat:"🎩",hot:"🥵",hen:"🐔",bat:"🦇",bus:"🚌",bag:"👜",fox:"🦊",box:"📦",six:"6️⃣",log:"🪵",lip:"👄",leg:"🦵",jet:"✈️",van:"🚐",web:"🕸️",zip:"🤐",ship:"🚢",fish:"🐟",chip:"🍟",bath:"🛁",duck:"🦆",sock:"🧦",rock:"🪨",lock:"🔒",pen:"🖊️",ox:"🐂",dad:"👨‍👧",kid:"🧒",red:"🔴",run:"🏃",win:"🏆",fog:"🌫️",shop:"🏪",yum:"😋"};
export const HEART: ReadonlySet<string> = new Set(["the","is","to","a","said","was","of","I"]);
export interface Story { t: string; e: string; pages: [string, string][]; q: [string, string, string[]] }
/* One per pond; decodable from that pond's letters plus ❤️ heart words (checked by tests/content.test.ts). */
export const STORIES: Story[] = [
 {t:"Pip Sat",e:"🐸",pages:[["Pip sat.","🐸🪷"],["Tap, tap, tap!","🐸👏"],["Pip sat at a pit.","🐸🕳️"],["Sit, Pip, sit!","🐸😄"]],q:["What did Pip do?","🪑",["🚗","🍕"]]},
 {t:"Pip and Dad",e:"🍲",pages:[["Pip and Dad sat.","🐸🐸"],["Dad got a pot.","🐸🍲"],["Pip got a mop.","🐸🧹"],["Mop, mop, mop! Pip did it!","🐸✨"]],q:["What did Dad get?","🍲",["🧹","🐶"]]},
 {t:"The Red Cap",e:"🧢",pages:[["Pip got a red cap.","🐸🧢"],["The cap is on top.","🧢🔝"],["Up, up, up! The cap is up!","🧢💨☁️"],["Pip ran and got it.","🐸🏃🧢"]],q:["What color is the cap?","🔴",["🔵","🟢"]]},
 {t:"Bug in a Hut",e:"🐛",pages:[["A big bug sat in a hut.","🐛🛖"],["The bug had a hat.","🐛🎩"],["The bug did a jig!","🐛💃🎶"],["The bug fell in the mud. Ha!","🐛🟤😂"]],q:["What did the bug have?","🎩",["👟","🍎"]]},
 {t:"Fox in a Box",e:"🦊",pages:[["A fox is in a box.","🦊📦"],["Yes! The fox can fit.","🦊👍"],["The fox can zig and zag!","🦊⚡"],["Bam! The box is flat.","📦😮"]],q:["Where is the fox?","📦",["🛏️","🌳"]]},
 {t:"The Fish Shop",e:"🐟",pages:[["Pip went to the fish shop.","🐸🏪"],["A fish sat on a rock.","🐟🪨"],["A duck got a chip.","🦆🍟"],["Quick, duck! The fish can splash!","🐟💦🦆"]],q:["What did the duck get?","🍟",["🧦","🔔"]]}];
export interface Pond { n: string; e: string; c: string }
export const PONDS: Pond[] = [{n:"Sunny Pond",e:"☀️",c:"#F5A623"},{n:"Mossy Log",e:"🪵",c:"#5BAA47"},{n:"Reed Island",e:"🌾",c:"#C08A2E"},{n:"Firefly Creek",e:"✨",c:"#7A5AF8"},{n:"Splashy Falls",e:"💦",c:"#2B8FD6"},{n:"Moon Pond",e:"🌙",c:"#3D4BA8"}];
export const CAPSENT: readonly string[] = ["Pip sat on a log.","Dad got a red cap.","Max and Pip ran.","Sam has a big dog.","The cat is on the mat.","Kim can hop.","A bug is in the cup.","Ben fed the fish."];
