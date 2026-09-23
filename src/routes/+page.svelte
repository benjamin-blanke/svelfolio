<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/state';
	import { PUBLIC_DISCORD_USER_ID } from '$env/static/public';
	import { createWebHaptics } from 'web-haptics/svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import { track } from '$lib/analytics';

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
		'Small Isometric1': () =>
			import('figlet/importable-fonts/Small Isometric1.js').then((m) => m.default),
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

	let sudoMode = $derived(page.url.searchParams.has('sudo'));
	let sudoStep = $state(0);
	let sudoTimer: number | undefined;

	let currentFont = $state<keyof typeof FONT_MAP>('ANSI Shadow');
	let art = $state(INITIAL.trimEnd());
	let loading = $state(false);

	/* ─────────────────────────────────────────────
	   Lanyard / Discord Presence
	───────────────────────────────────────────── */

	let listeningTo = $state<string | null>(null);
	let lastPush = $state<{
		repo: string;
		message: string;
		url: string;
		pushedAt: string;
		commitCount: number;
		sha?: string;
	} | null>(null);

	type LanyardResponse = {
		success: boolean;
		data?: {
			listening_to_spotify?: boolean;
			spotify?: {
				song?: string;
			} | null;

			activities?: Array<{
				name?: string;
				type?: number;
				details?: string;
				state?: string;
			}>;
		};
	};
	async function refreshGitHubActivity() {
		try {
			const response = await fetch('/api/github-activity', { cache: 'no-store' });
			if (!response.ok) throw new Error(`GitHub activity returned ${response.status}`);
			const payload = (await response.json()) as {
				repo?: string;
				message?: string;
				url?: string;
				pushedAt?: string;
				commitCount?: number;
				sha?: string;
			};

			if (!payload.repo || !payload.url || !payload.pushedAt) {
				lastPush = null;
				return;
			}

			lastPush = {
				repo: payload.repo,
				message: payload.message ?? 'Updated repository',
				url: payload.url,
				pushedAt: payload.pushedAt,
				commitCount: payload.commitCount ?? 1,
				sha: payload.sha
			};
		} catch {
			lastPush = null;
		}
	}

	function formatRelativeTime(dateString: string) {
		const diff = Date.now() - new Date(dateString).getTime();
		const minutes = Math.floor(diff / 60_000);
		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		const months = Math.floor(days / 30);
		if (months < 12) return `${months}mo ago`;
		return `${Math.floor(months / 12)}y ago`;
	}

	async function refreshListening() {
		if (!PUBLIC_DISCORD_USER_ID) {
			listeningTo = null;
			return;
		}

		try {
			const response = await fetch(
				`https://api.lanyard.rest/v1/users/${PUBLIC_DISCORD_USER_ID}`,
				{
					cache: 'no-store'
				}
			);

			if (!response.ok) {
				throw new Error(`Lanyard returned ${response.status}`);
			}

			const payload = (await response.json()) as LanyardResponse;
			const data = payload.data;

			if (!payload.success || !data) {
				listeningTo = null;
				return;
			}

			/*
			 * Spotify has its own convenient Lanyard object.
			 */
			if (data.listening_to_spotify && data.spotify?.song) {
				listeningTo = data.spotify.song;
				return;
			}

			/*
			 * Discord activity type 2 = Listening.
			 *
			 * This allows the display to also work with other
			 * listening activities Discord exposes.
			 */
			const activity = data.activities?.find(
				(item) => item.type === 2
			);

			listeningTo =
				activity?.details ||
				activity?.state ||
				activity?.name ||
				null;
		} catch {
			/*
			 * Presence is completely optional.
			 * If Lanyard is unreachable, simply hide the element.
			 */
			listeningTo = null;
		}
	}

	onMount(() => {
		if (sudoMode) {
			track('sudo_easter_egg', { route: '/' });
			sudoStep = 1;
			sudoTimer = window.setTimeout(() => (sudoStep = 2), 850);
		}

		/*
		 * Load immediately.
		 */
		void refreshListening();
		void refreshGitHubActivity();

		/*
		 * Refresh every 15 seconds so the currently playing
		 * track updates without reloading the portfolio.
		 */
		const interval = window.setInterval(
			() => void refreshListening(),
			15_000
		);
		const githubInterval = window.setInterval(
			() => void refreshGitHubActivity(),
			60_000
		);

		return () => {
			if (sudoTimer) window.clearTimeout(sudoTimer);
			window.clearInterval(interval);
			window.clearInterval(githubInterval);
		};
	});

	/* ───────────────────────────────────────────── */

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

	async function ensureFont(
		figlet: typeof import('figlet').default,
		name: keyof typeof FONT_MAP
	) {
		if (parsedFonts.has(name)) return;

		const loader = fontLoaders[name];

		if (!loader) return;

		const fontData = await loader();

		figlet.parseFont(name, fontData);

		parsedFonts.add(name);
	}

	async function shuffle() {
		trigger();
		track('ascii_shuffle', { from_font: currentFont });

		if (loading) return;

		loading = true;

		try {
			const pool = FONTS.filter((f) => f !== currentFont);

			const next =
				pool[Math.floor(Math.random() * pool.length)];

			const figlet = await getFiglet();

			await ensureFont(figlet, next);

			const generated = figlet.textSync(TEXT, {
				font: next as never
			});

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

		codeEl.style.fontSize = '';

		const available = sectionEl.clientWidth - 16;
		const needed = codeEl.scrollWidth;

		if (needed === 0 || available <= 0) return;

		const scale = available / needed;

		if (Math.abs(scale - 1) < 0.02) return;

		const computed = parseFloat(
			getComputedStyle(codeEl).fontSize
		);

		if (isNaN(computed)) return;

		const isSmall = scale > 1;

		const target = isSmall ? 0.62 : 0.92;
		const cappedScale = isSmall
			? Math.min(scale, 2.2)
			: scale;

		const next =
			computed * cappedScale * target;

		const max = isSmall ? 14 : 20;

		const clamped = Math.max(
			6,
			Math.min(next, max)
		);

		codeEl.style.fontSize = `${clamped}px`;
	}

	$effect(() => {
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

			window.removeEventListener(
				'resize',
				onResize
			);
		};
	});
