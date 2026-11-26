<script lang="ts">
	import type { ChartData, ChartOptions } from 'chart.js';
	import Chart from '#lib/components/charts/Chart.svelte';
	import type { StatsActivityDto } from '#lib/types.js';
	import {
		DEFAULT_CHART_COLORS,
		type ChartColors,
		resolveChartColors,
	} from '#lib/chartjs.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getTheme } from '#lib/theme/theme.svelte.js';

	let { activity }: { activity: StatsActivityDto[] } = $props();

	let colors = $state<ChartColors>(DEFAULT_CHART_COLORS);
	const theme = $derived(getTheme());

	$effect(() => {
		theme;
		colors = resolveChartColors();
	});

	const labels = $derived(activity.map((point) => point.month.slice(2)));

	const data = $derived<ChartData>({
		labels,
		datasets: [
			{
				label: m.stats_chart_matches(),
				data: activity.map((point) => point.games),
				borderColor: colors.primary,
				fill: false,
				tension: 0.35,
				borderWidth: 2,
				pointRadius: 0,
				yAxisID: 'y',
			},
			{
				label: m.stats_chart_frags(),
				data: activity.map((point) => point.frags),
				borderColor: colors.text,
				fill: false,
				tension: 0.35,
				borderWidth: 2,
				pointRadius: 0,
				yAxisID: 'y1',
			},
		],
	});

	const options = $derived<ChartOptions>({
		responsive: true,
		maintainAspectRatio: false,
		interaction: { intersect: false, mode: 'index' as const },
		scales: {
			x: {
				ticks: { color: colors.text, maxTicksLimit: 8 },
				grid: { color: colors.grid },
			},
			y: {
				position: 'left',
				ticks: { color: colors.primary, precision: 0 },
				grid: { color: colors.grid },
			},
			y1: {
				position: 'right',
				ticks: { color: colors.text, precision: 0 },
				grid: { drawOnChartArea: false },
			},
		},
		plugins: {
			legend: { display: false },
		},
	});
</script>

<div class="mb-2 flex gap-3 text-xs">
	<span class="flex items-center gap-1">
		<span class="h-2 w-2 rounded-full" style={`background: ${colors.primary}`}></span>
		{m.stats_chart_matches()}
	</span>
	<span class="flex items-center gap-1">
		<span class="h-2 w-2 rounded-full" style={`background: ${colors.text}`}></span>
		{m.stats_chart_frags()}
	</span>
</div>

<Chart type="line" {data} {options} />
