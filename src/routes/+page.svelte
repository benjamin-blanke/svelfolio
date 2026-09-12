<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';
	import Metadata from '$lib/components/metadata.svelte';
	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);
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

	<div class="mt-2 flex items-center justify-center gap-5 text-neutral-400">
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
				width="20"
				height="20"
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
					d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
				/>
			</svg>
		</a>

		<!-- Instagram -->
		<a
			href="https://www.instagram.com/benjaminoliverblanke/"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Instagram"
			title="Instagram"
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
					d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM17.5 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
				/>
			</svg>
		</a>
	</div>
</section>