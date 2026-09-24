# Benjamin — Portfolio

Personal portfolio of **Benjamin Blanke**, built with SvelteKit and deployed on Vercel.

**Live:** https://blanke.lol

## Features

- Minimal terminal-inspired responsive interface
- Projects powered by Markdown
- GitHub repository metadata and latest push activity
- Discord / Spotify listening activity through Lanyard
- Guest book with GitHub OAuth, replies and reactions
- Command palette with `⌘K` / `Ctrl+K`
- Umami analytics
- Interactive FIGlet homepage
- `?sudo` easter egg

## Stack

- Svelte 5 / SvelteKit
- TypeScript
- Tailwind CSS
- PostgreSQL + Drizzle ORM
- GitHub API / OAuth
- Umami
- Vercel

## Development

```bash
git clone https://github.com/benjamin-blanke/svelfolio.git
cd svelfolio
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
pnpm preview
```

## Environment variables

Keep private values server-side and never expose them through `PUBLIC_*` variables.

```env
BASE_URL=https://blanke.lol

DATABASE_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_TOKEN=

PUBLIC_DISCORD_USER_ID=
```

`PUBLIC_DISCORD_USER_ID` is used by Lanyard to show current listening activity.

## Listening activity

The homepage uses Lanyard with `PUBLIC_DISCORD_USER_ID` to display Spotify or other Discord listening activity. No Spotify developer credentials are required.

## Guest book

The guest book uses PostgreSQL through Drizzle and GitHub OAuth. Configure `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `BASE_URL` before using it.

Database commands:

```bash
pnpm db:push
pnpm db:migrate
pnpm db:studio
```

## Project content

Projects are stored in:

```text
src/contents/projects/*.md
```

About pages are stored in:

```text
src/contents/abouts/*.md
```

## Deployment

The production site is deployed through Vercel from the `main` branch. Configure all required environment variables in the Vercel project before deploying.

## Privacy & security

- OAuth and API secrets stay in private server environment variables.
- Analytics are handled by the self-hosted Umami instance.
- Do not commit `.env` files or credentials.

## License

MIT
