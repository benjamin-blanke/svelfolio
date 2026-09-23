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
			month: 'short',
			day: '2-digit',
			year: 'numeric'
		}).format(new Date(value));
	}

	function avatarUrl(username: string) {
		return `https://github.com/${username}.png?size=80`;
	}
</script>

<Metadata
	title="Guest Book | Benjamin"
	description="Leave a message in Benjamin Blanke's guest book."
/>

<h1 class="sr-only">Benjamin Blanke's Guest Book</h1>

<section class="flex-1 grow overflow-y-auto overscroll-y-contain px-3 pb-4 lg:px-4">
	{#if data}
		<div class="mx-auto flex w-full max-w-3xl flex-col gap-4">
			<div class="rounded-2xl border border-ash-700/80 bg-ash-900/30 p-3 backdrop-blur-sm">
				<div class="mb-3 flex items-center justify-between gap-3">
					<div class="min-w-0">
						<p class="text-sm font-medium text-white">Guest Book</p>
						<p class="text-xs text-ash-400">
							{data.guestBooks.length} {data.guestBooks.length === 1 ? 'message' : 'messages'}
						</p>
					</div>

					{#if data.user}
						<div class="flex min-w-0 items-center gap-2 rounded-full border border-ash-700 px-2 py-1 text-xs text-ash-300">
							<img
								src={avatarUrl(data.user.username)}
								alt=""
								class="h-5 w-5 rounded-full bg-ash-800"
							/>
							<span class="max-w-32 truncate">@{data.user.username}</span>
						</div>
					{/if}
				</div>

				<form class="flex flex-col gap-2 sm:flex-row" {...insertGuestBook}>
					<div class="flex min-w-0 flex-1 items-center rounded-xl border border-ash-700 bg-black/20 px-3 transition-colors focus-within:border-ash-500">
						<span class="mr-2 text-cyan">~</span>
						<input
							required
							type="text"
							minLength={3}
							name="content"
							maxLength={140}
							autoComplete="off"
							disabled={!data.user}
							placeholder={data.user ? 'Leave a message…' : 'Sign in with GitHub to leave a message'}
							class="placeholder:text-ash-500 caret-cyan min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
						/>
					</div>

					{#if data.user}
						<button
							onclick={() => trigger()}
							class="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform active:scale-[0.98]"
						>
							Post
						</button>
					{:else}
						<a
							onclick={() => trigger()}
							class="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform active:scale-[0.98]"
							href="/api/auth"
						>
							<svg width="15" height="15" fill="none" viewBox="0 0 14 14" aria-hidden="true">
								<path
									fill="currentColor"
									fill-rule="evenodd"
									d="M7.005 1C3.685 1 1 3.75 1 7.152c0 2.72 1.72 5.022 4.106 5.836.298.062.408-.132.408-.295 0-.143-.01-.631-.01-1.14-1.67.366-2.018-.734-2.018-.734-.269-.713-.667-.896-.667-.896-.546-.377.04-.377.04-.377.607.04.925.631.925.631.537.937 1.402.673 1.75.51.05-.398.208-.673.377-.826C4.58 9.72 3.177 9.19 3.177 6.826c0-.672.239-1.222.617-1.65-.06-.153-.269-.784.06-1.63 0 0 .506-.163 1.65.632.49-.135.994-.203 1.501-.204.507 0 1.024.071 1.501.204 1.144-.795 1.65-.632 1.65-.632.329.846.12 1.477.06 1.63.388.428.617.978.617 1.65 0 2.363-1.402 2.883-2.744 3.035.218.194.407.56.407 1.141 0 .825-.01 1.487-.01 1.691 0 .163.11.357.408.296C11.28 12.172 13 9.872 13 7.152 13.01 3.75 10.316 1 7.005 1z"
									clip-rule="evenodd"
								/>
							</svg>
							Sign in with GitHub
						</a>
					{/if}
				</form>
			</div>

			{#if data.guestBooks.length === 0}
				<div class="rounded-2xl border border-dashed border-ash-700 px-5 py-12 text-center">
					<div class="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full border border-ash-700 text-ash-400">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
							<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
						</svg>
					</div>
					<p class="text-sm text-white">No messages yet</p>
					<p class="mt-1 text-xs text-ash-400">Be the first to leave something here.</p>
				</div>
			{:else}
				<ul class="flex flex-col gap-2">
					{#each data.guestBooks as item (item.id)}
						<li
							class="group rounded-2xl border border-ash-700/80 bg-ash-900/20 p-3 transition-colors hover:border-ash-600 hover:bg-ash-900/35"
							class:animate-pulse={item.id < 0}
						>
							<div class="flex items-start gap-3">
								<img
									src={avatarUrl(item.username)}
									alt=""
									loading="lazy"
									class="h-9 w-9 shrink-0 rounded-full bg-ash-800 ring-1 ring-ash-700"
								/>

								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
										<p class="max-w-full truncate text-sm font-medium text-white">@{item.username}</p>
										<span class="text-xs text-ash-500">·</span>
										<time class="text-xs text-ash-500" datetime={new Date(item.createdAt).toISOString()}>
											{formatDate(item.createdAt)}
										</time>
									</div>

									<p class="mt-1.5 break-words text-sm leading-relaxed text-ash-200">{item.content}</p>

									{#if data.user && item.id > 0}
										<div class="mt-2 flex items-center gap-3">
											<button
												onclick={async () => {
												trigger();
												await toggleLikeGuestBook(item.id);
											}}
												class="flex items-center gap-1.5 text-xs text-ash-400 transition-colors hover:text-white"
												aria-label={item.liked ? 'Unlike' : 'Like'}
											>
												<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="stroke-current" class:fill-current={item.liked}>
													<path
														d="M11.0832 8.16667C11.9523 7.315 12.8332 6.29417 12.8332 4.95833C12.8332 4.10743 12.4952 3.29138 11.8935 2.6897C11.2918 2.08802 10.4757 1.75 9.62484 1.75C8.59817 1.75 7.87484 2.04167 6.99984 2.91667C6.12484 2.04167 5.4015 1.75 4.37484 1.75C3.52393 1.75 2.70788 2.08802 2.1062 2.6897C1.50452 3.29138 1.1665 4.10743 1.1665 4.95833C1.1665 6.3 2.0415 7.32083 2.9165 8.16667L6.99984 12.25L11.0832 8.16667Z"
														stroke-width="1.5"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
												</svg>
												<span>{item.likeCount}</span>
											</button>

											{#if item.userId === data.user?.id}
												<button
													aria-label="Delete"
													class="flex items-center gap-1.5 text-xs text-ash-500 transition-colors hover:text-red-400"
													onclick={async () => {
														trigger();
														await deleteGuestBook(item.id);
													}}
												>
													<svg width="13" height="13" fill="none" viewBox="0 0 14 14">
														<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 3.5l-7 7M3.5 3.5l7 7" />
													</svg>
													Delete
												</button>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<div class="grid h-full min-h-52 w-full place-items-center">
			<div class="flex items-center gap-2 text-sm text-ash-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="animate-spin"
				>
					<path d="M12 2v4" />
					<path d="m16.2 7.8 2.9-2.9" />
					<path d="M18 12h4" />
					<path d="m16.2 16.2 2.9 2.9" />
					<path d="M12 18v4" />
					<path d="m4.9 19.1 2.9-2.9" />
					<path d="M2 12h4" />
					<path d="m4.9 4.9 2.9 2.9" />
				</svg>
				Loading guest book…
			</div>
		</div>
	{/if}
</section>
