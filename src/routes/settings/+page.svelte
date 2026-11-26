<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import SteamLoginButton from '#lib/components/layout/SteamLoginButton.svelte';
	import BbcodeEditor from '#lib/components/BbcodeEditor.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import { BBCODE_TAGS } from '#lib/bbcode.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.player?.profile ?? null);
	let bio = $state(untrack(() => profile?.bio ?? ''));
	const actionMessage = $derived(form?.message ?? null);
	const actionSuccess = $derived(form?.success === true);

	const inputClass = 'vgui-input w-full';
</script>

<svelte:head>
	<title>{m.settings_title()}</title>
</svelte:head>

{#if !data.user}
	<Card title={m.settings_title()}>
		<div class="flex flex-col gap-3 p-3">
			{#if data.authFailed}
				<p class="text-error">{m.auth_failed()}</p>
			{/if}
			<p>{m.settings_sign_in_prompt()}</p>
			<p class="text-xs text-text/70">{m.settings_sign_in_help()}</p>
			<div>
				<SteamLoginButton redirectTo="/settings" />
			</div>
		</div>
	</Card>
{:else if data.error}
	<Card title={m.settings_title()}>
		<p class="p-3 text-gold">{data.error}</p>
	</Card>
{:else if !data.player}
	<Card title={m.settings_title()}>
		<p class="p-3">{m.player_not_found()}</p>
	</Card>
{:else}
	<Card title={m.settings_title()}>
		<form
			method="POST"
			use:enhance={({ formData }) => {
				formData.set('bio', bio);
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
			class="flex flex-col gap-4 p-3"
		>
			<p class="text-sm text-text/80">{m.settings_description()}</p>

			<div class="flex flex-col gap-1 text-xs">
				<span>{m.settings_bio()}</span>
				<BbcodeEditor bind:value={bio} />
				<span class="text-text/60">
					{bio.length}/512 · {m.settings_bio_help({
						tags: BBCODE_TAGS.map((entry) => `[${entry.tag}]`).join(', '),
					})}
				</span>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<label class="flex flex-col gap-1 text-xs">
					<span>{m.settings_twitter()}</span>
					<input
						type="text"
						name="twitter_handle"
						class={inputClass}
						value={profile?.twitter_handle ?? ''}
						placeholder="username"
					/>
				</label>

				<label class="flex flex-col gap-1 text-xs">
					<span>{m.settings_twitch()}</span>
					<input
						type="text"
						name="twitch_handle"
						class={inputClass}
						value={profile?.twitch_handle ?? ''}
						placeholder="username"
					/>
				</label>

				<label class="flex flex-col gap-1 text-xs">
					<span>{m.settings_youtube()}</span>
					<input
						type="text"
						name="youtube_handle"
						class={inputClass}
						value={profile?.youtube_handle ?? ''}
						placeholder="channel"
					/>
				</label>

				<label class="flex flex-col gap-1 text-xs">
					<span>{m.settings_discord()}</span>
					<input
						type="text"
						name="discord_handle"
						class={inputClass}
						value={profile?.discord_handle ?? ''}
						placeholder="username"
					/>
				</label>

				<label class="flex flex-col gap-1 text-xs sm:col-span-2">
					<span>{m.settings_website()}</span>
					<input
						type="url"
						name="website_url"
						class={inputClass}
						value={profile?.website_url ?? ''}
						placeholder="https://example.com"
					/>
				</label>
			</div>

			<p class="text-xs text-text/60">{m.settings_handles_help()}</p>

			{#if actionMessage}
				<p class="text-error">{actionMessage}</p>
			{:else if actionSuccess}
				<p class="text-gold">{m.settings_saved()}</p>
			{/if}

			<div class="flex flex-wrap items-center gap-2">
				<button
					type="submit"
					class="raised-panel bevel-raised cursor-pointer px-3 py-1 text-sm font-bold hover:bg-surface-lighter"
				>
					{m.settings_save()}
				</button>
				<a
					href={`/player/${data.user.id}`}
					class="raised-panel bevel-raised px-3 py-1 text-sm hover:bg-surface-lighter"
				>
					{m.auth_visit_profile()}
				</a>
			</div>
		</form>
	</Card>
{/if}
