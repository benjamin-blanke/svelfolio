<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let open = $state(false);
	let query = $state('');
	let input: HTMLInputElement;

	const commands = [
		{ label: 'Home', hint: '/', action: () => goto('/') },
		{ label: 'About', hint: '/abouts', action: () => goto('/abouts') },
		{ label: 'Projects', hint: '/projects', action: () => goto('/projects') },
		{ label: 'Guest Book', hint: '/guest-book', action: () => goto('/guest-book') },
		{ label: 'Imprint', hint: '/imprint', action: () => goto('/imprint') },
		{ label: 'GitHub', hint: 'external', action: () => window.open('https://github.com/benjamin-blanke', '_blank', 'noopener,noreferrer') },
		{ label: 'Book a call', hint: 'cal.com', action: () => window.open('https://cal.com/benjaminoliverblanke', '_blank', 'noopener,noreferrer') }
	];

	let filtered = $derived(commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())));

	function close() {
		open = false;
		query = '';
	}

	function run(action: () => void) {
		action();
		close();
	}

	onMount(() => {
		const keydown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				open = !open;
				if (open) setTimeout(() => input?.focus());
			}
			if (event.key === 'Escape') close();
		};
		window.addEventListener('keydown', keydown);
		return () => window.removeEventListener('keydown', keydown);
	});
</script>

<button onclick={() => { open = true; setTimeout(() => input?.focus()); }} class="fixed right-3 bottom-16 z-[80] hidden border border-ash-700 bg-ash-800 px-2 py-1 text-[11px] text-ash-400 transition-colors hover:text-white lg:block" aria-label="Open command palette">⌘K</button>

{#if open}
	<div class="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-[2px]" role="presentation" onclick={(event) => { if (event.currentTarget === event.target) close(); }}>
		<div class="w-full max-w-lg border border-ash-600 bg-ash-800 shadow-2xl" role="dialog" aria-modal="true" aria-label="Command palette">
			<div class="flex items-center gap-2 border-b border-ash-700 px-3">
				<span class="text-cyan">›</span>
				<input bind:this={input} bind:value={query} placeholder="Type a command..." class="caret-cyan min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-ash-500" />
				<span class="text-[10px] text-ash-500">ESC</span>
			</div>
			<div class="max-h-72 overflow-y-auto p-1">
				{#each filtered as command, index (command.label)}
					<button onclick={() => run(command.action)} class="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ash-300 transition-colors hover:bg-ash-700 hover:text-white" autofocus={index === 0 && query.length > 0}>
						<span>{command.label}</span><span class="text-xs text-ash-500">{command.hint}</span>
					</button>
				{:else}
					<p class="px-3 py-6 text-center text-xs text-ash-500">No command found.</p>
				{/each}
			</div>
		</div>
	</div>
{/if}
