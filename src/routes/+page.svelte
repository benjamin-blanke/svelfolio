<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';

	import Metadata from '$lib/components/metadata.svelte';

	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);

	onMount(() => {
		const BASE_URL = 'https://support.opus-host.de';
		const WEBSITE_TOKEN = 'a1FYtGF2EudL92oFAe7FjPDP';

		const script = document.createElement('script');
		script.src = `${BASE_URL}/packs/js/sdk.js`;
		script.async = true;

		script.onload = () => {
			// @ts-ignore
			window.chatwootSDK.run({
				websiteToken: WEBSITE_TOKEN,
				baseUrl: BASE_URL
			});
		};

		document.head.appendChild(script);

		return () => {
			script.remove();
		};
	});

	const TEXT = 'BENJAMIN';

	const FONT_MAP = {
		Slant: () => import('figlet/importable-fonts/Slant.js').then((m) => m.default),
		Ogre: () => import('figlet/importable-fonts/Ogre.js').then((m) => m.default),
		'ANSI Shadow': () => import('figlet/importable-fonts/ANSI Shadow.js').then((m) => m.default),
		Bloody: () => import('figlet/importable-fonts/Bloody.js').then((m) => m.default),
		Ghost: () => import('figlet/importable-fonts/Ghost.js').then((m) => m.default),
		Isometric1: () => import('figlet/importable-fonts/Isometric1.js').then((m) => m.default),
		'3D-ASCII': () => import('figlet/importable-fonts/3D-ASCII.js').then((m) => m.default),
		Banner: () => import('figlet/importable-fonts/Banner.js').then((m) => m.default),
		Avatar: () => import('figlet/importable-fonts/Avatar.js').then((m) => m.default),
		Doom: () => import('figlet/importable-fonts/Doom.js').then((m) => m.default),
		'Larry 3D': () => import('figlet/importable-fonts/Larry 3D.js').then((m) => m.default),
		'Slant Relief': () => import('figlet/importable-fonts/Slant Relief.js').then((m) => m.default),
		'ANSI Regular': () => import('figlet/importable-fonts/ANSI Regular.js').then((m) => m.default),
		Block: () => import('figlet/importable-fonts/Block.js').then((m) => m.default),
		Colossal: () => import('figlet/importable-fonts/Colossal.js').then((m) => m.default),
		Epic: () => import('figlet/importable-fonts/Epic.js').then((m) => m.default),
		Rectangles: () => import('figlet/importable-fonts/Rectangles.js').then((m) => m.default),
		Poison: () => import('figlet/importable-fonts/Poison.js').then((m) => m.default),
		Lean: () => import('figlet/importable-fonts/Lean.js').then((m) => m.default),
		Script: () => import('figlet/importable-fonts/Script.js').then((m) => m.default),
		'3D Diagonal': () => import('figlet/importable-fonts/3D Diagonal.js').then((m) => m.default),
		Banner3: () => import('figlet/importable-fonts/Banner3.js').then((m) => m.default),
		'Banner3-D': () => import('figlet/importable-fonts/Banner3-D.js').then((m) => m.default),
		Isometric2: () => import('figlet/importable-fonts/Isometric2.js').then((m) => m.default),
		Isometric3: () => import('figlet/importable-fonts/Isometric3.js').then((m) => m.default),
		Univers: () => import('figlet/importable-fonts/Univers.js').then((m) => m.default),
		Acrobatic: () => import('figlet/importable-fonts/Acrobatic.js').then((m) => m.default),
		Graceful: () => import('figlet/importable-fonts/Graceful.js').then((m) => m.default),
		Crawford: () => import('figlet/importable-fonts/Crawford.js').then((m) => m.default),
		Alpha: () => import('figlet/importable-fonts/Alpha.js').then((m) => m.default),
		Wavy: () => import('figlet/importable-fonts/Wavy.js').then((m) => m.default),
		'Small Isometric1': () => import('figlet/importable-fonts/Small Isometric1.js').then((m) => m.default),
		Rozzo: () => import('figlet/importable-fonts/Rozzo.js').then((m) => m.default),
		Nancyj: () => import('figlet/importable-fonts/Nancyj.js').then((m) => m.default)
	} as const;
	const FONTS = Object.keys(FONT_MAP) as (keyof typeof FONT_MAP)[];
	const fontLoaders = FONT_MAP;

	const INITIAL = `
██████╗ ███████╗███╗   ██╗     ██╗ █████╗ ███╗   ███╗██╗███╗   ██╗
██╔══██╗██╔════╝████╗  ██║     ██║██╔══██╗████╗ ████║██║████╗  ██║
██████╔╝█████╗  ██╔██╗ ██║     ██║███████║██╔████╔██║██║██╔██╗ ██║
██╔══██╗██╔══╝  ██║╚██╗██║██   ██║██╔══██║██║╚██╔╝██║██║██║╚██╗██║
██████╔╝███████╗██║ ╚████║╚█████╔╝██║  ██║██║ ╚═╝ ██║██║██║ ╚████║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝`;

	let currentFont = $state<keyof typeof FONT_MAP>('ANSI Shadow');
	let art = $state(INITIAL.trimEnd());
	let loading = $state(false);

	let sectionEl = $state<HTMLElement | null>(null);
	let codeEl = $state<HTMLElement | null>(null);

	let figletInstance: typeof import('figlet').default | null = null;
	const parsedFonts = new Set<string>();

	async function getFiglet() {
		if (figletInstance) return figletInstance;
		const mod = await import('figlet');
		figletInstance = (mod.default ?? mod) as typeof import('figlet').default;
		return figletInstance;
	}

	async function ensureFont(figlet: typeof import('figlet').default, name: keyof typeof FONT_MAP) {
		if (parsedFonts.has(name)) return;
		const loader = fontLoaders[name];
		if (!loader) return;
		const fontData = await loader();
		figlet.parseFont(name, fontData);
		parsedFonts.add(name);
	}

	async function shuffle() {
		trigger();
		if (loading) return;
		loading = true;
		try {
			const pool = FONTS.filter((f) => f !== currentFont);
			const next = pool[Math.floor(Math.random() * pool.length)];
			const figlet = await getFiglet();
			await ensureFont(figlet, next);
			const generated = figlet.textSync(TEXT, { font: next as never });
			art = generated;
			currentFont = next;
		} catch {
			// keep previous art on error
		} finally {
			loading = false;
		}
	}

	function fit() {
		if (!codeEl || !sectionEl) return;
		// reset to CSS clamp then scale to target 60% width (sweet spot, not full bleed)
		codeEl.style.fontSize = '';
		const available = sectionEl.clientWidth - 16; // 1rem gutter
		const needed = codeEl.scrollWidth;
		if (needed === 0 || available <= 0) return;
		const scale = available / needed;
		if (Math.abs(scale - 1) < 0.02) return;
		const computed = parseFloat(getComputedStyle(codeEl).fontSize);
		if (isNaN(computed)) return;
		const isSmall = scale > 1;
		// small fonts fill 60-65%, large fonts fill ~92% to avoid huge
		const target = isSmall ? 0.62 : 0.92;
		const cappedScale = isSmall ? Math.min(scale, 2.2) : scale;
		const next = computed * cappedScale * target;
		const max = isSmall ? 14 : 20;
		const clamped = Math.max(6, Math.min(next, max));
		codeEl.style.fontSize = `${clamped}px`;
	}

	$effect(() => {
		// re-run on art / element mount and window resize
		art;
		codeEl;
		sectionEl;
		if (!codeEl || !sectionEl) return;
		fit();
		const ro = new ResizeObserver(() => fit());
		ro.observe(sectionEl);
		ro.observe(codeEl);
		const onResize = () => fit();
		window.addEventListener('resize', onResize);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<Metadata
	title="Benjamin"
	description="Benjamin Blanke — Student and founder of Opus Host, building self-hosted infrastructure, Discord bots, and community tools around Proxmox, Minecraft server hosting, and homelab systems."
/>

<section
	bind:this={sectionEl}
	class="@container flex grow flex-col items-center justify-center space-y-2.5 overflow-hidden px-2 md:space-y-5"
>
	{#key art}
		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
		<code
			bind:this={codeEl}
			role="button"
			tabindex="0"
			title="Click to shuffle — {currentFont}"
			aria-label="Shuffle ASCII art, current font {currentFont}"
			aria-busy={loading}
			onclick={shuffle}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					shuffle();
				}
			}}
			class="block max-w-dvw cursor-pointer touch-manipulation overflow-hidden text-[clamp(0.32rem,1.05vw,0.85rem)] leading-[1.09] tracking-[-0.04em] whitespace-pre transition-opacity select-none hover:opacity-80 lg:text-[clamp(0.35rem,0.95cqi,0.9rem)] {loading
				? 'pointer-events-none opacity-50'
				: ''}"
		>
			{art}
		</code>
	{/key}

	<p class="sr-only">Benjamin Blanke</p>

	<div class="text-center">
		<p>Lahr, Germany. Building self-hosted infrastructure & Discord tools at Opus Host.</p>
	</div>

	<div class="mt-1 flex items-center justify-center gap-4 text-neutral-400">
		<!-- Cal.com -->
		<a
			href="https://cal.com/benjaminoliverblanke"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Book a call"
			title="Book a call"
			class="text-neutral-400 transition-colors hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="4" width="18" height="17" rx="3" />
				<path d="M16 2v4M8 2v4M3 10h18" />
			</svg>
		</a>

		<!-- Discord -->
		<a
			href="https://discord.gg/opushost"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Discord"
			title="Discord"
			class="text-neutral-400 transition-colors hover:text-white"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19.54 5.42A16.9 16.9 0 0 0 15.9 4.3l-.46.94a15.6 15.6 0 0 0-6.88 0L8.1 4.3a16.9 16.9 0 0 0-3.64 1.12C2.16 8.74 1.54 12 1.85 15.2a16.9 16.9 0 0 0 4.46 2.25l1.08-1.47c-.59-.22-1.16-.5-1.7-.82l.42-.32c3.28 1.53 7.23 1.53 10.47 0l.42.32c-.54.32-1.11.6-1.7.82l1.08 1.47a16.9 16.9 0 0 0 4.46-2.25c.36-3.72-.62-6.95-1.9-9.78ZM8.9 14.25c-1 0-1.82-.92-1.82-2.05s.8-2.06 1.82-2.06 1.83.93 1.82 2.06c0 1.13-.8 2.05-1.82 2.05Zm6.2 0c-1 0-1.82-.92-1.82-2.05s.8-2.06 1.82-2.06 1.83.93 1.82 2.06c0 1.13-.8 2.05-1.82 2.05Z"
				/>
			</svg>
		</a>
	</div>
</section>
