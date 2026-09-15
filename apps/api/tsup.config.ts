import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  // Workspace packages ship TS source, so they must be bundled in; everything
  // else stays external and is installed from package.json at deploy time.
  noExternal: [/^@ditto\//],
});
