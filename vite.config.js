import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Relative asset base so the same build works at a domain root (kuisytihar.com)
// and at a project subpath (user.github.io/repo/). Absolute "/assets" would
// break the subpath preview.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        facts: resolve(import.meta.dirname, 'facts.html'),
        changelog: resolve(import.meta.dirname, 'changelog.html'),
      },
    },
  },
});
