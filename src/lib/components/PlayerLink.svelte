<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';

	let {
		playerId,
		name,
		avatarUrl,
		country,
		size = 24,
		children,
	}: {
		playerId: number;
		name: string;
		avatarUrl?: string | null;
		country?: string;
		size?: number;
		children?: Snippet;
	} = $props();
</script>

<a
	href={`/player/${playerId}`}
	class="flex items-center gap-2 hover:text-gold"
>
	<Avatar url={avatarUrl} alt={name} {size} />
	<span class="truncate">{name}</span>
	{#if country}
		<Flag countryCode={country} />
	{/if}
	{@render children?.()}
</a>
