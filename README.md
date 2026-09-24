# Benjamin — Portfolio

Personal portfolio of **Benjamin Blanke**, built with SvelteKit and deployed on Vercel.

**Live:** https://blanke.lol

## Features

- Minimal terminal-inspired responsive interface
- Projects powered by Markdown
- GitHub repository metadata and latest push activity
- Spotify “currently playing” integration
- Guest book with GitHub OAuth, replies and reactions
- Hire Me contact form with Resend confirmation emails
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
- Spotify Web API
- Resend
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

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

RESEND_API_KEY=
```

`PUBLIC_DISCORD_USER_ID` is no longer required; music activity is fetched directly from Spotify.

## Spotify setup

Create an app in the Spotify Developer Dashboard and configure this exact redirect URI:

```text
https://blanke.lol/api/spotify/callback
```

Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to the Vercel Production environment and deploy. Then open:

```text
https://blanke.lol/api/spotify/login
```

Authorize the Spotify account whose listening activity should appear on the portfolio. The callback displays a refresh token once. Copy it into Vercel as `SPOTIFY_REFRESH_TOKEN`, redeploy, and treat the token like a password.

The portfolio requests only the `user-read-currently-playing` scope. The browser talks to `/api/spotify`; Spotify credentials and refresh tokens stay server-side.

> The login and callback endpoints exist only to bootstrap the refresh token. They can be removed after setup.

## Hire Me

The contact form lives at `/hire`.

Resend sends confirmation mail as:

```text
Benjamin Blanke <business@blanke.lol>
```

Incoming inquiries are delivered to the private inbox configured in the server route. `blanke.lol` must be verified as a sending domain in Resend.

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
- Spotify access tokens are generated server-side.
- The Hire Me form includes server-side validation and a honeypot.
- Analytics are handled by the self-hosted Umami instance.
- Do not commit `.env` files or credentials.

## License

MIT
