<script lang="ts">
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';

	let { redirectTo }: { redirectTo?: string } = $props();

	const target = $derived(redirectTo ?? `${page.url.pathname}${page.url.search}`);
	const href = $derived(`/api/auth/steam?redirect=${encodeURIComponent(target)}`);
</script>

<a
	{href}
	class="flex items-center gap-1.5 px-1.5 py-1 text-sm transition-colors hover:bg-surface-lighter hover:text-gold"
	title={m.auth_sign_in()}
>
	<img src="/images/steamico.png" alt="" class="h-4 w-4" />
	<span>{m.auth_sign_in()}</span>
</a>
