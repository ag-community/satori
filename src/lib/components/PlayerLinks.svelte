<script lang="ts">
	import type { ProfileDto } from '#lib/api/types.js';
	import { steamProfileUrl } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';

	let {
		profile,
		steamId,
	}: { profile: ProfileDto | null; steamId: string } = $props();

	let copied = $state(false);

	const steamUrl = $derived(steamProfileUrl(steamId));
	const links = $derived([
		...(profile?.twitter_handle
			? [{ label: m.settings_twitter(), href: `https://twitter.com/${profile.twitter_handle}` }]
			: []),
		...(profile?.twitch_handle
			? [{ label: m.settings_twitch(), href: `https://twitch.tv/${profile.twitch_handle}` }]
			: []),
		...(profile?.youtube_handle
			? [
					{
						label: m.settings_youtube(),
						href: `https://youtube.com/@${profile.youtube_handle}`,
					},
				]
			: []),
		...(profile?.website_url
			? [{ label: m.settings_website(), href: profile.website_url }]
			: []),
		...(steamUrl ? [{ label: 'Steam', href: steamUrl }] : []),
	]);

	async function copyDiscord(): Promise<void> {
		if (!profile?.discord_handle) return;

		try {
			await navigator.clipboard.writeText(profile.discord_handle);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard access can fail.
			// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
		}
	}
</script>

{#if links.length > 0 || profile?.discord_handle}
	<div class="mt-2 flex flex-wrap gap-x-3 border-t border-divider pt-2 text-xs">
		{#each links as link (link.label)}
			<a
				href={link.href}
				target="_blank"
				rel="nofollow ugc noopener noreferrer"
				class="text-gold hover:underline">{link.label}</a
			>
		{/each}
		{#if profile?.discord_handle}
			<button
				type="button"
				class="cursor-pointer border-0 bg-transparent p-0 text-gold hover:underline focus-visible:underline"
				onclick={copyDiscord}
			>
				{copied ? m.profile_copied() : m.settings_discord()}
			</button>
		{/if}
	</div>
{/if}
