<script lang="ts">
	import Select from '#lib/components/ui/Select.svelte';
	import { THEMES, type ThemeName } from '#lib/theme/skins.js';
	import { getTheme, setTheme } from '#lib/theme/theme.svelte.js';

	const current = $derived(getTheme());
	const options = THEMES.map((theme) => ({ value: theme.value, label: theme.label }));
</script>

<Select
	value={current}
	{options}
	label="Theme"
	minWidth={110}
	onSelect={(value) => setTheme(value as ThemeName)}
/>
