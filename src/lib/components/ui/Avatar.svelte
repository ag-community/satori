<script lang="ts">
	let {
		url,
		alt = '',
		size = 24,
	}: { url?: string | null; alt?: string; size?: number } = $props();
</script>

{#if url}
	<img
		src={url}
		{alt}
		width={size}
		height={size}
		loading="lazy"
		class="bevel-sunken"
		style={`border-radius: var(--radius-skin)`}
	/>
{:else}
	<span
		class="bevel-sunken bg-inset"
		style={`width:${size}px;height:${size}px;border-radius:var(--radius-skin)`}
	></span>
{/if}
