<script lang="ts">
	import { onMount } from 'svelte';
	import '#lib/styles/global.css';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Navbar from '#lib/components/layout/Navbar.svelte';
	import { initTheme } from '#lib/theme/theme.svelte.js';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	onMount(() => initTheme());
</script>

<div class="flex min-h-screen flex-col p-5">
	<Navbar user={data.user} />
	<main class="mx-auto w-full max-w-(--layout-max) flex-1 px-3 sm:px-0">
		{@render children()}
	</main>
	<Footer />
</div>
