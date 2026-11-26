<script lang="ts">
	import Select from '#lib/components/ui/Select.svelte';
	import { getLocale, locales, setLocale } from '#lib/paraglide/runtime.js';

	const current = $derived(getLocale());
	const options = locales.map((locale) => ({ value: locale, label: locale.toUpperCase() }));
</script>

<Select
	value={current}
	{options}
	label="Language"
	minWidth={50}
	onSelect={(value) => void setLocale(value as (typeof locales)[number])}
/>
