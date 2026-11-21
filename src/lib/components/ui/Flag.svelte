<script lang="ts">
	import { getFlagUrl } from '#lib/countries.js';

	let { countryCode }: { countryCode?: string } = $props();
	const code = $derived(countryCode?.toUpperCase() || 'XX');
</script>

<img
	src={getFlagUrl(code)}
	alt={code}
	title={code}
	class="inline-block h-3.5"
	loading="lazy"
/>