</script>

<Metadata
	title="Benjamin"
	description="Benjamin Blanke — Student and founder of Opus Host, building self-hosted infrastructure, Discord bots, and community tools around Proxmox, Minecraft server hosting, and homelab systems."
/>

{#if sudoMode}
	<div class="pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-black/75 px-4 backdrop-blur-[2px]">
		<div class="w-full max-w-xl border border-ash-700 bg-[#080808] p-4 font-mono text-sm shadow-2xl">
			<p><span class="text-cyan">$</span> sudo access portfolio</p>
			{#if sudoStep >= 1}
				<p class="mt-2 text-ash-400">[sudo] password for visitor: <span class="tracking-widest">********</span></p>
			{/if}
			{#if sudoStep >= 2}
				<div class="mt-3">
					<p>visitor is not in the sudoers file.</p>
					<p class="text-ash-500">This incident will be reported.</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<section
	bind:this={sectionEl}
	class="@container flex grow flex-col items-center justify-center gap-3 overflow-hidden px-4 md:gap-4"
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

	<p class="sr-only">
		Benjamin Blanke
	</p>

	<div class="text-center">
		<p>
			Lahr, Germany. Building self-hosted infrastructure & Discord tools at Opus Host.
		</p>
	</div>

	<div class="mt-1 flex w-full max-w-md flex-col items-center gap-2 text-sm text-neutral-400">
		{#if listeningTo}
			<div class="flex max-w-full items-center justify-center gap-2" title={`Listening to ${listeningTo}`}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" aria-hidden="true">
					<path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" />
				</svg>
				<span class="truncate">Listening to {listeningTo}</span>
			</div>
		{/if}

		{#if lastPush}
			<a onclick={() => track('latest_push_open', { repository: lastPush.repo.split('/').at(-1) ?? lastPush.repo })} href={lastPush.url} target="_blank" rel="noopener noreferrer" class="group flex max-w-full items-center justify-center gap-2 transition-colors hover:text-white" title={`${lastPush.repo}: ${lastPush.message}`}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" aria-hidden="true">
					<circle cx="6" cy="5" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="19" r="2" /><path d="M6 7v10" /><path d="M8 7.5c2.5 0 3.5 3 6 3h2" />
				</svg>
				<span class="min-w-0 truncate">
					<span class="text-neutral-500">Last pushed</span>
					<span class="text-neutral-600"> · </span><span class="text-neutral-300">{lastPush.repo.split('/').at(-1)}</span>
					<span class="text-neutral-600"> · </span>{formatRelativeTime(lastPush.pushedAt)}
				</span>
			</a>
		{/if}

	</div>

	<div class="mt-2 flex items-center justify-center gap-5 text-neutral-400">

		<!-- Cal.com -->
		<a
			onclick={() => track('cal_open', { source: 'homepage' })}
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
				<rect
					x="3"
					y="4"
					width="18"
					height="17"
					rx="3"
				/>

				<path
					d="M16 2v4M8 2v4M3 10h18"
				/>
			</svg>
		</a>

		<!-- Discord -->
		<a
			onclick={() => track('discord_open', { source: 'homepage' })}
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
			onclick={() => track('instagram_open', { source: 'homepage' })}
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

		<!-- GitHub -->
		<a
			onclick={() => track('github_profile_open', { source: 'homepage' })}
			href="https://github.com/benjamin-blanke"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="GitHub"
			title="GitHub"
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
					d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.2-3.12-.12-.29-.52-1.48.11-3.08 0 0 .98-.31 3.16 1.19A10.98 10.98 0 0 1 12 6.23c.98 0 1.96.13 2.87.39 2.19-1.5 3.16-1.19 3.16-1.19.63 1.6.23 2.79.11 3.08.75.82 1.2 1.85 1.2 3.12 0 4.45-2.71 5.43-5.29 5.72.42.36.79 1.07.79 2.16v3.04c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
				/>
			</svg>
		</a>
	</div>
</section>
