import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Troque pela URL pública do site antes do deploy.
  site: "http://seu-dominio.com",
  integrations: [
    sitemap({
      // Exclui o painel administrativo e qualquer rota dentro dele.
      filter: (page) => !/^\/admin(?:\/|$)/.test(new URL(page).pathname),
    }),
  ],
  output: "static",
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
