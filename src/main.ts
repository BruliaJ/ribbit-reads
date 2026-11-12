import './styles.css';
import { boot } from './game/game.js';

/* Website and apps: fonts ship with the game (no requests to font servers, for kids' privacy).
   The Claude artifact build loads the same fonts from Google Fonts instead (scripts/inline-artifact.mjs). */
const fonts = __ARTIFACT__ ? Promise.resolve() : Promise.all([
    import('@fontsource/andika/latin-400.css'), import('@fontsource/andika/latin-700.css'),
    import('@fontsource/fredoka/latin-500.css'), import('@fontsource/fredoka/latin-600.css'), import('@fontsource/fredoka/latin-700.css'),
    import('@fontsource/nunito/latin-600.css'), import('@fontsource/nunito/latin-800.css'), import('@fontsource/nunito/latin-900.css'),
]).then(() => undefined, () => undefined);
/* start right away; fonts swap in when ready */
void fonts;
boot();
