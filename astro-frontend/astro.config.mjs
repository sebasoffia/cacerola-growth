import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  base: '/growth',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind()]
});
