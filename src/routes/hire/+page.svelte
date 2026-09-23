<script lang="ts">
	import { enhance } from '$app/forms';
	import Metadata from '$lib/components/metadata.svelte';
	import { track } from '$lib/analytics';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let sending = $state(false);
</script>

<Metadata title="Hire Me | Benjamin" description="Work with Benjamin Blanke on infrastructure, web, Discord, automation and community projects." />

<section class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-2xl">
		<div class="mb-7">
			<p class="text-xs text-ash-500"><span class="text-cyan">~</span>/hire-me</p>
			<h1 class="mt-2 text-2xl text-ash-100">Have something worth building?</h1>
			<p class="mt-2 max-w-xl text-sm leading-relaxed text-ash-400">Tell me what you’re working on. Infrastructure, web, Discord, automation or something unusual — give me the useful details and I’ll take a look.</p>
		</div>

		{#if form?.success}
			<div class="border border-ash-700 bg-ash-800/40 p-5 text-sm">
				<p class="text-cyan">$ sent</p>
				<p class="mt-2 text-ash-200">Message received. Check your inbox — a confirmation is on its way.</p>
				{#if form.ref}<p class="mt-2 text-xs text-ash-500">reference: {form.ref}</p>{/if}
			</div>
		{:else}
			<form method="POST" use:enhance={() => {
				sending = true;
				track('hire_form_submit');
				return async ({ update }) => { await update(); sending = false; };
			}} class="space-y-5">
				<div class="grid gap-5 sm:grid-cols-2">
					<label class="block"><span class="mb-1.5 block text-xs text-ash-500">Name *</span><input required minlength="2" name="name" autocomplete="name" class="caret-cyan w-full border-b border-ash-700 bg-transparent py-2 outline-none transition-colors focus:border-ash-300" placeholder="Your name" /></label>
					<label class="block"><span class="mb-1.5 block text-xs text-ash-500">Email *</span><input required type="email" name="email" autocomplete="email" class="caret-cyan w-full border-b border-ash-700 bg-transparent py-2 outline-none transition-colors focus:border-ash-300" placeholder="you@company.com" /></label>
					<label class="block"><span class="mb-1.5 block text-xs text-ash-500">Company</span><input name="company" autocomplete="organization" class="caret-cyan w-full border-b border-ash-700 bg-transparent py-2 outline-none transition-colors focus:border-ash-300" placeholder="Optional" /></label>
					<label class="block"><span class="mb-1.5 block text-xs text-ash-500">Project type</span><select name="project" class="w-full border-b border-ash-700 bg-transparent py-2 outline-none focus:border-ash-300"><option value="">Select one</option><option>Web / product</option><option>Infrastructure / hosting</option><option>Discord / community</option><option>Automation / tooling</option><option>Other</option></select></label>
				</div>
				<label class="block"><span class="mb-1.5 block text-xs text-ash-500">Budget / scope</span><input name="budget" class="caret-cyan w-full border-b border-ash-700 bg-transparent py-2 outline-none transition-colors focus:border-ash-300" placeholder="Optional — e.g. small project, ongoing work, €500…" /></label>
				<label class="block"><span class="mb-1.5 block text-xs text-ash-500">What are we building? *</span><textarea required minlength="10" maxlength="3000" name="message" rows="6" class="caret-cyan w-full resize-y border border-ash-700 bg-transparent p-3 text-sm leading-relaxed outline-none transition-colors focus:border-ash-300" placeholder="Goal, current state, timeline, stack, what you need help with…"></textarea></label>
				<label class="hidden" aria-hidden="true">Website<input tabindex="-1" autocomplete="off" name="website" /></label>
				{#if form?.error}<p class="text-sm text-red-400">{form.error}</p>{/if}
				<div class="flex items-center justify-between gap-4">
					<p class="text-xs text-ash-500">Replies come from buissness@blanke.lol</p>
					<button disabled={sending} class="bg-ash-300 px-4 py-2 text-sm text-ash-800 transition-opacity hover:opacity-80 disabled:opacity-50">{sending ? 'Sending…' : 'Send inquiry →'}</button>
				</div>
			</form>
		{/if}
	</div>
</section>
