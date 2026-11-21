<script lang="ts">
	import { page } from '$app/state';
	import Card from '#lib/components/ui/Card.svelte';
	import { m } from '#lib/paraglide/messages.js';
</script>

<Card title="Error">
	<p class="m-0 mb-2">{page.status}: {page.error?.message ?? m.common_not_found()}</p>
	<a href="/" class="text-gold hover:underline">{m.common_back_home()}</a>
</Card>
