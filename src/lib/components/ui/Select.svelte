<script lang="ts">
	import { Select as BitsSelect } from 'bits-ui';

	let {
		value,
		options,
		onSelect,
		label,
		minWidth = 170,
	}: {
		value: string | number;
		options: { value: string | number; label: string }[];
		onSelect: (value: string | number) => void;
		label?: string;
		minWidth?: number;
	} = $props();

	const selected = $derived(options.find((option) => option.value === value));

	function handleValueChange(next: string): void {
		const option = options.find((option) => String(option.value) === next);
		if (option) onSelect(option.value);
	}
</script>

<div style={`min-width:${minWidth}px`}>
	<BitsSelect.Root
		type="single"
		value={String(value)}
		onValueChange={handleValueChange}
	>
		<BitsSelect.Trigger
		class="vgui-select flex w-full justify-between"
		aria-label={label}
	>
		<span class="truncate">{selected?.label ?? ''}</span>
		<span aria-hidden="true">▾</span>
	</BitsSelect.Trigger>

	<BitsSelect.Portal>
		<BitsSelect.Content
			class="raised-panel bevel-raised z-30 max-h-64"
			style="width: var(--bits-select-anchor-width);"
			sideOffset={4}
		>
			<BitsSelect.Viewport>
				{#each options as option (option.value)}
					<BitsSelect.Item
						value={String(option.value)}
						label={option.label}
						class="block cursor-pointer px-2 py-1 hover:bg-surface-lighter data-[highlighted]:bg-surface-lighter data-[selected]:bg-inset data-[selected]:font-bold data-[selected]:text-gold"
					>
						{option.label}
					</BitsSelect.Item>
				{/each}
			</BitsSelect.Viewport>
		</BitsSelect.Content>
		</BitsSelect.Portal>
	</BitsSelect.Root>
</div>
