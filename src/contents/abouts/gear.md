---
title: 'gear.ts'
description: 'Explore my (not so powerful) hardware and software setup.'
---

```ts
const hardware = {
	computers: [
		{
			name: 'Random Lenovo Laptop',
			desc: 'Just some Random Laptop :)',
			tags: ['Laptop']
		},
		{
			name: 'Logitech MX Keys Mini',
			desc: 'My classy compact 65% keyboard – perfect for keeping things stylish and minimal.',
			tags: ['Keyboard']
		},
		{
			name: 'Logitech MX Master 3S',
			desc: 'The all-rounder mouse I use for everything... except pwning noobs in games. 😅',
			tags: ['Mouse']
		}
	],
	monitors: [
		{
			name: 'BENQ Monitor',
			desc: 'The big boss on my desk! A 34" 1440p 144Hz curved beauty that makes everything look amazing.',
			tags: ['Monitor']
		}
	],
	audio: [
		{
			name: 'AirPods Pro 3',
			desc: 'My everyday buds for music, calls, and shutting out noise — insane ANC, buttery Transparency, and that effortless Apple connect.',
			tags: ['Earbuds']
		},
		{
			name: 'Steelseries Arctis 7',
			desc: 'A comfy wireless headset with awesome sound. No more cable tangles, and the chat mix feature is a total game-changer!',
			tags: ['Headphone']
		}
	]
};

const software = [
	{
		name: 'Neovim',
		desc: 'My Swiss Army knife for everything text-related – from coding to taking notes. Neovim is life!',
		tags: ['Editor']
	},
	{
		name: 'Tmux',
		desc: 'Terminal multitasking wizardry – because tabs are too mainstream.',
		tags: ['Terminal']
	},
	{
		name: 'Ghostty',
		desc: 'A lightning-fast terminal emulator that’s as cool as it sounds, with GPU acceleration and all the bells and whistles.',
		tags: ['Terminal']
	},
	{
		name: 'Oh my zsh',
		desc: 'My shell of choice, spiced up with the awesome powerlevel10k theme.',
		tags: ['Terminal']
	}
];

const hosting = [
	{
		name: 'Vercel',
		desc: "Deploys so fast, it's practically magic! Git push, and voilà – my website is live.",
		tags: ['Hosting']
	},
	{
		name: 'Coolify',
		desc: 'The brain of my homeserver, self-hosted PaaS that makes deploying side projects from the homelab feel like Vercel, but on my own hardware.',
		tags: ['Hosting']
	}
];
```
