<script lang="ts">
	import { PUBLIC_REPO_URL } from '$app/env/public';
	import PlayerLink from '#lib/components/PlayerLink.svelte';
	import SortableSections from '#lib/components/ui/SortableSections.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statItems = [
		m.home_stats_items_0(),
		m.home_stats_items_1(),
		m.home_stats_items_2(),
		m.home_stats_items_3(),
	];
</script>

<svelte:head>
	<title>{m.title_home()}</title>
</svelte:head>

{#snippet welcome()}
	<p class="m-0 mb-3">{m.home_subtitle()}</p>

	<div class="grid gap-3 sm:grid-cols-3">
		<a
			href="/leaderboard"
			class="inset-panel bevel-sunken rounded-(--radius-skin) px-2.5 py-2.5 hover:text-gold"
		>
			<span class="block mb-3 text-xl font-bold">{m.home_view_rankings()}</span>
			<span class="block text-sm">{m.home_view_rankings_desc()}</span>
		</a>
		<div class="inset-panel bevel-sunken rounded-(--radius-skin) px-2.5 py-2.5">
			<span class="block mb-3 text-xl font-bold">{m.home_browse_matches()}</span>
			<span class="block text-sm">{m.home_browse_matches_desc()}</span>
		</div>
		<a
			href="/docs"
			class="inset-panel bevel-sunken rounded-(--radius-skin) px-2.5 py-2.5 hover:text-gold"
		>
			<span class="block mb-3 text-xl font-bold">{m.home_read_docs()}</span>
			<span class="block text-sm">{m.home_read_docs_desc()}</span>
		</a>
	</div>
{/snippet}

{#snippet topPlayers()}
	{#if data.error}
		<p class="m-0 text-sm text-gold">{data.error}</p>
	{:else}
		<div class="inset-panel bevel-sunken rounded-(--radius-skin)">
			{#each data.topPlayers as player, index (player.id)}
				<div
					class="flex items-center gap-3 px-2.5 py-1.5 {index > 0
						? 'border-t border-divider'
						: ''}"
				>
					<span class="w-6 shrink-0 font-bold">#{index + 1}</span>
					<PlayerLink
						playerId={player.id}
						name={player.steam_name}
						avatarUrl={player.steam_avatar_url}
						country={player.country}
					/>
					<span class="ml-auto text-sm">
						{Math.round(player.stats?.points ?? 0).toLocaleString()}
					</span>
				</div>
			{/each}
		</div>
	{/if}
{/snippet}

{#snippet stats()}
	<p class="m-0 mb-2">{m.home_stats_desc()}</p>
	<ul class="m-0 list-none space-y-0.5 p-0">
		{#each statItems as item (item)}
			<li>• {item}</li>
		{/each}
	</ul>
{/snippet}

{#snippet openSource()}
	<p class="m-0 mb-2">{m.home_open_source_desc()}</p>
	{#if PUBLIC_REPO_URL}
		<p class="m-0">
			<a
				href={PUBLIC_REPO_URL}
				target="_blank"
				rel="noreferrer"
				class="text-gold hover:underline"
			>
				{m.home_open_source_github()}
			</a>
		</p>
	{/if}
{/snippet}

<SortableSections
	initialOrder={['welcome', 'top_players', 'stats', 'open_source']}
	sections={[
		{ id: 'welcome', title: m.home_welcome(), content: welcome },
		{ id: 'top_players', title: m.home_top_players(), content: topPlayers },
		{ id: 'stats', title: m.home_stats_title(), content: stats },
		{ id: 'open_source', title: m.home_open_source_title(), content: openSource },
	]}
/>
