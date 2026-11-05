# Astro + CMS Template

Template de site estático com Astro, Tailwind CSS e Sveltia CMS. Inclui blog, páginas por tag, SEO, fontes locais e publicação pelo GitHub.

O conteúdo dos posts fica em Markdown no repositório. As edições feitas no CMS geram commits; o workflow executa o build e publica os arquivos estáticos no servidor, após a configuração do deploy.

## Sumário

- [Recursos](#recursos)
- [Início rápido](#início-rápido)
- [Configuração do site](#configuração-do-site)
- [Acesso ao CMS](#acesso-ao-cms)
- [Conteúdo do blog](#conteúdo-do-blog)
- [Integrações](#integrações)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Deploy](#deploy)

## Recursos

- Home e política de privacidade editadas diretamente em Astro.
- Blog com Content Collections, validação de campos, ordenação por data e páginas por tag.
- Painel em `/admin/`, com autenticação por token do GitHub e edição de posts.
- Metadados de SEO, Open Graph, cartão do Twitter/X e JSON-LD para artigos.
- Fontes servidas pelo próprio site, ícones SVG e otimização de imagens de capa.
- Sitemap, RSS, `llms.txt` e versões Markdown gerados no build.
- Workflow de publicação por SSH/SCP.

## Início rápido

**Requisito:** Node.js 22.23.4 ou superior.

Após criar seu repositório a partir deste template e cloná-lo:

```bash
npm install
npm run dev
```

Acesse o site em `http://localhost:4321` e o painel em `http://localhost:4321/admin/`.

| Comando           | Função                                       |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento.        |
| `npm run check`   | Verifica os arquivos Astro e os tipos.       |
| `npm run build`   | Gera o site estático em `dist/`.             |
| `npm run preview` | Serve o último build para conferência local. |

O TypeScript está mantido na série 6 para compatibilidade com a versão de `@astrojs/check` usada no projeto. O ambiente de build precisa instalar também as `devDependencies`.

## Configuração do site

### Identidade e domínio

| Arquivo                                      | O que configurar                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| [`src/consts.ts`](src/consts.ts)             | `SITE_TITLE`, `SITE_DESCRIPTION` e `SITE_IMAGE`.                         |
| [`astro.config.mjs`](astro.config.mjs)       | `site`, com a URL pública usada em canonical, sitemap, RSS e `llms.txt`. |
| [`public/favicon.png`](public/favicon.png)   | Ícone do site e logo usada pelo CMS.                                     |
| [`public/og-image.png`](public/og-image.png) | Imagem padrão de compartilhamento.                                       |

Em `astro.config.mjs`, substitua o domínio de exemplo:

```js
site: "https://seu-dominio.com",
```

### Repositório do CMS

Edite [`public/admin/config.yml`](public/admin/config.yml):

```yaml
backend:
  name: github
  auth_methods: [token]
  repo: "usuario-ou-org/nome-do-repositorio"
  branch: "main"

site_url: "https://seu-dominio.com"
```

`repo` deve apontar para o repositório do site, e `branch` para a branch que recebe as edições. `site_url` precisa ser uma URL absoluta; durante o desenvolvimento, pode usar `http://localhost:4321`.

Nesse mesmo arquivo, `app_title` define o título do painel e `logo` define sua imagem. Essas opções são públicas e não devem conter credenciais.

### Política de privacidade

Edite [`src/pages/politica-de-privacidade.astro`](src/pages/politica-de-privacidade.astro) antes de publicar: preencha o controlador, o contato e a data de revisão, e adapte as declarações ao tratamento real dos dados.

O modelo contempla Analytics, Google Ads, Meta Pixel e fontes. O texto não instala ferramentas de rastreamento nem implementa gerenciamento de consentimento.

## Acesso ao CMS

Esta configuração usa um **fine-grained personal access token** do GitHub. Não exige OAuth App ou backend de autenticação próprio.

1. No GitHub, acesse **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Crie um token para o usuário ou organização responsável pelo repositório.
3. Em **Repository access**, selecione apenas o repositório do site.
4. Conceda **Contents: Read and write** e **Metadata: Read**.
5. Defina uma expiração adequada e copie o token ao criá-lo.
6. Abra `/admin/`, escolha o acesso por token e cole a credencial.

> [!IMPORTANT]
> O token fica salvo no navegador utilizado para acessar o painel. Trate-o como senha e não o adicione ao código ou ao arquivo de configuração do CMS.

As edições são gravadas no GitHub. Para refletirem no site publicado, a branch configurada deve acionar um deploy funcional.

## Conteúdo do blog

### Campos dos posts

Os posts ficam em [`src/content/blog/`](src/content/blog/). Exemplo de frontmatter:

```yaml
---
title: "Título do post"
description: "Resumo usado no SEO e nas listagens."
status: "Publicado"
pubDate: "2026-01-01T00:00:00.000Z"
updatedDate: "2026-01-02T00:00:00.000Z"
coverImage: "/src/assets/images/blog/capa.png"
author: "Equipe"
tags:
  - Astro
  - CMS
---
```

| Campo                   | Regra                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| `title` e `description` | Obrigatórios, sem valores vazios ou apenas espaços.                      |
| `pubDate`               | Data obrigatória, preenchida pelo CMS na criação.                        |
| `status`                | `Publicado` ou `Rascunho`; assume `Publicado` se ausente, vazio ou nulo. |
| `updatedDate`           | Opcional e manual; não recebe atualização automática.                    |
| `coverImage` e `author` | Opcionais.                                                               |
| `tags`                  | Lista opcional; assume uma lista vazia quando não informada.             |

O schema em [`src/content.config.ts`](src/content.config.ts) valida os dados. Rascunhos ficam fora das páginas públicas, das listagens e do RSS.

### URLs e imagens

O CMS gera o nome do arquivo a partir do título na criação e permite ajustar o slug antes do primeiro salvamento. O Astro usa `post.id` na URL `/blog/<slug>/`: alterar o título preserva o endereço; renomear o arquivo altera a URL. As tags usam slugs gerados por `slugify` e têm arquivos em `/blog/tags/<tag>/`.

As capas enviadas pelo CMS são salvas em `src/assets/images/blog/`. O schema converte o caminho gravado no frontmatter para um asset local, permitindo o processamento das imagens pelo Astro.

## Integrações

As integrações são configuradas em [`astro.config.mjs`](astro.config.mjs).

### Estilos e fontes

O Tailwind CSS v4 usa `@tailwindcss/vite`. Estilos globais e classes compartilhadas, como `button` e `heading-1`, ficam em [`src/styles/global.css`](src/styles/global.css); a formatação dos posts fica em [`src/styles/post.css`](src/styles/post.css).

As fontes usam a API nativa do Astro com `fontProviders.google()`. Os arquivos são obtidos durante a preparação do site, armazenados em cache e servidos pela própria hospedagem.

| Fonte                 | Uso             | Pesos     | Variável CSS            |
| --------------------- | --------------- | --------- | ----------------------- |
| Atkinson Hyperlegible | Texto e títulos | 400 e 700 | `--font-atkinson`       |
| JetBrains Mono        | Código          | 400 e 700 | `--font-jetbrains-mono` |

[`Layout.astro`](src/layouts/Layout.astro) inclui os componentes `<Font />` de `astro:assets`, com preload apenas da Atkinson. O bloco `@theme inline` do CSS associa as variáveis a `font-sans` e `font-mono`.

Para trocar uma fonte, ajuste sua família e pesos no config. Se renomear a variável, atualize também o `<Font />` e o CSS. A primeira execução sem cache precisa acessar o provedor.

### Ícones: astro-icon e Iconify

O `astro-icon` usa a coleção `@iconify-json/lucide` e renderiza SVG diretamente no HTML:

```astro
---
import { Icon } from "astro-icon/components";
---

<a class="button button-primary gap-2" href="/blog/">
  <Icon name="lucide:book-open" size={20} aria-hidden="true" />
  Ver posts
</a>
```

Para adicionar outra coleção, instale o pacote correspondente e use seu prefixo, sem outro registro no config:

```bash
npm install -D @iconify-json/simple-icons
```

```astro
<Icon name="simple-icons:github" size={20} aria-hidden="true" />
```

Algumas coleções disponíveis no Iconify:

| Coleção               | Pacote                       | Prefixo         | Uso comum                                              |
| --------------------- | ---------------------------- | --------------- | ------------------------------------------------------ |
| Lucide                | `@iconify-json/lucide`       | `lucide:`       | Ícones de interface em traço; já incluída no template. |
| Simple Icons          | `@iconify-json/simple-icons` | `simple-icons:` | Logos de marcas e serviços.                            |
| Phosphor              | `@iconify-json/ph`           | `ph:`           | Ícones de interface com diferentes pesos e estilos.    |
| Material Design Icons | `@iconify-json/mdi`          | `mdi:`          | Catálogo amplo de símbolos e ações.                    |
| Hugeicons             | `@iconify-json/hugeicons`    | `hugeicons:`    | Ícones de interface em traço.                          |

As coleções adicionais são apenas exemplos; instale somente as que precisar.

SVGs próprios podem ser colocados em `src/assets/icons/`, caminho definido em `iconDir`: `logo.svg` fica disponível como `<Icon name="logo" />`. Use `aria-hidden="true"` em ícones decorativos; ações sem texto visível precisam de um nome acessível, como `aria-label`.

### SEO: astro-seo-kit

[`Head.astro`](src/components/seo/Head.astro) adapta o `astro-seo-kit` aos padrões do site. O `Layout` encaminha as props e permite definir os metadados por página:

```astro
---
import Layout from "@/layouts/Layout.astro";
---

<Layout title="Sobre" description="Conheça nossa história e nosso trabalho.">
  <h1>Sobre</h1>
</Layout>
```

| Prop                   | Comportamento                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `title`                | Acrescenta o nome do site ao título da página. Se omitida, usa `SITE_TITLE`.       |
| `description`          | Usa `SITE_DESCRIPTION` quando omitida.                                             |
| `image`                | Aceita caminho em texto ou imagem importada; usa `SITE_IMAGE` quando omitida.      |
| `imageAlt`             | Descrição da imagem; usa o título como alternativa.                                |
| `canonicalURL`         | Usa o caminho atual por padrão; `false` omite o canonical.                         |
| `noindex` e `nofollow` | Independentes, ambos `false` por padrão.                                           |
| `openGraphType`        | Aceita `website` ou `article`; a biblioteca infere o tipo quando recebe `article`. |
| `article`              | Datas, autor e tags; também habilita o JSON-LD `BlogPosting`.                      |
| `jsonLd`               | Dados estruturados adicionais.                                                     |

O adapter gera descrição, canonical, Open Graph e cartão do Twitter/X. A página de post já fornece seus metadados de artigo.

### Sitemap, RSS e arquivos para agentes

| Recurso             | Implementação                                           | Saída                                                      |
| ------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| Sitemap             | `@astrojs/sitemap`                                      | `/sitemap-index.xml` e mapas referenciados.                |
| RSS                 | `@astrojs/rss`, em [`rss.xml.js`](src/pages/rss.xml.js) | `/rss.xml`, com resumos e datas dos posts publicados.      |
| Índice para agentes | `astro-llms-md`                                         | `/llms.txt`, `/llms-full.txt` e versões `.md` das páginas. |

O `llms.txt` agrupa os links pelo primeiro segmento da URL e aponta para os arquivos Markdown. Os títulos vêm dos headings, com fallback para `<title>`; as descrições vêm de `meta[name="description"]`. O conteúdo de `<main>` é convertido com a limpeza padrão da biblioteca. Use `data-llms-ignore` para omitir trechos específicos.

Sitemap e arquivos para agentes são gerados no build; confira-os com `npm run build` seguido de `npm run preview`. Um hook adiciona BOM UTF-8 aos dois arquivos `llms*.txt`, preservando os acentos quando o servidor não informa o charset.

> [!NOTE]
> O admin fica fora do sitemap e dos arquivos para agentes. Para excluir outras páginas, ajuste separadamente o filtro de `sitemap()` e a opção `exclude` de `llms()`. A prop `noindex` não altera essas listas automaticamente.

## Estrutura do projeto

```text
src/
├── assets/
│   ├── images/
│   │   ├── blog/      # Capas enviadas pelo CMS
│   │   └── post-placeholder.png
│   └── icons/         # SVGs próprios para astro-icon
├── components/        # Componentes de layout, blog e SEO
├── content/blog/      # Posts
├── layouts/           # Estrutura compartilhada das páginas
├── pages/             # Home, admin, blog, privacidade e RSS
├── styles/            # Tailwind e estilos dos posts
├── utils/             # Consulta e organização do conteúdo
├── consts.ts          # Identidade e metadados padrão
└── content.config.ts  # Schema das coleções
public/
├── admin/config.yml   # Configuração do CMS
├── favicon.png
└── og-image.png
```

## Deploy

O build produz arquivos estáticos em `dist/`, que podem ser servidos por uma hospedagem estática.

O workflow [`ci-cd-static-pipeline.yml`](.github/workflows/ci-cd-static-pipeline.yml) executa em pushes para `main` ou manualmente pelo GitHub Actions. Ele instala as dependências, executa scripts opcionais de lint e teste, gera o build e envia os arquivos por SSH/SCP.

Configure os seguintes **repository secrets** no GitHub:

| Secret           | Valor                                                                |
| ---------------- | -------------------------------------------------------------------- |
| `SERVER_HOST`    | Endereço do servidor.                                                |
| `SERVER_USER`    | Usuário com acesso SSH e permissão para publicar.                    |
| `SERVER_SSH_KEY` | Chave privada correspondente à chave pública autorizada no servidor. |

O workflow atual procura uma aplicação em `~/*.configr.cloud/www` e usa o primeiro destino encontrado. Para outra hospedagem ou para selecionar um destino específico, adapte a etapa **Resolve target directory on server** antes de habilitar o deploy. Ele também permite carregar variáveis de build de um arquivo `~/.env` no servidor.

Antes de publicar, execute localmente:

```bash
npm run check
npm run build
npm run preview
```

Confirme o domínio, o repositório e a branch do CMS, as imagens padrão e o conteúdo da política de privacidade.
