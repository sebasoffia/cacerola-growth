import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  base: '/growth',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind()],
  vite: {
    define: {
      'import.meta.env.WORDPRESS_API_URL': JSON.stringify(
        process.env.WORDPRESS_API_URL || 'http://localhost:8080'
      )
    }
  }
});
