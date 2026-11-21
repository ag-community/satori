<script lang="ts">
	import { flip } from 'svelte/animate';
	import {
		dragHandleZone,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
		type DndEvent,
	} from 'svelte-dnd-action';
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';

	export interface SectionDef {
		id: string;
		title?: string;
		variant?: 'raised' | 'sunken';
		content: Snippet;
		[key: string]: unknown;
	}

	let {
		sections,
		initialOrder,
	}: { sections: SectionDef[]; initialOrder?: readonly string[] } = $props();

	const flipDurationMs = 200;

	let items = $state<SectionDef[]>(
		(() => {
			const byId = new Map(sections.map((section) => [section.id, section]));
			const ids = initialOrder ? [...initialOrder] : sections.map((section) => section.id);
			return ids
				.map((id) => byId.get(id))
				.filter((section): section is SectionDef => section !== undefined);
		})(),
	);

	function handleDnd(event: CustomEvent<DndEvent<SectionDef>>): void {
		items = event.detail.items;
	}
</script>

<section
	use:dragHandleZone={{
		items,
		flipDurationMs,
		dropTargetStyle: {},
		dropTargetClasses: ['dnd-zone-active'],
		useCursorForDetection: true,
	}}
	onconsider={handleDnd}
	onfinalize={handleDnd}
	aria-label="Sections"
>
	{#each items as section (section.id)}
		<div
			animate:flip={{ duration: flipDurationMs }}
			class:dnd-shadow={Boolean(section[SHADOW_ITEM_MARKER_PROPERTY_NAME])}
			aria-label={section.title ?? section.id}
		>
			<Card title={section.title} variant={section.variant} dragHandle={true}>
				{@render section.content()}
			</Card>
		</div>
	{/each}
</section>
