/* The daily routine. Every lesson runs the same short order, like a daily phonemic-awareness lesson:
   rhyme → blend → find a sound → break a word apart → change a sound → letter of the day (little and big)
   → letter sounds and names → read → spell → write → (every 5th lesson) a story. Each slot grows harder over 30 lessons. */
import { ORDER, STORIES, type Story } from '../content/data';
import { decodableAt } from './phonics';

export type Step =
  | { t: 'rhymeYN' | 'rhymePick' | 'onset' | 'syllBlend' | 'syllCount' | 'addS' | 'delS' | 'subS' | 'letterQuiz' | 'letterName' | 'read' | 'spell' | 'write' | 'capFix' }
  | { t: 'blend' | 'segment'; max: number }
  | { t: 'iso'; pos: 'first' | 'last' | 'middle' }
  | { t: 'meet'; L: string }
  | { t: 'trace'; text: string; label: string }
  | { t: 'caseMatch'; L?: string; dir?: 'up' | 'down' }
  | { t: 'cover' | 'storyQ'; s: Story }
  | { t: 'page'; p: [string, string]; s: Story }
  | { t: 'cmeet' | 'cbuild' | 'cread'; w: string };

export function planLesson(n: number, opts: { caps: boolean } = { caps: true }): Step[] {
  const L = ORDER[n] ?? 's'; const steps: Step[] = [];
  steps.push({ t: n < 6 ? 'rhymeYN' : 'rhymePick' });
  if (n < 4) steps.push({ t: 'onset' }); else if (n < 8) steps.push({ t: 'syllBlend' }); else steps.push({ t: 'blend', max: n < 16 ? 3 : 4 });
  steps.push({ t: 'iso', pos: n < 8 ? 'first' : n < 15 ? 'last' : 'middle' });
  steps.push(n < 6 ? { t: 'syllCount' } : { t: 'segment', max: n < 14 ? 3 : 4 });
  if (n >= 10) steps.push({ t: n < 16 ? 'addS' : n < 22 ? 'delS' : 'subS' });
  else if (n >= 4) steps.push({ t: 'onset' });
  steps.push({ t: 'meet', L });
  steps.push({ t: 'trace', text: L, label: L.length > 1 ? 'Two letters, one sound' : 'Little letter' });
  if (L.length === 1 && opts.caps) steps.push({ t: 'trace', text: L === 'q' ? 'Qu' : L.toUpperCase(), label: 'Capital letter' });
  if (L.length === 1) steps.push({ t: 'caseMatch' });
  if (n >= 1) steps.push({ t: 'letterQuiz' });
  if (n >= 3 && n % 2 === 1) steps.push({ t: 'letterName' });
  if (decodableAt(n).length >= 3) {
    steps.push({ t: 'read' });
    if (n >= 2) steps.push({ t: 'spell' });
    if (n >= 3 && n % 2 === 1) steps.push({ t: 'write' });
  }
  if (n >= 8 && n % 2 === 0) steps.push({ t: 'capFix' });
  if (n % 5 === 4) {
    const st = STORIES[Math.floor(n / 5)];
    if (st) { steps.push({ t: 'cover', s: st }); st.pages.forEach(p => steps.push({ t: 'page', p, s: st })); steps.push({ t: 'storyQ', s: st }); }
  }
  return steps;
}
const LABEL: Record<string, string> = { rhymeYN: 'rhyme yes/no', rhymePick: 'find a rhyme', onset: 'blend start + end', syllBlend: 'blend word parts', blend: 'blend sounds', iso: 'find a sound', syllCount: 'clap parts', segment: 'count sounds', addS: 'add a sound', delS: 'take away a sound', subS: 'swap a sound', meet: 'letter of the day', trace: 'tracing little and capital', caseMatch: 'big and little partners', letterQuiz: 'letter sounds', letterName: 'letter names', read: 'read a word', spell: 'spell a word', write: 'write a word', capFix: 'capitals in sentences', cover: 'story' };
export const skillsFor = (n: number): string => [...new Set(planLesson(n).map(s => LABEL[s.t]).filter(Boolean))].join(', ');
