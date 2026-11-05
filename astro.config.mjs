import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import llms from 'astro-llms-md';
import { readFile, writeFile } from 'node:fs/promises';
import { SITE_DESCRIPTION, SITE_TITLE } from './src/consts';

export default defineConfig({
  // Troque pela URL pública do site antes do deploy.
  site: "http://seu-dominio.com",
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
    sitemap({
      // Exclui o painel administrativo e qualquer rota dentro dele.
      filter: (page) => !/^\/admin(?:\/|$)/.test(new URL(page).pathname),
    }),
    llms({
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      exclude: ['500', '500.html', 'admin'],
    }),
    {
      name: 'llms-utf8',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          // Identifica o UTF-8 ao abrir os arquivos de texto no navegador.
          for (const name of ['llms.txt', 'llms-full.txt']) {
            const file = new URL(name, dir);
            await writeFile(file, '\uFEFF' + (await readFile(file, 'utf8')).replace(/^\uFEFF/, ''));
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
