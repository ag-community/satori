<script lang="ts">
	import PlayerLink from '#lib/components/PlayerLink.svelte';
	import SeasonSelector from '#lib/components/SeasonSelector.svelte';
	import MonthlyActivityChart from '#lib/components/charts/stats/MonthlyActivityChart.svelte';
	import PointsDistributionChart from '#lib/components/charts/stats/PointsDistributionChart.svelte';
	import WeekdayActivityChart from '#lib/components/charts/stats/WeekdayActivityChart.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import SortableSections from '#lib/components/ui/SortableSections.svelte';
	import StatCard from '#lib/components/ui/StatCard.svelte';
	import { getCountryName } from '#lib/countries.js';
	import { formatDate, formatRating } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const stats = $derived(data.stats);
</script>

<svelte:head>
	<title>{m.title_stats()}</title>
</svelte:head>

{#snippet summary()}
	{#if stats}
	<p class="mb-3">{m.stats_description()}</p>

	{#if data.season !== undefined && data.seasons.length > 1}
		<div class="mb-3">
			<SeasonSelector seasons={data.seasons} value={data.season} />
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
		<StatCard
			label={m.stats_summary_total_players()}
			value={stats.summary.total_players.toLocaleString()}
		/>
		<StatCard
			label={m.stats_summary_ranked_players()}
			value={stats.summary.ranked_players.toLocaleString()}
		/>
		<StatCard
			label={m.stats_summary_ranked_games()}
			value={stats.summary.ranked_games.toLocaleString()}
		/>
		<StatCard
			label={m.stats_summary_total_frags()}
			value={stats.summary.total_frags.toLocaleString()}
		/>
		<StatCard
			label={m.stats_summary_total_deaths()}
			value={stats.summary.total_deaths.toLocaleString()}
		/>
		<StatCard
			label={m.stats_summary_average_frags()}
			value={stats.summary.average_frags.toFixed(2)}
		/>
		<StatCard
			label={m.stats_summary_maps_played()}
			value={stats.summary.maps_played.toLocaleString()}
		/>
	</div>
	{/if}
{/snippet}

{#snippet activity()}
	{#if stats}
	{#if stats.activity.length === 0}
		<p>{m.stats_no_data()}</p>
	{:else}
		<MonthlyActivityChart activity={stats.activity} />
	{/if}
	{/if}
{/snippet}

{#snippet pointsDistribution()}
	{#if stats}
	{#if stats.points_distribution.length === 0}
		<p>{m.stats_no_data()}</p>
	{:else}
		<PointsDistributionChart buckets={stats.points_distribution} />
	{/if}
	{/if}
{/snippet}

{#snippet weekdayActivity()}
	{#if stats}
	{#if stats.weekdays.length === 0}
		<p>{m.stats_no_data()}</p>
	{:else}
		<WeekdayActivityChart weekdays={stats.weekdays} />
	{/if}
	{/if}
{/snippet}

{#snippet matchRecord()}
	{#if stats}
	{#if stats.best_frag_game}
		<p class="mb-2 text-sm">{m.stats_record_desc()}</p>
		<PlayerLink
			playerId={stats.best_frag_game.player_id}
			name={stats.best_frag_game.steam_name}
			avatarUrl={stats.best_frag_game.steam_avatar_url}
			country={stats.best_frag_game.country}
		/>
		<p class="mt-2 text-sm">
			<b>{stats.best_frag_game.frags}</b>
			{m.stats_record_frags()}
			·
			<a href={`/game/${stats.best_frag_game.game_id}`} class="text-gold hover:underline">
				{stats.best_frag_game.map_name}
			</a>
			· {formatDate(stats.best_frag_game.date)}
		</p>
	{:else}
		<p>{m.stats_no_data()}</p>
	{/if}
	{/if}
{/snippet}

{#snippet maps()}
	{#if stats}
	{#if stats.maps.length === 0}
		<p>{m.stats_no_data()}</p>
	{:else}
		<table class="w-full sm:text-sm">
			<thead>
				<tr class="text-left uppercase tracking-wider text-gold sm:text-xs">
					<th class="px-1.5 py-1">{m.stats_maps_map()}</th>
					<th class="px-1.5 py-1">{m.stats_maps_matches()}</th>
					<th class="px-1.5 py-1">{m.stats_maps_average_frags()}</th>
				</tr>
			</thead>
			<tbody>
				{#each stats.maps as map, index (map.map_name)}
					<tr class={index > 0 ? 'border-t border-divider' : ''}>
						<td class="px-1.5 py-1">{map.map_name}</td>
						<td class="px-1.5 py-1">{map.games.toLocaleString()}</td>
						<td class="px-1.5 py-1">{map.average_frags.toFixed(1)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	{/if}
{/snippet}

{#snippet countries()}
	{#if stats}
	{#if stats.countries.length === 0}
		<p>{m.stats_no_data()}</p>
	{:else}
		<table class="w-full text-sm">
			<thead>
				<tr class="text-left text-xs uppercase tracking-wider text-gold">
					<th class="px-2.5 py-1">{m.stats_countries_country()}</th>
					<th class="px-2.5 py-1">{m.stats_countries_players()}</th>
					<th class="px-2.5 py-1">{m.stats_countries_ranked_players()}</th>
					<th class="px-2.5 py-1">{m.stats_countries_average_points()}</th>
				</tr>
			</thead>
			<tbody>
				{#each stats.countries as country, index (country.country)}
					<tr class={index > 0 ? 'border-t border-divider' : ''}>
						<td class="px-2.5 py-1">
							<span class="flex items-center gap-2">
								<Flag countryCode={country.country} />
								{getCountryName(country.country.toUpperCase(), getLocale())}
							</span>
						</td>
						<td class="px-2.5 py-1">{country.players.toLocaleString()}</td>
						<td class="px-2.5 py-1">{country.ranked_players.toLocaleString()}</td>
						<td class="px-2.5 py-1">{formatRating(country.average_points)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	{/if}
{/snippet}

{#if data.error}
	<Card title={m.stats_title()}>
		<p class="text-sm text-gold">{data.error}</p>
	</Card>
{:else if stats}
	<SortableSections
		class="grid gap-3 lg:grid-cols-2"
		initialOrder={[
			'summary',
			'activity',
			'points',
			'weekdays',
			'record',
			'maps',
			'countries',
		]}
		sections={[
			{
				id: 'summary',
				title: m.stats_title(),
				className: 'lg:col-span-2',
				fullHeight: true,
				content: summary,
			},
			{
				id: 'activity',
				title: m.stats_activity_title(),
				fullHeight: true,
				content: activity,
			},
			{
				id: 'points',
				title: m.stats_points_distribution_title(),
				fullHeight: true,
				content: pointsDistribution,
			},
			{
				id: 'weekdays',
				title: m.stats_weekdays_title(),
				fullHeight: true,
				content: weekdayActivity,
			},
			{
				id: 'record',
				title: m.stats_record_title(),
				fullHeight: true,
				content: matchRecord,
			},
			{
				id: 'maps',
				title: m.stats_maps_title(),
				className: 'lg:col-span-2',
				fullHeight: true,
				content: maps,
			},
			{
				id: 'countries',
				title: m.stats_countries_title(),
				className: 'lg:col-span-2',
				fullHeight: true,
				content: countries,
			},
		]}
	/>
{:else}
	<Card title={m.stats_title()}>
		<p>{m.stats_no_data()}</p>
	</Card>
{/if}
