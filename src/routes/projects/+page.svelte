<script lang="ts">
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { createWebHaptics } from 'web-haptics/svelte';

	import Metadata from '$lib/components/metadata.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let activeTechstack = $derived(browser ? (page.url.searchParams.get('techstack') ?? '') : '');
	let articles = $derived.by(() => {
		if (activeTechstack === '') return data.items;
		return data.items.filter((item) => item.techstack?.includes(activeTechstack));
	});

	const { trigger, destroy } = createWebHaptics();

	onDestroy(destroy);

	function relativeTime(value: string) {
		const diff = Date.now() - new Date(value).getTime();
		const minutes = Math.max(0, Math.floor(diff / 60_000));
		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		return `${Math.floor(days / 30)}mo ago`;
	}
</script>

<Metadata
	title="Projects | Benjamin"
	description="Discover the interactive brilliance of my projects, peruse my polished portfolio, and delve into a sneak peek of my formidable technical prowess. Uncover a world where innovation meets functionality, showcased through a minimal SvelteKit portfolio. Explore projects, tools, and live GitHub activity."
/>

<h1 class="sr-only">Benjamin Blanke's Projects</h1>

<main class="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each articles as article (article.slug)}
		<a
			onclick={() => trigger()}
			href={`/projects/${article.slug}` + (activeTechstack ? `?techstack=${activeTechstack}` : '')}
			class="divide-ash-700 border-ash-700 divide-y overflow-hidden border select-none"
			aria-label={`View details for project: ${article.title}`}
			data-sveltekit-preload-code="eager"
		>
			<figure class="group relative aspect-video">
				<enhanced:img
					src={article.poster}
					alt={article.title}
					sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					class="aspect-video object-cover object-center grayscale-50 transition-all duration-500 group-hover:grayscale-0"
				/>
				<div class="absolute top-0 left-0 grid h-full w-full place-items-center bg-[#080808]/90 transition-opacity duration-500 group-hover:opacity-0">
					<p class="px-4 text-center text-3xl font-semibold uppercase">{article.title}</p>
				</div>
				<div aria-hidden="true" class="bg-project-noise absolute top-0 left-0 h-full w-full bg-repeat opacity-2 group-hover:opacity-0"></div>
			</figure>
			<div class="p-2">
				<p class="line-clamp-4 text-sm">{article.description}</p>
				{#if article.githubData}
					<div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ash-500">
						{#if article.githubData.language}<span>{article.githubData.language}</span><span>·</span>{/if}
						<span>pushed {relativeTime(article.githubData.pushedAt)}</span>
						<span>·</span><span>★ {article.githubData.stars}</span>
						<span>·</span><span>⑂ {article.githubData.forks}</span>
					</div>
				{/if}
			</div>
		</a>
	{/each}
</main>
