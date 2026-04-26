import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  integrations: [react()],
  vite: {
    ssr: {
      external: ['@supabase/supabase-js'],
    },
  },
});
