<script lang="ts">
	import MatchTeam from '#lib/components/MatchTeam.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import { formatDate } from '#lib/format.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const game = $derived(data.game);
	const blue = $derived(game?.details.teams[0]?.players ?? []);
	const red = $derived(game?.details.teams[1]?.players ?? []);
	const winners = $derived.by(() => {
		const blueFrags = blue.reduce((sum, player) => sum + player.frags, 0);
		const redFrags = red.reduce((sum, player) => sum + player.frags, 0);
		return {
			blue: blueFrags > redFrags,
			red: redFrags > blueFrags,
		};
	});
</script>

<svelte:head>
	<title>{game ? m.title_match({ matchId: String(game.id) }) : m.title_not_found()}</title>
</svelte:head>

{#if data.invalidId}
	<Card>
		<p>{m.match_must_provide_id()}</p>
	</Card>
{:else if data.error}
	<Card>
		<p class="text-gold">{data.error}</p>
	</Card>
{:else if !game}
	<Card>
		<p>{m.common_not_found()}</p>
	</Card>
{:else}
	<Card>
		<div class="relative sm:min-h-25 sm:px-4 sm:py-4">
			<div
				class="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
				style={`background-image: url(/images/map_banners/${game.map_name}.jpg)`}
			></div>
			<div class="relative">
				<h2 class="font-bold sm:text-2xl">
					{m.match_match_on({ matchType: game.match_type, mapName: game.map_name })}
				</h2>
				<p class="mt-1">
					{formatDate(game.date)} | {m.match_server()}: {game.server_ip}
				</p>
			</div>
		</div>

		{#if game.unranked}
			<p class="my-2 text-center text-error">{m.match_unranked_banner()}</p>
		{/if}

		<MatchTeam
			teamName={m.match_blue_team()}
			isWinner={winners.blue}
			players={blue}
			unranked={game.unranked}
		/>
		<MatchTeam
			teamName={m.match_red_team()}
			isWinner={winners.red}
			players={red}
			unranked={game.unranked}
		/>
	</Card>
{/if}
