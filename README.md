# Svelfolio — A Modern Svelte Portfolio Template

Svelfolio is a polished, production-ready portfolio template built with SvelteKit and TypeScript. It is intended as a fast, accessible, and developer-friendly starter for personal sites, project showcases, and lightweight microsites. The project balances opinionated defaults with easy customization so you can quickly fork, brand, and deploy a professional portfolio.

Live demo: https://blanke.lol

---

Table of contents
- [Why Svelfolio](#why-svelfolio)
- [Highlights & Features](#highlights--features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & install](#clone--install)
  - [Local development](#local-development)
  - [Build & preview](#build--preview)
- [Configuration & environment](#configuration--environment)
- [Content model](#content-model)
  - [Projects / Showcase](#projects--showcase)
  - [Abouts / Pages](#abouts--pages)
  - [Guest book & server features](#guest-book--server-features)
- [Styling & Theming](#styling--theming)
- [Components & Patterns](#components--patterns)
- [Accessibility & Performance](#accessibility--performance)
- [SEO & Social previews](#seo--social-previews)
- [Database & authentication (optional)](#database--authentication-optional)
- [Deployment guides](#deployment-guides)
- [CI / CD example](#ci--cd-example)
- [Troubleshooting & tips](#troubleshooting--tips)
- [Contributing](#contributing)
- [License & credits](#license--credits)

---

## Why Svelfolio

Svelfolio is designed for developers who want a clean, production-capable portfolio without starting from scratch. It provides:

- A minimal, accessible UI with a focus on performance.
- A flexible content model (Markdown + server loaders) for projects and pages.
- Optional server-side features (guest-book, OAuth, Postgres via Drizzle) for folks who want dynamic behavior.
- A ready-to-deploy setup (Vercel-friendly, adapter-agnostic) and CI examples.

This template is intentionally opinionated about accessibility and best practices so your finished site follows good defaults out-of-the-box.

---

## Highlights & Features

- SvelteKit + Svelte 5 components and TypeScript-first code.
- Content driven by Markdown (mdsvex) in `src/contents` and server loaders that turn content into pages.
- Project showcase with tags and filters, and detail pages per project.
- Small, focused UI components (Header, Nav, ProjectCard, Modal, etc.).
- Optional guest-book backed by Postgres + Drizzle ORM and simple OAuth for administrative flows.
- Pre-configured build and dev scripts and examples for Vercel/Netlify/GitHub Pages.
- Starter GitHub Actions workflow and lint/format scripts.

---

## Tech stack

- Primary language: Svelte (Svelte 5) + TypeScript
- Framework/runtime: SvelteKit
- Notable libraries:
  - mdsvex (Markdown + Svelte integration)
  - drizzle-orm & drizzle-kit (DB schema + migrations)
  - @sveltejs/adapter-vercel (deployment-ready)
  - figlet (ASCII art demo on the homepage)
  - web-haptics (optional haptics integration)

---

## Project structure

```
/.github/                 # CI/config snippets
.env.example              # example environment variables
package.json              # scripts & dependencies
pnpm-workspace.yaml       # workspace config
svelte.config.js          # SvelteKit config
tsconfig.json             # TypeScript config
src/
  app.*                   # global app entry (html, css, types)
  contents/               # Markdown content: projects, abouts
  lib/                    # components, assets, server helpers, schema
    assets/               # project images and static assets (also in static/)
    components/           # small Svelte components & layout
    server/               # Drizzle DB helpers, oauth, server logic
  routes/                 # SvelteKit routes (home, projects, abouts, guest-book, api)
static/                   # static files: favicon, opengraph, preview images
```

How it fits together: Markdown content in `src/contents` is processed by server loaders (`+page.server.ts` / `+layout.server.ts`) and exposed to routes under `src/routes`. Small components in `src/lib/components` render lists, cards, metadata, and layout. Optional server features use `src/lib/server` alongside a Postgres DB (DATABASE_URL) and Drizzle ORM for persistence.

---

## Getting started

### Prerequisites

- Node.js 18 or newer (LTS recommended)
- pnpm (recommended) or npm/yarn
- Git
- (Optional) Postgres for guest-book / DB features

### Clone & install

```bash
git clone https://github.com/benjamin-blanke/svelfolio.git
cd svelfolio
pnpm install
```

If you prefer npm:

```bash
npm install
```

### Local development

Set up local environment variables by copying `.env.example` to `.env` and filling in values where needed (DATABASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, BASE_URL).

Run the dev server:

```bash
pnpm dev -- --open
# or
npm run dev -- --open
```

This starts Vite / SvelteKit in dev mode and opens your browser.

### Build & preview

Create a production build and preview it locally:

```bash
pnpm build
pnpm preview
# or
npm run build && npm run preview
```

---

## Configuration & environment

Essential configuration locations:

- `src/lib/index.ts` and `src/lib/identity.ts` — places where site metadata and identity are defined.
- `static/` — static assets like `opengraph-image.png`, favicon, and preview images.

Important environment variables (add to `.env` locally or to your CI provider):

- DATABASE_URL — Postgres connection string (required for DB-backed features)
- GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET — GitHub OAuth (optional)
- BASE_URL or PUBLIC_SITE_URL — canonical site URL (used in sitemaps, OG tags)
- NODE_ENV — `development` or `production`

For local development you can leave OAuth variables blank and the site will still work; DB-backed routes (guest-book) will need a running Postgres instance.

---

## Content model

### Projects / Showcase

Projects live in `src/contents/projects/*.md` and include frontmatter with fields like `title`, `description`, `date`, `tags`, `cover`, `repo`, and `live`. The server loaders read these files and provide a list and individual pages.

Frontmatter example:

```md
---
title: "My Project"
description: "Short summary of the project"
date: 2024-07-01
tags: ["svelte", "design"]
cover: "/images/projects/my-project-cover.jpg"
repo: "https://github.com/username/my-project"
live: "https://project.example.com"
---
Project long description using markdown...
```

### Abouts / Pages

Short pages like About / Gear are kept in `src/contents/abouts/*.md` and routed under `/abouts`. They can contain standard markdown; MDsveX allows embedding Svelte components if enabled.

### Guest book & server features

A simple guest-book implementation exists under `src/routes/guest-book` and demonstrates how to store guest entries in Postgres using Drizzle. Look at `src/lib/server/db/schema.ts` and the Drizzle config file for the DB schema and migration setup.

---

## Styling & Theming

The template ships with utility-first or vanilla CSS depending on the configuration found in the repo. You can:

- Swap colors in a central theme file or CSS variables.
- Update `tailwind.config.cjs` if Tailwind is used.
- Replace fonts by editing the global CSS or using fontsource packages already included.

Customizing the layout usually involves editing `src/routes/+layout.svelte` and the components in `src/lib/components/layout`.

---

## Components & Patterns

Components are intentionally small and composable. Key components to look at:

- `src/lib/components/layout/header/header.svelte` — responsive header and nav
- `src/lib/components/layout/navbar/navbar.svelte` — mobile menu & focus handling
- `src/lib/components/metadata.svelte` — page meta tags and OG integration
- `src/lib/components/icon.svelte` — centralized icon loader
- `src/lib/assets/projects/*.webp` — example project images

Patterns used:
- Server loaders (`+page.server.ts` / `+layout.server.ts`) to gather content and pass to routes
- Frontmatter-based markdown parsing for content
- Small single-responsibility components rendered in pages

---

## Accessibility & Performance

Accessibility considerations built in:

- Skip links and semantic HTML
- Keyboard-accessible navigation and interactive elements
- ARIA attributes where appropriate and focus management for modals

Performance guidance included:

- Use optimized images (AVIF/WebP) placed in `static/` and `src/lib/assets`
- Lazy-load heavy assets and defer non-critical scripts
- Keep bundles small by leveraging Svelte's compile-time optimizations

---

## SEO & Social previews

The project includes a metadata component and static Open Graph image (`static/opengraph-image.png`). Set `BASE_URL` / `PUBLIC_SITE_URL` and update site metadata (title, description, social handles) so canonical tags and sitemaps are correct.

`src/routes/sitemap.xml/+server.ts` and `src/routes/robots.txt/+server.ts` provide examples for sitemap and robots endpoint generation.

---

## Database & authentication (optional)

If you enable dynamic features like the guest-book or an authenticated admin UI, the project uses Drizzle ORM with Postgres.

- Schema: `src/lib/server/db/schema.ts`
- Migrations & CLI: `drizzle-kit` commands are wired in `package.json` (`db:push`, `db:migrate`, `db:studio`).

Typical local workflow:

1. Start Postgres (Docker recommended):

```bash
docker run --rm -e POSTGRES_PASSWORD=example -e POSTGRES_USER=example -e POSTGRES_DB=svelfolio -p 5432:5432 postgres:15
```

2. Set `DATABASE_URL=postgres://example:example@localhost:5432/svelfolio` in your `.env`.
3. Run database migrations:

```bash
pnpm db:migrate
# or
npm run db:migrate
```

If you only want a static site, ignore DB variables and static pages will continue to work.

---

## Deployment guides

### Vercel (recommended)

1. Import the repository into Vercel.
2. Set environment variables in the Vercel dashboard (DATABASE_URL, GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET, BASE_URL).
3. Set build command: `pnpm build` (or `npm run build`).

Vercel handles serverless functions and preview deployments well for SvelteKit apps.

### Netlify

1. Link repo in Netlify and set environment variables.
2. Build command: `pnpm build`.
3. If using a static site adapter, ensure the publish directory matches the adapter output.

### GitHub Pages (static)

If you use `@sveltejs/adapter-static`, build into the `build` or `docs` folder and configure GitHub Pages to serve that folder.

---

## CI / CD example

A simple GitHub Actions workflow lives in `.github/workflows/` (when present) — here's a minimal build check to include in your repo:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
```

Extend this workflow with linting, tests, and deployment steps for your target provider.

---

## Troubleshooting & tips

- Build fails: confirm Node version and check `svelte.config.js` adapter settings.
- Missing images: ensure images are in `static/` or referenced by the correct path in `src/lib/assets`.
- Guest-book errors: verify `DATABASE_URL` and run migrations.
- OAuth issues: check `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` and OAuth callback URL (match BASE_URL).

---

## Contributing

Contributions are welcome. A suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-change`
3. Make changes and test locally
4. Open a pull request describing your change

Please follow these guidelines:

- Keep PRs focused and small
- Run formatters & linters before opening PRs
- Add tests for behavior where appropriate

Consider adding `CONTRIBUTING.md` and a `CODE_OF_CONDUCT.md` in `.github/` as the project grows.

---

## License & credits

Svelfolio is open source and released under the MIT License. See `LICENSE` for details.

Credits:
- Built with Svelte & SvelteKit
- Utility libraries and components credited in source files

---

## Appendix: Useful commands

- Dev server: `pnpm dev -- --open` or `npm run dev` 
- Build: `pnpm build` or `npm run build`
- Preview: `pnpm preview` or `npm run preview`
- Format: `pnpm format` or `npm run format`
- Lint: `pnpm lint` or `npm run lint`
- DB migrate: `pnpm db:migrate` or `npm run db:migrate`

---

Thank you for using Svelfolio! If you'd like, I can also:
- Add this README to the repository (I will commit it for you),
- Create a GitHub Release for v1.0.0 with release notes, or
- Generate a compact README or translate this into German.

Happy building — let me know which action you want me to take next.
