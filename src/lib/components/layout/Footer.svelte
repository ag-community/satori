<script lang="ts">
	import { PUBLIC_REPO_URL } from '$app/env/public';
	import { m } from '#lib/paraglide/messages.js';

	const year = new Date().getUTCFullYear();
	let { repoUrl = PUBLIC_REPO_URL }: { repoUrl?: string } = $props();
</script>

<footer
	class="raised-panel bevel-raised mx-auto mt-5 w-full max-w-(--layout-max) px-2.5 py-2.5 text-center text-xs text-text/80"
>
	<p>
		{m.footer_made_by()} <b>7mochi</b>
		· {m.footer_based_on()}
		<a
			href="https://github.com/leonill007/vgui.css"
			target="_blank"
			rel="noreferrer"
			class="text-gold hover:underline">vgui.css</a
		>
	</p>
	{#if repoUrl}
		<p class="mt-1.5">
			{year} ·
			<a href={repoUrl} target="_blank" rel="noreferrer" class="text-gold hover:underline">
				{m.home_open_source_github()}
			</a>
		</p>
	{/if}
</footer>
