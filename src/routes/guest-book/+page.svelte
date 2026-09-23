<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';

	import Metadata from '$lib/components/metadata.svelte';

	import { getGuestsBook, insertGuestBook, toggleLikeGuestBook, deleteGuestBook, insertGuestBookReply } from './data.remote';

	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);

	let data = $derived(await getGuestsBook());
	let replyingTo = $state<number | null>(null);
	let replyContent = $state('');
	let sendingReply = $state(false);
	const isOwner = $derived(data?.user?.username?.toLowerCase() === 'benjamin-blanke');

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

<section class="flex-1 grow overflow-y-auto overscroll-y-contain px-4 py-3 sm:px-5 lg:px-4 lg:py-0">
	{#if data}
		<form class="mb-5 flex flex-col gap-3 text-sm lg:mb-3 lg:flex-row lg:items-center lg:gap-2" {...insertGuestBook}>
			<p class="truncate text-base lg:w-36 lg:text-sm">
				<span class="text-cyan">~</span>/{data.user ? data.user.username.toLowerCase().replace(/\s/g, '-') : 'guest'}
				{#if isOwner}<span class="ml-1 text-[10px] text-ash-500">[owner]</span>{/if}
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
				class="placeholder:text-ash-500 caret-cyan min-w-0 flex-1 border-b border-ash-700 bg-transparent pb-2 text-base outline-none focus:border-ash-400 disabled:opacity-50 lg:border-0 lg:pb-0 lg:text-sm"
			/>

			{#if data.user}
				<div class="flex items-center gap-2 lg:w-40">
					<img src={avatarUrl(data.user.username)} alt="" class="h-5 w-5 rounded-full" />
					<button onclick={() => trigger()} class="bg-ash-400 text-ash-800 flex-1 px-3 py-2 text-sm lg:px-2 lg:py-0.5">Submit</button>
				</div>
			{:else}
				<a onclick={() => trigger()} class="bg-ash-400 text-ash-800 flex w-full items-center justify-center gap-2 px-3 py-2 text-sm lg:w-40 lg:px-2 lg:py-0.5" href="/api/auth">
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
					<li class="group flex gap-3 py-4 first:pt-1 lg:items-center lg:gap-2 lg:py-1" class:animate-pulse={item.id < 0}>
						<img src={avatarUrl(item.username)} alt="" loading="lazy" class="mt-0.5 h-8 w-8 shrink-0 rounded-full lg:mt-0 lg:h-6 lg:w-6" />

						<div class="min-w-0 flex-1 lg:flex lg:items-center lg:gap-2">
							<p class="truncate text-[15px] lg:w-32 lg:flex-none lg:text-sm">
								<span class="text-cyan">~</span>/{item.username.toLowerCase().replace(/\s/g, '-')}
								{#if item.username.toLowerCase() === 'benjamin-blanke'}<span class="ml-1 text-[10px] text-ash-500">[owner]</span>{/if}
							</p>
							<p class="hidden lg:block">:</p>
							<p class="mt-2 break-words text-[15px] leading-relaxed text-ash-200 lg:mt-0 lg:flex-1 lg:text-sm lg:leading-normal">{item.content}</p>

							{#if item.replies?.length}
								<div class="mt-2 space-y-1.5 lg:mt-1">
									{#each item.replies as reply (reply.id)}
										<div class="border-l border-ash-700 pl-2 text-xs">
											<p class="text-ash-500">↳ <span class="text-cyan">~</span>/{reply.username.toLowerCase().replace(/\s/g, '-')} <span class="text-[10px]">[owner]</span></p>
											<p class="break-words text-ash-300">{reply.content}</p>
										</div>
									{/each}
								</div>
							{/if}

							{#if isOwner && item.id > 0}
								{#if replyingTo === item.id}
									<form
										class="mt-2 flex gap-2"
										onsubmit={async (event) => {
											event.preventDefault();
											if (!replyContent.trim() || sendingReply) return;
											sendingReply = true;
											try {
												await insertGuestBookReply({ guestBookId: item.id, content: replyContent });
												replyContent = '';
												replyingTo = null;
											} finally {
												sendingReply = false;
											}
										}}
									>
										<input bind:value={replyContent} maxlength="140" autofocus placeholder="Reply as owner..." class="caret-cyan min-w-0 flex-1 border-b border-ash-700 bg-transparent pb-1 text-xs outline-none focus:border-ash-400" />
										<button disabled={sendingReply} class="text-xs text-ash-400 hover:text-white disabled:opacity-50">send</button>
										<button type="button" onclick={() => { replyingTo = null; replyContent = ''; }} class="text-xs text-ash-500 hover:text-white">cancel</button>
									</form>
								{:else}
									<button onclick={() => { replyingTo = item.id; replyContent = ''; trigger(); }} class="mt-1 text-[11px] text-ash-500 transition-colors hover:text-white">↳ reply</button>
								{/if}
							{/if}

							<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ash-500 lg:mt-0 lg:shrink-0 lg:flex-nowrap lg:text-xs">
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
