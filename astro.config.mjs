import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [
    tailwind(),
    svelte(),
  ],
  output: "server",
  site: 'https://3dwardperezs.github.io',
  base: 'final-project-test',
  adapter: netlify(),
});