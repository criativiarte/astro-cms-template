# Astro + Sveltia CMS Template

Template Astro estatico com blog em Content Collections e painel administrativo em `/admin/`.

O Sveltia CMS salva posts como Markdown em `src/content/blog`. Cada alteracao feita pelo painel gera commit no GitHub; o push na branch configurada dispara o workflow existente, que roda o build estatico e publica `dist/` no servidor.

Esta versao usa login por token manual do GitHub. Nao ha OAuth App, PHP, servidor, worker ou funcao serverless envolvidos.

## Estrutura

- `src/content/blog`: posts em Markdown/MDX.
- `public/admin`: painel Sveltia CMS carregado por CDN.
- `src/assets/blog`: uploads de imagens de capa do CMS, processados pelo Astro.
- `.github/workflows/ci-cd-static-pipeline.yml`: build e deploy por SSH/SCP.

## Configuracao do CMS

Antes de publicar o template, abra `public/admin/config.yml` e substitua os placeholders:

```yml
repo: "<usuario-ou-org>/<repositorio>"
branch: "<branch>"
site_url: "<url-do-site>"
```

Exemplo:

```yml
repo: "criativiarte/astro-sveltia-cms-template"
branch: "main"
site_url: "https://seu-dominio.com"
```

Esses valores nao sao secretos; o navegador precisa deles para o CMS saber em qual repositorio salvar os posts.

Depois, abra `astro.config.mjs` e troque a URL pública usada pelo Astro, RSS e sitemap:

```js
site: "https://seu-dominio.com",
```

## Token do GitHub

Crie um fine-grained personal access token no GitHub:

```txt
GitHub -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token
```

Configuracao recomendada:

```txt
Token name:
CMS - nome-do-repositorio

Expiration:
180 dias, 366 dias ou uma data combinada com o cliente

Resource owner:
usuario ou organizacao dona do repositorio

Repository access:
Only selected repositories

Selected repository:
nome-do-repositorio

Repository permissions:
Contents: Read and write
Metadata: Read
```

Copie o token imediatamente. O GitHub nao mostra o token novamente depois.

No painel:

```txt
https://seu-dominio.com/admin/
```

Use a opcao de entrar com token e cole o token gerado. O token fica salvo no navegador do usuario, entao trate-o como senha.

## Frontmatter dos posts

```yaml
title: "Titulo do post"
status: "Publicado"
pubDate: "2026-01-01T00:00:00.000Z"
updatedDate: "2026-01-02T00:00:00.000Z"
description: "Resumo usado em SEO e listagens."
coverImage: "/src/assets/blog/capa.png"
author: "Equipe"
tags:
  - Astro
  - Sveltia CMS
```

O slug do post e gerado automaticamente a partir do titulo pelo CMS, como nome do arquivo Markdown. `updatedDate` e opcional, manual e nao recebe valor automatico. Posts com `status: "Rascunho"` nao aparecem no site.

As imagens de capa enviadas pelo CMS sao salvas em `src/assets/blog`. O CMS grava o caminho como `/src/assets/blog/...`, e o schema do Astro normaliza esse valor para um asset local durante o build. Assim o Astro consegue processar e otimizar a imagem.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

A data/hora de publicacao e preenchida automaticamente quando um post e criado no CMS. A data/hora de atualizacao e manual, opcional e deve ser preenchida apenas quando fizer sentido editorialmente.
