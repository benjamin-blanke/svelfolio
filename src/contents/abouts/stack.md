---
title: 'stack.ts'
description: 'The technologies, infrastructure, and tools I use to build and operate projects.'
---

```ts
const STACK = {
	languages: ['TypeScript', 'JavaScript', 'SQL'],
	frontend: ['Svelte', 'SvelteKit', 'Next.js', 'Tailwind CSS'],
	backend: ['Node.js', 'discord.js', 'discord.py'],
	databases: ['PostgreSQL', 'SQLite'],
	infrastructure: [
		'Proxmox VE',
		'Docker',
		'Nginx Proxy Manager',
		'Tailscale',
		'Cloudflare'
	],
	tools: [
		'Neovim',
		'Tmux',
		'Ghostty',
		'Portainer',
		'Gitea',
		'Authentik',
		'n8n',
		'Crafty Controller'
	],
	hosting: ['Vercel', 'Coolify', 'Hetzner VPS']
};
```

My stack is built around practical tools that make it easy to ship, host, and maintain projects. TypeScript and JavaScript are my main languages, with SvelteKit and Node.js covering most of my web development work.

For infrastructure, I rely heavily on Proxmox, Docker, Cloudflare, Tailscale, and a small collection of self-hosted services. This setup lets me run everything from development tools and dashboards to Minecraft servers and community applications.

I prefer tools that are composable, transparent, and easy to operate. When a managed service is the right choice, I use it. When it is more interesting or useful to run something myself, it usually ends up in the homelab.
