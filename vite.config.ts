import { defineConfig } from 'vite';

/* Two builds from one source:
   - default: the website and the apps (dist/), fonts bundled, no outside requests.
   - artifact: one self-contained page for the Claude artifact (scripts/inline-artifact.mjs). */
export default defineConfig(({ mode }) => ({
  base: './',
  define: { __ARTIFACT__: JSON.stringify(mode === 'artifact') },
  build: {
    target: 'es2020', assetsInlineLimit: mode === 'artifact' ? 100_000_000 : 4096, cssCodeSplit: false,
    rollupOptions: mode === 'artifact' ? { output: { inlineDynamicImports: true } } : {},
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
}));
