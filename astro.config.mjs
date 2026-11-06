import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import llms from 'astro-llms-md';
import icon from 'astro-icon';
import { readFileSync, writeFileSync } from 'node:fs';
import { SITE_DESCRIPTION, SITE_TITLE } from './src/consts';

export default defineConfig({
  // Troque pela URL pública do site antes do deploy.
  site: "https://seu-dominio.com",
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Atkinson Hyperlegible',
      cssVariable: '--font-atkinson',
      weights: [400, 700],
      styles: ['normal'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 700],
      styles: ['normal'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  ],
  integrations: [
    icon({ iconDir: './src/assets/icons' }),
    sitemap({
      // Exclui qualquer página marcada com noindex no HTML gerado.
      filter: (page) =>
        !/<meta[^>]+name="robots"[^>]+noindex/i.test(
          readFileSync(`dist${new URL(page).pathname}index.html`, 'utf8'),
        ),
    }),
    llms({
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      exclude: ['500', '500.html', 'admin'],
    }),
    {
      name: 'llms-utf8',
      hooks: {
        'astro:build:done': () => {
          // Identifica o UTF-8 ao abrir os arquivos de texto no navegador.
          for (const file of ['dist/llms.txt', 'dist/llms-full.txt']) {
            writeFileSync(file, '\uFEFF' + readFileSync(file, 'utf8'));
          }
        },
      },
    },
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
