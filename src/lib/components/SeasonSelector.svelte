<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { SeasonDto } from '#lib/types.js';
	import Select from '#lib/components/ui/Select.svelte';
	import { m } from '#lib/paraglide/messages.js';

	let { seasons, value }: { seasons: SeasonDto[]; value: number } = $props();

	const options = $derived(
		seasons.map((season) => ({
			value: season.id,
			label: `${season.name}${season.is_active ? ` ${m.season_active()}` : ''}`,
		})),
	);

	function change(season: string | number): void {
		const url = new URL(page.url.href);
		url.searchParams.set('season', String(season));
		url.searchParams.delete('page');
		void goto(url);
	}
</script>

<label class="flex flex-col gap-1 text-xs">
	{m.season_select()}
	<Select
		value={value}
		options={options}
		label={m.season_select()}
		minWidth={170}
		onSelect={change}
	/>
</label>
