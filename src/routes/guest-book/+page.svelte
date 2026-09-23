<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';

	import Metadata from '$lib/components/metadata.svelte';

	import { getGuestsBook, insertGuestBook, toggleLikeGuestBook, deleteGuestBook } from './data.remote';

	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);

	let data = $derived(await getGuestsBook());

	function formatDate(value: Date | string) {
		return new Intl.DateTimeFormat('en', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		})
			.format(new Date(value))
			.replace(',', '');
	}

	function avatarUrl(username: string) {
		return `https://github.com/${username}.png?size=64`;
	}
</script>

<Metadata title="Guest Book | Benjamin" description="Leave a message in Benjamin Blanke's guest book." />

<h1 class="sr-only">Benjamin Blanke's Guest Book</h1>

<section class="flex-1 grow space-y-3 overflow-y-auto overscroll-y-contain px-3 lg:px-4">
	{#if data}
		<form class="flex flex-col gap-2 text-sm lg:flex-row lg:items-center" {...insertGuestBook}>
			<p class="truncate lg:w-36">
				<span class="text-cyan">~</span>/{data.user ? data.user.username.toLowerCase().replace(/\s/g, '-') : 'guest'}
			</p>
			<p class="hidden lg:block">:</p>
			<input
				required
				type="text"
				minLength={3}
				name="content"
				maxLength={140}
				autoComplete="off"
				disabled={!data.user}
				placeholder={data.user ? 'Leave a message' : 'Sign in with GitHub to leave a message'}
				class="placeholder:text-ash-500 caret-cyan min-w-0 flex-1 bg-transparent outline-none disabled:opacity-50"
			/>

			{#if data.user}
				<div class="flex items-center gap-2 lg:w-40">
					<img src={avatarUrl(data.user.username)} alt="" class="h-5 w-5 rounded-full" />
					<button onclick={() => trigger()} class="bg-ash-400 text-ash-800 flex-1 px-2 py-0.5">Submit</button>
				</div>
			{:else}
				<a onclick={() => trigger()} class="bg-ash-400 text-ash-800 flex w-full items-center justify-center gap-2 px-2 py-0.5 lg:w-40" href="/api/auth">
					<svg width="14" height="14" fill="none" viewBox="0 0 14 14" aria-hidden="true">
						<path fill="currentColor" fill-rule="evenodd" d="M7.005 1C3.685 1 1 3.75 1 7.152c0 2.72 1.72 5.022 4.106 5.836.298.062.408-.132.408-.295 0-.143-.01-.631-.01-1.14-1.67.366-2.018-.734-2.018-.734-.269-.713-.667-.896-.667-.896-.546-.377.04-.377.04-.377.607.04.925.631.925.631.537.937 1.402.673 1.75.51.05-.398.208-.673.377-.826C4.58 9.72 3.177 9.19 3.177 6.826c0-.672.239-1.222.617-1.65-.06-.153-.269-.784.06-1.63 0 0 .506-.163 1.65.632.49-.135.994-.203 1.501-.204.507 0 1.024.071 1.501.204 1.144-.795 1.65-.632 1.65-.632.329.846.12 1.477.06 1.63.388.428.617.978.617 1.65 0 2.363-1.402 2.883-2.744 3.035.218.194.407.56.407 1.141 0 .825-.01 1.487-.01 1.691 0 .163.11.357.408.296C11.28 12.172 13 9.872 13 7.152 13.01 3.75 10.316 1 7.005 1z" clip-rule="evenodd" />
					</svg>
					SignIn
				</a>
			{/if}
		</form>

		{#if data.guestBooks.length === 0}
			<div class="py-10 text-center text-sm text-ash-500">
				<p><span class="text-cyan">~</span>/guest-book: no messages yet</p>
				<p class="mt-1 text-xs">Be the first to leave one.</p>
			</div>
		{:else}
			<ul class="divide-ash-700 flex flex-col divide-y text-sm lg:divide-y-0">
				{#each data.guestBooks as item (item.id)}
					<li class="group flex gap-2 py-2 lg:items-center lg:py-1" class:animate-pulse={item.id < 0}>
						<img src={avatarUrl(item.username)} alt="" loading="lazy" class="mt-0.5 h-6 w-6 shrink-0 rounded-full lg:mt-0" />

						<div class="min-w-0 flex-1 lg:flex lg:items-center lg:gap-2">
							<p class="truncate lg:w-32 lg:flex-none">
								<span class="text-cyan">~</span>/{item.username.toLowerCase().replace(/\s/g, '-')}
							</p>
							<p class="hidden lg:block">:</p>
							<p class="mt-1 break-words text-ash-200 lg:mt-0 lg:flex-1">{item.content}</p>

							<div class="mt-1.5 flex items-center gap-3 text-xs text-ash-500 lg:mt-0 lg:shrink-0">
								{#if data.user && item.id > 0}
									<button
										onclick={async () => {
											trigger();
											await toggleLikeGuestBook(item.id);
										}}
										class="flex items-center gap-1 transition-colors hover:text-white"
										aria-label={item.liked ? 'Unlike' : 'Like'}
									>
										<svg width="13" height="13" viewBox="0 0 14 14" fill="none" class="stroke-current" class:fill-current={item.liked}>
											<path d="M11.0832 8.16667C11.9523 7.315 12.8332 6.29417 12.8332 4.95833C12.8332 4.10743 12.4952 3.29138 11.8935 2.6897C11.2918 2.08802 10.4757 1.75 9.62484 1.75C8.59817 1.75 7.87484 2.04167 6.99984 2.91667C6.12484 2.04167 5.4015 1.75 4.37484 1.75C3.52393 1.75 2.70788 2.08802 2.1062 2.6897C1.50452 3.29138 1.1665 4.10743 1.1665 4.95833C1.1665 6.3 2.0415 7.32083 2.9165 8.16667L6.99984 12.25L11.0832 8.16667Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
										{item.likeCount}
									</button>

									{#if item.userId === data.user?.id}
										<button
											aria-label="Delete"
											class="transition-colors hover:text-red-400"
											onclick={async () => {
												trigger();
												await deleteGuestBook(item.id);
											}}
										>
											delete
										</button>
									{/if}
								{/if}
								<time datetime={new Date(item.createdAt).toISOString()}>{formatDate(item.createdAt)}</time>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<div class="grid h-full min-h-52 w-full place-items-center">
			<p class="animate-pulse text-sm text-ash-500"><span class="text-cyan">~</span>/guest-book: loading...</p>
		</div>
	{/if}
</section>
