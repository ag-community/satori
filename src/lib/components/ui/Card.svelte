<script lang="ts">
	import type { Snippet } from 'svelte';
	import WindowTitlebar from './WindowTitlebar.svelte';

	let {
		title,
		variant = 'raised',
		dragHandle = false,
		fullHeight = false,
		children,
	}: {
		title?: string;
		variant?: 'raised' | 'sunken';
		dragHandle?: boolean;
		fullHeight?: boolean;
		children: Snippet;
	} = $props();

	let collapsed = $state(false);
</script>

<div
	class="card {variant === 'sunken'
		? 'inset-panel bevel-sunken'
		: 'raised-panel bevel-raised'} {fullHeight ? 'h-full' : ''}"
	style="border-radius: var(--radius-skin)"
>
	{#if title !== undefined}
		<WindowTitlebar {title} {dragHandle} onMinimize={() => (collapsed = !collapsed)} />
	{/if}
	{#if !collapsed}
		{@render children()}
	{/if}
</div>
