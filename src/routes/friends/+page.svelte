<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';

	import Metadata from '$lib/components/metadata.svelte';
	import { friends } from '$lib/friends';

	const { trigger, destroy } = createWebHaptics();

	onDestroy(destroy);
</script>

<Metadata
	title="Friends | Benjamin"
	description="A few of the people I build and hang out with -- mostly met through Discord, Opus Host, or general homelab chaos."
/>

<h1 class="sr-only">Benjamin's Friends</h1>

<main class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
	{#each friends as friend (friend.name)}
		<div class="border-ash-700 flex flex-col gap-2 border p-3">
			<div class="flex items-center justify-between gap-2">
				<p class="text-ash-100 font-semibold">{friend.name}</p>
				<a
					onclick={() => trigger()}
					href={friend.discordUrl}
					target="_blank"
					rel="noreferrer"
					class="text-cyan flex shrink-0 items-center gap-1 text-xs"
					aria-label={`${friend.name} on Discord`}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.673-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"
						/>
					</svg>
					{friend.discordUsername}
				</a>
			</div>
			<p class="text-ash-300 text-sm">{friend.description}</p>
			{#if friend.socials.length}
				<div class="border-ash-700 flex flex-wrap gap-2 border-t pt-2 text-xs">
					{#each friend.socials as social (social.url)}
						<a onclick={() => trigger()} href={social.url} target="_blank" rel="noreferrer" class="text-ash-400 hover:text-ash-100 underline underline-offset-2">
							{social.label}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</main>
