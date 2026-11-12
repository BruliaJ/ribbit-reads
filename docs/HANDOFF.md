# Ribbit Reads — handoff

## Live
| Thing | Value |
|---|---|
| GitHub | `BruliaJ/ribbit-reads` (private), Julia's personal account |
| Website | https://ribbit-reads-lake.vercel.app (Vercel team "brulia", project `ribbit-reads`; merging to `main` deploys, branches get previews) |
| Claude artifact | https://claude.ai/artifact/2dAJAwk22YF9i6wrRbFsyB (built with `npm run build:artifact` → `artifact.html`) |
| Apps | iOS + Android projects in `ios/`, `android/` (Capacitor 8). See docs/app.md. |

## What it is
A learn-to-read-and-write game for kids (about ages 4–7). Pip the frog runs a short **daily lesson**, 30 lessons in
6 regions (named by the world being played). The order of skills follows the **Heggerty** phonemic-awareness routine, out loud with pictures so no
reading is needed, then phonics: rhyme → blend → find a sound → break a word apart → add / take away / swap a sound
→ letter of the day (sound, mouth tip, trace little and capital, then write on your own) → big-and-little partners →
letter sounds / names → read a decodable word → spell it with sound boxes → write it → (every 5th lesson) a short
decodable story with ❤️ heart words. Letters come in a common kindergarten order (s a t p i n …), then sh ch th ck.
The plan is in `src/logic/plan.ts`; skill difficulty grows by lesson.

**Worlds** (Nov 13, 2026; `src/content/worlds.ts`): Lily Pond, Outer Space, Under the Sea, Dino Valley, Sweet Hills.
Free to switch any time (🌍 Change world on the map); every world plays the same 30 lessons with the same progress.
A world reskins the map (6 region names, stop shape and color), the background scene, the lesson trail, game
backgrounds and Pip's gear (helmet, snorkel, dino spikes, bow tie). The old paid backgrounds became these worlds;
saves that bought one get those coins back once (`src/logic/state.ts`, tested). To add a world: one entry in
worlds.ts (tests check regions and emoji).

Other places: **ABC** (practise any letter, big and little), **Words / Ask Pip** (type a word or name to learn to
spell it; inside Claude also by voice), **Games** (Bubble Rhymes, Fly Snack, River Hop, Big & Little), **Closet**
(Pip's colors, hats, pond backgrounds, pens, celebrations; coins), **Stickers**, buddy pals (shared art with
Loopaloo), **Grown-ups** (🔒, number-in-words gate: progress, voice speed, open lessons, calmer celebrations, reset).

## Getting around
- Each screen has its own address (`#pond`, `#abc`, `#words`, …), so phone/browser Back works. Leaving a lesson
  (✕ or Back) pauses it; the pond shows **▶ Keep going** at the same step. Lessons and games hide the menu.
- Stars only for finished lessons (1–3, at least 1); coins from lessons and games; a gift every 3rd lesson in a
  fixed order (never random); 2 pals per lesson in the chosen world; pals never re-lock.

## Privacy and kids' law (standing decisions)
- **No real names, ever** (Julia, Nov 12, 2026). Names can be practised in Words; they are not saved, and old saves
  that held a name are cleaned on load (`src/logic/state.ts`, tested).
- **No microphone in the apps or on the website** (Julia, Nov 12, 2026: voice comes out before the App Store).
  Voice questions work only inside Claude (Claude dictation; the page only receives words). Browser speech
  recognition is never used (Chrome sends audio to Google).
- **Speech out**: the device's own on-device voices only (online voices are skipped). If none exists, the pond shows
  how a grown-up can add one. Inside Claude a grown-up can choose Claude's voice.
- Nothing leaves the device: no analytics, ads, accounts; fonts are bundled on the website and in the apps (the
  Claude artifact loads them from Google Fonts because artifacts can't bundle files the same way).
- Progress: localStorage `ribbitreads.v1` (older `soundhop.v1` is read once). A save that can't be read is copied
  to `ribbitreads.backup` first. Two open tabs merge (progress only grows). Apps keep a second copy in Preferences.

## Content
All words, stories, mouth tips and sound spellings are written for this game (`src/content/data.ts`). Not affiliated
with Heggerty; never copy their (or any curriculum's) materials. Pictures avoid emoji newer than 2020 so older iPads
show them (a test scans all game code); each picture names one word. Tests in `tests/content.test.ts` check: stories only use taught letters plus
heart words, every letter traces little and big, every reading word becomes decodable.
Single sounds are spoken as close as a device voice can (mmm, sss, buh); `SND` in data.ts.

## Tech
Vite + TypeScript (strict) for rules (`src/logic`, `src/content`, `src/host`); the screens are one JS module
(`src/game/game.js`). Vitest unit tests (`tests/`), Playwright browser tests (`e2e/`, phone / small phone /
desktop: every lesson step, tracing with a finger, Back + Keep going, saves, names never stored, no outside
requests, no sideways scrolling). CI: `.github/workflows/ci.yml` (typecheck, unit, build, artifact build, e2e,
Android build).
- `npm run dev` · `npm test` · `npm run e2e` · `npm run build` (website → dist/) · `npm run build:artifact`
  (→ artifact.html for the Claude artifact) · `npm run app:sync` · `npm run gen:icons`.
- Test hook: add `?e2e` to the address to get `window.__rr` (jump to a lesson/step); it can't change any rules.

## Open items
- Julia and kids play-test: lesson length (13–18 steps; pausing helps), whether device voices say single sounds
  well enough on her iPad; consider recorded sound clips later (like Panda Hanzi's open item).
- Store prep in docs/app.md (appId, strict parental gate, privacy policy, real-device tests).
- Trademark check for the name "Ribbit Reads" before launch.
