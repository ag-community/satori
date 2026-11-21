<script lang="ts">
	import MatchHistory from '#lib/components/MatchHistory.svelte';
	import PointsChart from '#lib/components/PointsChart.svelte';
	import SeasonSelector from '#lib/components/SeasonSelector.svelte';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import SortableSections from '#lib/components/ui/SortableSections.svelte';
	import StatCard from '#lib/components/ui/StatCard.svelte';
	import { getCountryName } from '#lib/countries.js';
	import { formatPercent, formatRating } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const player = $derived(data.player);
	const stats = $derived(player?.stats ?? null);
	const matches = $derived((stats?.wins ?? 0) + (stats?.losses ?? 0));
	const kd = $derived(
		(stats?.total_deaths ?? 0) > 0
			? ((stats?.total_frags ?? 0) / (stats?.total_deaths ?? 1)).toFixed(2)
			: (stats?.total_frags ?? 0).toFixed(2),
	);
	const avgFrags = $derived(
		matches > 0 ? ((stats?.total_frags ?? 0) / matches).toFixed(2) : '0',
	);
	const countryName = $derived(
		player ? getCountryName(player.country.toUpperCase(), getLocale()) : '',
	);
</script>

<svelte:head>
	<title>
		{player ? m.title_player({ playerName: player.steam_name }) : m.title_not_found()}
	</title>
</svelte:head>

{#if data.invalidId}
	<Card>
		<p>{m.player_must_provide_id()}</p>
	</Card>
{:else if data.error}
	<Card>
		<p class="text-gold">{data.error}</p>
	</Card>
{:else if !player}
	<Card>
		<p>{m.player_not_found()}</p>
	</Card>
{:else}
	<Card>
		<div class="flex flex-wrap items-center gap-4">
			<Avatar url={player.steam_avatar_url} alt={player.steam_name} size={64} />
			<div>
				<h1 class="text-2xl font-bold">{player.steam_name}</h1>
				<p>
					{m.player_steam_id()} <b>{player.steam_id}</b>
					<Flag countryCode={player.country} />
				</p>
				<p>
					{m.leaderboard_points()}: <b>{formatRating(stats?.points)}</b>
					{#if player.global_rank}
						<span class="ml-3">#{player.global_rank} {m.player_global_rank()}</span>
					{/if}
					{#if player.country_rank}
						<span class="ml-3">#{player.country_rank} {countryName}</span>
					{/if}
				</p>
			</div>
			{#if data.season !== undefined}
				<div class="ml-auto">
					<SeasonSelector seasons={data.seasons} value={data.season} />
				</div>
			{/if}
		</div>
	</Card>

	{#snippet pointsProgression()}
		<PointsChart history={data.history} />
	{/snippet}

	{#snippet statistics()}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<StatCard label={m.player_matches_played()} value={String(matches)} />
			<StatCard label={m.player_wins()} value={String(stats?.wins ?? 0)} />
			<StatCard label={m.player_losses()} value={String(stats?.losses ?? 0)} />
			<StatCard
				label={m.player_win_rate()}
				value={formatPercent(stats?.wins ?? 0, matches)}
			/>
			<StatCard label={m.player_total_frags()} value={String(stats?.total_frags ?? 0)} />
			<StatCard label={m.player_total_deaths()} value={String(stats?.total_deaths ?? 0)} />
			<StatCard label={m.player_kd_ratio()} value={kd} />
			<StatCard label={m.player_avg_frags_per_match()} value={avgFrags} />
		</div>
	{/snippet}

	{#snippet matchHistory()}
		<MatchHistory
			matches={data.matches}
			currentPage={data.matchesPage}
			pageSize={data.matchesPageSize}
		/>
	{/snippet}

	<SortableSections
		initialOrder={['points_progression', 'statistics', 'match_history']}
		sections={[
			{
				id: 'points_progression',
				title: m.player_points_progression(),
				content: pointsProgression,
			},
			{ id: 'statistics', title: m.player_statistics(), content: statistics },
			{ id: 'match_history', title: m.player_match_history(), content: matchHistory },
		]}
	/>
{/if}
