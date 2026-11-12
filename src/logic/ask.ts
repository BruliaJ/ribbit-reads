/* Understanding what a child typed or said in "Ask Pip". Pure. */
export const cleanWord = (t: string): string => t.replace(/[^A-Za-z' -]/g, '').replace(/['-]/g, '').replace(/\s+/g, ' ').trim();
export const capName = (t: string): string => t.split(' ').map(x => (x ? (x[0] ?? '').toUpperCase() + x.slice(1).toLowerCase() : x)).join(' ');
/** "how do you spell dinosaur" -> dinosaur; "my name is mia" -> Mia (a name). At most two words. */
export function parseAsk(raw: string): { word: string; name: boolean } {
  let t = String(raw || '').trim().replace(/[?.!,]+$/, ''); let name = false;
  let m = t.match(/(?:my name is|my name's|i am|i'm|call me)\s+(.+)/i);
  if (m) { name = true; t = m[1] ?? ''; }
  else {
    m = t.match(/(?:how (?:do|can|would) (?:you|i|we) (?:spell|write)|can you (?:teach me to )?(?:spell|write)|teach me (?:to spell|to write|how to spell|how to write)?|help me (?:spell|write)|spell|write)\s+(?:the word\s+|my\s+)?(.+)/i);
    if (m) t = m[1] ?? '';
  }
  m = t.match(/^(?:my (?:brother|sister|mom|dad|friend|dog|cat)(?:'s)? name(?:,)?(?:\s+is)?\s*)(.+)/i);
  if (m) { name = true; t = m[1] ?? ''; }
  t = cleanWord(t).split(' ').slice(0, 2).join(' ').slice(0, 16);
  return { word: name ? capName(t) : t.toLowerCase(), name };
}
