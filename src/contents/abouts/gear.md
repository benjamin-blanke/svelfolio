const hardware = {
	computers: [
		{
			name: 'Lenovo Laptop',
			desc: 'The daily driver — unassuming on paper, but it survives every homelab experiment and the occasional malware scare.',
			tags: ['Laptop']
		},
		{
			name: 'Proxmox Homelab Server',
			desc: 'The real workhorse. Runs my entire self-hosted stack — Minecraft servers, Jellyfin, Gitea, Authentik, and whatever I break next. IPv6-only, courtesy of my provider Aaron.',
			tags: ['Homelab', 'Proxmox']
		},
		{
			name: 'Logitech MX Keys Mini',
			desc: 'Compact 65% keyboard — keeps the desk minimal while I SSH into six terminals at once.',
			tags: ['Keyboard']
		},
		{
			name: 'Logitech MX Master 3S',
			desc: 'The all-rounder mouse for everything except gaming. Mostly used for dragging Proxmox VM windows around at 2am.',
			tags: ['Mouse']
		}
	],
	monitors: [
		{
			name: 'BenQ Monitor',
			desc: 'The command center — 34" 1440p 144Hz curved, permanently split between a terminal, Discord, and a Grafana dashboard I probably shouldn\'t be staring at this closely.',
			tags: ['Monitor']
		}
	],
	audio: [
		{
			name: 'AirPods Pro 3',
			desc: 'Everyday buds for music, calls, and blocking out the sound of fans spinning up on the homelab.',
			tags: ['Earbuds']
		},
		{
			name: 'Steelseries Arctis 7',
			desc: 'Wireless headset for the long deploy-and-debug sessions. No cable tangles, great chat mix.',
			tags: ['Headphone']
		}
	]
};

const software = [
	{
		name: 'Neovim',
		desc: 'My Swiss Army knife for everything text-related — from writing Discord bots to editing systemd unit files at 1am.',
		tags: ['Editor']
	},
	{
		name: 'Tmux',
		desc: 'Terminal multitasking wizardry — because tabs are too mainstream, and juggling three SSH sessions to Proxmox needs proper panes.',
		tags: ['Terminal']
	},
	{
		name: 'Ghostty',
		desc: 'A lightning-fast, GPU-accelerated terminal emulator. Looks great next to a wall of Docker logs.',
		tags: ['Terminal']
	},
	{
		name: 'Oh My Zsh',
		desc: 'My shell of choice, spiced up with Powerlevel10k — because even `pnpm install` should look good.',
		tags: ['Terminal']
	},
	{
		name: 'discord.js / discord.py',
		desc: 'The toolkit behind every bot I ship — from full-blown economy systems to ticket automation and roleplay status boards.',
		tags: ['Development']
	},
	{
		name: 'Crafty Controller',
		desc: 'Runs and manages my Paper Minecraft servers on the homelab without babysitting a raw terminal all day.',
		tags: ['Server Management']
	}
];

const hosting = [
	{
		name: 'Vercel',
		desc: "Deploys so fast, it's practically magic. Git push, and voilà — the site is live.",
		tags: ['Hosting']
	},
	{
		name: 'Coolify',
		desc: 'The brain of my homeserver — a self-hosted PaaS that makes deploying side projects from Proxmox feel like Vercel, but on my own hardware.',
		tags: ['Hosting', 'Self-Hosted']
	},
	{
		name: 'Proxmox VE',
		desc: 'Where every VM and LXC lives — Jellyfin, Kali, Minecraft servers, and whatever container I\'m currently breaking.',
		tags: ['Virtualization']
	},
	{
		name: 'Cloudflare',
		desc: 'DNS, tunnels, and just enough protection to keep opus-host.de and friends online and fast.',
		tags: ['DNS', 'Networking']
	},
	{
		name: 'Tailscale',
		desc: 'The mesh VPN gluing my homelab together — private access to Jellyfin, CryptPad, and internal tools without exposing them to the world.',
		tags: ['Networking']
	},
	{
		name: 'Hetzner VPS',
		desc: 'Runs the public-facing side of the self-hosted stack — Nginx Proxy Manager, Portainer, Gitea, Vaultwarden, Authentik.',
		tags: ['VPS']
	}
];
