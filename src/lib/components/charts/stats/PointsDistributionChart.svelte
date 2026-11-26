<script lang="ts">
	import type { ChartData, ChartOptions } from 'chart.js';
	import Chart from '#lib/components/charts/Chart.svelte';
	import type { StatsPointsBucketDto } from '#lib/types.js';
	import {
		DEFAULT_CHART_COLORS,
		type ChartColors,
		resolveChartColors,
	} from '#lib/chartjs.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getTheme } from '#lib/theme/theme.svelte.js';

	let { buckets }: { buckets: StatsPointsBucketDto[] } = $props();

	let colors = $state<ChartColors>(DEFAULT_CHART_COLORS);
	const theme = $derived(getTheme());

	$effect(() => {
		theme;
		colors = resolveChartColors();
	});

	function bucketCenter(label: string): number {
		const [start, end] = label.replace('+', '').split('-').map(Number);
		return end ? (start + end) / 2 : start;
	}

	function shortLabel(label: string): string {
		return label.replace('1000-1499', '1k-1.5k').replace('1500+', '1.5k+');
	}

	const centers = $derived(buckets.map((bucket) => bucketCenter(bucket.label)));
	const counts = $derived(buckets.map((bucket) => bucket.players));
	const labels = $derived(buckets.map((bucket) => shortLabel(bucket.label)));

	const curve = $derived.by(() => {
		const maxCount = Math.max(...counts, 1);

		if (centers.length === 0) return [];

		const bandwidth = Math.max((Math.max(...centers) - Math.min(...centers)) / 8, 100);
		const density = centers.map((x) =>
			counts.reduce(
				(sum, count, index) =>
					sum + count * Math.exp(-0.5 * ((x - centers[index]) / bandwidth) ** 2),
				0,
			),
		);
		const maxDensity = Math.max(...density, 1);

		return density.map((value) => (value / maxDensity) * maxCount);
	});

	const data = $derived<ChartData>({
		labels,
		datasets: [
			{
				type: 'bar' as const,
				label: m.stats_chart_players(),
				data: counts,
				backgroundColor: colors.primary,
				borderColor: colors.primary,
				borderWidth: 0,
				borderRadius: 2,
				maxBarThickness: 32,
				order: 2,
			},
			{
				type: 'line' as const,
				label: m.stats_chart_trend(),
				data: curve,
				borderColor: colors.text,
				backgroundColor: colors.text,
				borderWidth: 2,
				tension: 0.4,
				pointRadius: 0,
				fill: false,
				order: 1,
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
				ticks: { color: colors.text, precision: 0 },
				grid: { color: colors.grid },
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
		{m.stats_chart_players()}
	</span>
	<span class="flex items-center gap-1">
		<span class="h-0.5 w-3" style={`background: ${colors.text}`}></span>
		{m.stats_chart_trend()}
	</span>
</div>

<Chart type="bar" {data} {options} />
