<script lang="ts">
	import type { StatsWeekdayDto } from '#lib/api/types.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';

	let { weekdays }: { weekdays: StatsWeekdayDto[] } = $props();

	const labels = $derived(
		Array.from({ length: 7 }, (_, index) =>
			new Intl.DateTimeFormat(getLocale() === 'br' ? 'pt-BR' : getLocale(), {
				weekday: 'short',
			}).format(new Date(2024, 0, 7 + index)),
		),
	);
	const days = $derived(
		Array.from({ length: 7 }, (_, index) => ({
			day: index + 1,
			games: weekdays.find((entry) => entry.day === index + 1)?.games ?? 0,
		})),
	);
	const max = $derived(Math.max(...days.map((entry) => entry.games), 1));
</script>

<div class="space-y-2">
	{#each days as entry (entry.day)}
		<div class="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 text-xs">
			<span>{labels[entry.day - 1]}</span>
			<div class="h-3 bg-surface-lighter">
				<div
					class="h-full bg-gold"
					style={`width: ${Math.max((entry.games / max) * 100, 2)}%`}
				></div>
			</div>
			<span class="text-right">{entry.games.toLocaleString()}</span>
		</div>
	{/each}
</div>
<p class="mt-1 text-right text-xs">{m.stats_weekdays_games()}</p>
