// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://code-and-karma.pages.dev',
  compressHTML: true,

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },

  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
