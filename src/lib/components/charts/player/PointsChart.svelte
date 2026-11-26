<script lang="ts">
	import type { ChartData, ChartOptions } from 'chart.js';
	import Chart from '#lib/components/charts/Chart.svelte';
	import type { RatingHistoryDto } from '#lib/types.js';
	import {
		DEFAULT_CHART_COLORS,
		type ChartColors,
		resolveChartColors,
	} from '#lib/chartjs.js';
	import { formatShortDate } from '#lib/format.js';
	import { getTheme } from '#lib/theme/theme.svelte.js';

	let { history }: { history: RatingHistoryDto[] } = $props();

	let colors = $state<ChartColors>(DEFAULT_CHART_COLORS);
	const theme = $derived(getTheme());

	$effect(() => {
		theme;
		colors = resolveChartColors();
	});

	const chartLabels = $derived(
		history.length === 1
			? [formatShortDate(history[0].captured_at), formatShortDate(history[0].captured_at)]
			: history.map((capture) => formatShortDate(capture.captured_at)),
	);
	const chartPoints = $derived(
		history.length === 1 ? [history[0].points, history[0].points] : history.map((c) => c.points),
	);

	const data = $derived<ChartData>({
		labels: chartLabels,
		datasets: [
			{
				data: chartPoints,
				borderColor: colors.primary,
				fill: false,
				tension: 0.5,
				borderWidth: 3,
				pointRadius: 0,
			},
		],
	});

	const options = $derived<ChartOptions>({
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				ticks: { color: colors.text, maxTicksLimit: 8 },
				grid: { color: colors.grid },
			},
			y: {
				ticks: { color: colors.text, precision: 0 },
				grid: { color: colors.grid },
			},
		},
		plugins: {
			legend: { display: false },
			tooltip: { intersect: false, mode: 'index' as const },
		},
	});
</script>

{#if history.length === 0}
	<p>No points data available</p>
{:else}
	<Chart type="line" {data} {options} />
{/if}
