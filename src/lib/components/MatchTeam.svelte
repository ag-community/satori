<script lang="ts">
	import PlayerLink from '#lib/components/PlayerLink.svelte';
	import type { GameDetailPlayerDto } from '#lib/api/types.js';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import { formatDelta, formatRating } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';

	let {
		teamName,
		isWinner,
		players,
		unranked,
	}: {
		teamName: string;
		isWinner: boolean;
		players: GameDetailPlayerDto[];
		unranked: boolean;
	} = $props();

	const sorted = $derived([...players].sort((a, b) => b.frags - a.frags));
	const totalFrags = $derived(players.reduce((sum, player) => sum + player.frags, 0));
	const totalDeaths = $derived(players.reduce((sum, player) => sum + player.deaths, 0));
</script>

{#snippet pointsCell(player: GameDetailPlayerDto)}
	{#if unranked}
		N/A
	{:else}
		{formatRating(player.points_after_match)}
		{#if player.points_delta !== 0}
			<span class="ml-1.5 {player.points_delta > 0 ? 'text-gold-bright' : 'text-error'}">
				({formatDelta(player.points_delta)})
			</span>
		{/if}
	{/if}
{/snippet}

<div class="mt-4 p-3 {isWinner ? 'border border-gold' : ''}">
	<div class="mb-2.5 flex flex-wrap items-center gap-3">
		<h3 class="text-xl font-bold {isWinner ? 'text-gold' : ''}">{teamName}</h3>
		{#if isWinner}
			<span class="font-bold text-gold">{m.match_winner()}</span>
		{/if}
		<span class="ml-auto">
			{m.match_total_frags()}: <b>{totalFrags}</b> | {m.match_total_deaths()}: <b
				>{totalDeaths}</b
			>
		</span>
	</div>

	<div class="flex flex-col sm:hidden">
		{#each sorted as player (player.player_id)}
			<Card variant="sunken">
				<div class="flex flex-wrap items-center gap-2.5">
					<Avatar url={player.steam_avatar_url} alt={player.steam_name} size={32} />
					<div>
						<a
							href={`/player/${player.player_id}`}
							class="font-bold text-gold hover:underline active:underline"
						>
							{player.steam_name}
						</a>
						<p class="text-xs">{player.steam_id}</p>
					</div>
					<span class="ml-auto">{@render pointsCell(player)}</span>
				</div>
				<p class="mt-2 text-xs">
					{m.match_frags()}: <b>{player.frags}</b> | {m.match_deaths()}: <b>{player.deaths}</b> |
					{m.match_avg_ping()}: <b>{player.average_ping}</b> |
					{m.match_damage_dealt()}: <b>{player.damage_dealt}</b> |
					{m.match_damage_taken()}: <b>{player.damage_taken}</b>
				</p>
			</Card>
		{/each}
	</div>

	<div class="hidden sm:block">
		<table class="">
			<thead>
				<tr class="text-left text-xs uppercase tracking-wider text-gold">
					<th class="px-2.5 py-1">#</th>
					<th class="px-2.5 py-1">{m.match_player()}</th>
					<th class="px-2.5 py-1">{m.match_frags()}</th>
					<th class="px-2.5 py-1">{m.match_deaths()}</th>
					<th class="px-2.5 py-1">{m.match_avg_ping()}</th>
					<th class="px-2.5 py-1">{m.match_damage_dealt()}</th>
					<th class="px-2.5 py-1">{m.match_damage_taken()}</th>
					<th class="px-2.5 py-1">{m.match_points()}</th>
				</tr>
			</thead>
			<tbody>
				{#each sorted as player, index (player.player_id)}
					<tr class={index > 0 ? 'border-t border-divider' : ''}>
						<td class="px-2.5 py-1">{index + 1}</td>
						<td class="px-2.5 py-1">
							<PlayerLink
								playerId={player.player_id}
								name={player.steam_name}
								avatarUrl={player.steam_avatar_url}
							/>
							<span class="block text-xs">{player.steam_id}</span>
						</td>
						<td class="px-2.5 py-1">{player.frags}</td>
						<td class="px-2.5 py-1">{player.deaths}</td>
						<td class="px-2.5 py-1">{player.average_ping}</td>
						<td class="px-2.5 py-1">{player.damage_dealt}</td>
						<td class="px-2.5 py-1">{player.damage_taken}</td>
						<td class="px-2.5 py-1">
							{@render pointsCell(player)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
