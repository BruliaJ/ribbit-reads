# Ribbit Reads

A learn-to-read-and-write game for kids. Pip the frog runs a short daily lesson that follows the
Heggerty phonemic awareness routine (rhyme, blend, find a sound, break words apart, add / take away /
swap sounds), then a letter of the day to trace (little and capital), letter sounds, decodable words
to read and spell, and a short story every fifth lesson.

- **Pond**: 30 lessons in 6 ponds (s a t p i n m d g o c k e u r h b f l j v w x y z q, then sh ch th ck)
- **ABC**: practise any letter, big and little: watch, trace, write on your own, match the partner
- **Words (Ask Pip)**: type or say "How do you spell dinosaur?" / "My name is Mia" and Pip teaches it
- **Games**: Bubble Rhymes, Fly Snack, River Hop, Big & Little
- **Closet**: Pip's colors, hats, pond backgrounds, pens and celebrations, bought with coins
- **Stickers**, buddy pals (shared with Loopaloo), and a grown-ups area behind a number gate

It is a single static page (`index.html`) with no build step needed to host it. It is also published
as a Claude artifact. Progress is saved in the browser's local storage on each device.
Independent game; not made by or affiliated with Heggerty.

## Editing

Source lives in `src/`:
- `data.js`: sounds, word lists, letter order, stories
- `glyphs.js`: print letter stroke shapes for tracing
- `app.js`: lesson plan, lesson steps, trace pad, rewards, celebrations
- `extras.js`: games, ABC practice, closet, stickers, My Words and voice, grown-ups
- `pals.js`, `hats.js`: pal and hat art shared with Loopaloo
- `style.css`, `page.html`: look and layout

Rebuild `index.html` after editing:

```bash
bash src/build.sh
```
