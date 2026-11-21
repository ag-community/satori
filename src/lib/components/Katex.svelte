<script lang="ts">
	import katex from 'katex';

	let { math, displayMode = true }: { math: string; displayMode?: boolean } = $props();

	const html = $derived(katex.renderToString(math, { displayMode, throwOnError: false }));
</script>

<div class="overflow-x-auto">{@html html}</div>
