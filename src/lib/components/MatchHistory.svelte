<script lang="ts">
	import { page } from '$app/state';
	import type { PageResult, PlayerMatchDto } from '#lib/types.js';
	import Card from '#lib/components/ui/Card.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { formatDate, formatDelta, formatRating } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';

	let {
		matches,
		currentPage,
		pageSize,
	}: {
		matches: PageResult<PlayerMatchDto> | null;
		currentPage: number;
		pageSize: number;
	} = $props();

	function hrefFor(target: number): string {
		const url = new URL(page.url.href);
		url.searchParams.set('page', String(target));

		return `${url.pathname}${url.search}`;
	}

	function resultLabel(match: PlayerMatchDto): string {
		if (match.unranked) return 'N/A';

		return match.won ? m.match_won() : m.match_lost();
	}
</script>

{#snippet unrankedBadge()}
	<span class="ml-1 border border-divider px-1 text-[11px] uppercase">
		{m.match_unranked()}
	</span>
{/snippet}

{#snippet pointsCell(match: PlayerMatchDto)}
	{#if match.unranked}
		N/A
	{:else}
		{formatRating(match.points_after_match)}
		{#if match.points_delta !== 0}
			<span class="ml-1.5 {match.points_delta > 0 ? 'text-gold-bright' : 'text-error'}">
				({formatDelta(match.points_delta)})
			</span>
		{/if}
	{/if}
{/snippet}

{#if !matches || matches.records.length === 0}
	<p>{m.player_no_matches()}</p>
{:else}
	<div class="flex flex-col sm:hidden">
		{#each matches.records as match (match.id)}
			<a href={`/game/${match.id}`} class="block">
				<Card variant="sunken">
					<div class="flex flex-wrap">
						<span class="font-bold">{match.map_name}</span>
						{#if match.unranked}
							{@render unrankedBadge()}
						{/if}
						<span
							class="ml-auto {match.unranked
								? ''
								: match.won
									? 'text-gold-bright'
									: 'text-error'}"
						>
							{resultLabel(match)}
						</span>
					</div>
					<p class="mt-2 text-xs">
						{m.player_date()}: <b>{formatDate(match.date)}</b> | {m.match_frags()}: <b
							>{match.frags}</b
						> | {m.match_deaths()}: <b>{match.deaths}</b>
					</p>
					<p class="mt-1 text-xs">
						{m.match_points()}: <b>{@render pointsCell(match)}</b>
					</p>
				</Card>
			</a>
		{/each}
	</div>

	<div class="hidden sm:block">
		<table class="w-full text-sm">
			<thead>
				<tr class="text-left text-xs uppercase tracking-wider text-gold">
					<th class="px-2.5 py-1">{m.player_date()}</th>
					<th class="px-2.5 py-1">{m.player_map()}</th>
					<th class="px-2.5 py-1">{m.match_result()}</th>
					<th class="px-2.5 py-1">{m.match_frags()}</th>
					<th class="px-2.5 py-1">{m.match_deaths()}</th>
					<th class="px-2.5 py-1">{m.match_points()}</th>
				</tr>
			</thead>
			<tbody>
				{#each matches.records as match, index (match.id)}
					<tr class={index > 0 ? 'border-t border-divider' : ''}>
						<td class="px-2.5 py-1">{formatDate(match.date)}</td>
						<td class="px-2.5 py-1">
							<a
								href={`/game/${match.id}`}
								class="font-bold text-gold hover:underline"
							>
								{match.map_name}
							</a>
							{#if match.unranked}
								{@render unrankedBadge()}
							{/if}
						</td>
						<td
							class="px-2.5 py-1 {match.unranked
								? ''
								: match.won
									? 'text-gold-bright'
									: 'text-error'}"
						>
							{resultLabel(match)}
						</td>
						<td class="px-2.5 py-1">{match.frags}</td>
						<td class="px-2.5 py-1">{match.deaths}</td>
						<td class="px-2.5 py-1">
							{@render pointsCell(match)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<Pagination page={currentPage} {pageSize} total={matches.total} {hrefFor} />
{/if}
