<script lang="ts">
	import {
		Chart,
		type ChartConfiguration,
		type ChartData,
		type ChartOptions,
		type ChartType,
	} from 'chart.js';
	import { onMount } from 'svelte';
	import '#lib/chartjs.js';

	let {
		type,
		data,
		options,
		height = 240,
	}: {
		type: ChartType;
		data: ChartData;
		options: ChartOptions;
		height?: number;
	} = $props();

	let canvas = $state<HTMLCanvasElement>();
	let chart: Chart | undefined;

	onMount(() => {
		if (!canvas) return;

		chart = new Chart(canvas, { type, data, options } as ChartConfiguration);

		return () => {
			chart?.destroy();
			chart = undefined;
		};
	});

	$effect(() => {
		if (!chart) return;

		chart.data = data;
		chart.options = options;
		chart.update();
	});
</script>

<div style={`height:${height}px`}>
	<canvas bind:this={canvas}></canvas>
</div>
