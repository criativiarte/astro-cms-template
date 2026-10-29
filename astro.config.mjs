import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
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
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Atkinson Hyperlegible",
      cssVariable: "--font-atkinson-body",
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["monospace"],
    },
  ],
  prefetch: {
    prefetchAll: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
