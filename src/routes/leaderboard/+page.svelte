<script lang="ts">
	import { goto } from '$app/navigation';
	import PlayerLink from '#lib/components/PlayerLink.svelte';
	import SeasonSelector from '#lib/components/SeasonSelector.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { COUNTRY_CODES } from '#lib/countries.js';
	import { formatPercent } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const result = $derived(data.data);

	const sorts = [
		{ value: 'Points', label: m.leaderboard_filter_sort_points() },
		{ value: 'WinRate', label: m.leaderboard_filter_sort_winrate() },
		{ value: 'Matches', label: m.leaderboard_filter_sort_matches() },
	] as const;

	function buildHref(overrides: {
		sort?: string;
		country?: string;
		page?: number;
		size?: number;
		season?: number;
	}): string {
		const params = new URLSearchParams();
		params.set('sort', overrides.sort ?? data.sort);
		params.set('country', overrides.country ?? data.country);
		params.set('page', String(overrides.page ?? data.page));
		params.set('size', String(overrides.size ?? data.size));

		const season = overrides.season ?? data.season;
		if (season !== undefined) params.set('season', String(season));

		return `/leaderboard?${params.toString()}`;
	}

	const countryOptions = $derived([
		{ value: 'all', label: m.leaderboard_all_countries() },
		...COUNTRY_CODES.map((code) => ({ value: code, label: code })),
	]);
</script>

<svelte:head>
	<title>{m.title_leaderboard()}</title>
</svelte:head>

<Card title={m.leaderboard_global()}>
	<p class="mb-3">{m.leaderboard_description()}</p>

	<div class="mb-3 flex flex-wrap gap-2">
		<div class="flex flex-col gap-1 text-xs">
			{m.leaderboard_filter_sort()}
			<Select
				value={data.sort}
				options={sorts.map((option) => ({ value: option.value, label: option.label }))}
				label={m.leaderboard_filter_sort()}
				minWidth={170}
				onSelect={(value) => goto(buildHref({ sort: String(value), page: 1 }))}
			/>
		</div>

		<div class="flex flex-col gap-1 text-xs">
			{m.leaderboard_filter_country()}
			<Select
				value={data.country}
				options={countryOptions}
				label={m.leaderboard_filter_country()}
				minWidth={200}
				onSelect={(value) => goto(buildHref({ country: String(value), page: 1 }))}
			/>
		</div>

		{#if data.season !== undefined && data.seasons.length > 1}
			<SeasonSelector seasons={data.seasons} value={data.season} />
		{/if}
	</div>

	{#if data.error}
		<p class="text-sm text-gold">{data.error}</p>
	{:else if result}
		{#if result.records.length > 0}
			<div>
				<table class="w-full text-sm">
					<thead>
						<tr class="text-left text-xs uppercase tracking-wider text-gold">
							<th class="px-2.5 py-1">#</th>
							<th class="px-2.5 py-1">{m.leaderboard_player()}</th>
							<th class="px-2.5 py-1">{m.leaderboard_matches_played()}</th>
							<th class="px-2.5 py-1">{m.leaderboard_points()}</th>
							<th class="px-2.5 py-1">{m.leaderboard_win_rate()}</th>
						</tr>
					</thead>
					<tbody>
						{#each result.records as player, index (player.id)}
							{@const matches = (player.stats?.wins ?? 0) + (player.stats?.losses ?? 0)}
							{@const rank = (data.page - 1) * data.size + index + 1}
							<tr class={index > 0 ? 'border-t border-divider' : ''}>
								<td class="px-2.5 py-1 font-bold">#{rank}</td>
								<td class="px-2.5 py-1">
									<PlayerLink
										playerId={player.id}
										name={player.steam_name}
										avatarUrl={player.steam_avatar_url}
										country={player.country}
									/>
								</td>
								<td class="px-2.5 py-1">{matches}</td>
								<td class="px-2.5 py-1">
									{Math.round(player.stats?.points ?? 0).toLocaleString()}
								</td>
								<td class="px-2.5 py-1">{formatPercent(player.stats?.wins ?? 0, matches)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<Pagination
				page={data.page}
				pageSize={data.size}
				total={result.total}
				hrefFor={(nextPage) => buildHref({ page: nextPage })}
				showRange={false}
			/>
		{:else}
			<p>{m.leaderboard_no_data()}</p>
		{/if}
	{:else}
		<p>{m.leaderboard_no_data()}</p>
	{/if}
</Card>
