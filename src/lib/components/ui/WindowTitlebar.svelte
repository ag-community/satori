<script lang="ts">
	import { dragHandle as dndDragHandle } from 'svelte-dnd-action';
	import { untrack } from 'svelte';
	import { getTheme } from '#lib/theme/theme.svelte.js';

	let {
		title,
		onMinimize,
		dragHandle = false,
	}: { title: string; onMinimize?: () => void; dragHandle?: boolean } = $props();

	const isGrey = $derived(getTheme() === 'greysteam');
	const minimizeIcon = $derived(isGrey ? '/images/minimize-grey.png' : '/images/minimize.png');
	const closeIcon = $derived(isGrey ? '/images/close-grey.png' : '/images/close.png');

	function noopAction() {
		return {};
	}

	const handleAction = untrack(() => (dragHandle ? dndDragHandle : noopAction));
</script>

<div class="window-titlebar" class:window-titlebar-grey={isGrey}>
	<span class="window-titlebar-drag" use:handleAction>{title}</span>
	<button
		type="button"
		class="window-titlebar-control"
		style={`right: 20px; background-image: url(${minimizeIcon})`}
		aria-label="Minimize"
		onclick={onMinimize}
	></button>
	<button
		type="button"
		class="window-titlebar-control"
		style={`right: 0; background-image: url(${closeIcon})`}
		aria-label="Close"
		disabled
	></button>
</div>
