# Ribbit Reads

A learn-to-read-and-write game for kids. Pip the frog runs a short daily lesson that follows the
Heggerty phonemic awareness routine (rhyme, blend, find a sound, break words apart, add / take away /
swap sounds), then a letter of the day to trace (little and capital), letter sounds, decodable words
to read and spell, and a short story every fifth lesson.

- **Pond**: 30 lessons in 6 ponds (s a t p i n m d g o c k e u r h b f l j v w x y z q, then sh ch th ck)
- **ABC**: practise any letter, big and little: watch, trace, write on your own, match the partner
- **Words (Ask Pip)**: type a word or name (inside Claude, also say "How do you spell dinosaur?") and Pip teaches it; names are never saved
- **Games**: Bubble Rhymes, Fly Snack, River Hop, Big & Little
- **Closet**: Pip's colors, hats, pond backgrounds, pens and celebrations, bought with coins
- **Stickers**, buddy pals (shared with Loopaloo), and a grown-ups area behind a number gate

Website (Vercel), iPhone/iPad and Android apps (Capacitor), and a Claude artifact, all from one source.
Read **docs/HANDOFF.md** first. Independent game; not made by or affiliated with Heggerty.

```bash
npm ci
npm run dev        # play locally
npm test           # unit tests
npm run e2e        # browser tests
npm run build      # website -> dist/
npm run app:sync   # apps (see docs/app.md)
```
