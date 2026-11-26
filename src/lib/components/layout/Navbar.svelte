<script lang="ts">
	import { page } from '$app/state';
	import type { AuthUserDto } from '#lib/types.js';
	import { m } from '#lib/paraglide/messages.js';
	import LanguageSelector from './LanguageSelector.svelte';
	import PlayerSearch from './PlayerSearch.svelte';
	import SteamLoginButton from './SteamLoginButton.svelte';
	import ThemeSelector from './ThemeSelector.svelte';
	import UserMenu from './UserMenu.svelte';

	let { user = null }: { user?: AuthUserDto | null } = $props();

	const links = [
		{ href: '/', label: () => m.navbar_home(), end: true },
		{ href: '/leaderboard', label: () => m.navbar_leaderboard(), end: false },
		{ href: '/stats', label: () => m.navbar_stats(), end: false },
		{ href: '/docs', label: () => m.navbar_docs(), end: false },
	];

	let mobileOpen = $state(false);
	const path = $derived(page.url.pathname);

	function isActive(href: string, end: boolean): boolean {
		return end ? path === href : path === href || path.startsWith(`${href}/`);
	}
</script>

<nav
	class="raised-panel bevel-raised mx-auto mb-5 flex w-full max-w-(--layout-max) flex-nowrap items-center gap-1"
>
	<a href="/" class="shrink-0 px-2 py-1.5">
		<img src="/images/ag_logo_blue.png" alt="Adrenaline Gamer" class="block h-6.5 w-auto" />
	</a>

	<div class="hidden shrink-0 nav:flex">
		{#each links as link (link.href)}
			<a
				href={link.href}
				class="block px-1.5 py-1.5 text-sm transition-colors hover:bg-surface-lighter hover:text-gold"
				class:text-gold={isActive(link.href, link.end)}
				class:font-bold={isActive(link.href, link.end)}
			>
				{link.label()}
			</a>
		{/each}
	</div>

	<div class="flex-1"></div>

	<div class="flex shrink-0 items-center gap-1 px-1">
		<div class="hidden nav:block nav:w-28">
			<PlayerSearch />
		</div>
		<div class="hidden nav:flex nav:gap-1">
			<ThemeSelector />
			<LanguageSelector />
		</div>
		{#if user}
			<UserMenu {user} />
		{:else}
			<SteamLoginButton />
		{/if}
	</div>

	<button
		type="button"
		class="shrink-0 py-1.5 text-lg leading-none nav:hidden"
		aria-label="Menu"
		aria-expanded={mobileOpen}
		onclick={() => (mobileOpen = !mobileOpen)}
	>
		{mobileOpen ? '✕' : '☰'}
	</button>
</nav>

{#if mobileOpen}
	<div
		class="raised-panel bevel-raised mx-auto mb-5 flex w-full max-w-(--layout-max) flex-col nav:hidden"
	>
		{#each links as link (link.href)}
			<a
				href={link.href}
				class="px-3 py-2 hover:bg-surface-lighter active:bg-surface-lighter"
				class:text-gold={isActive(link.href, link.end)}
				onclick={() => (mobileOpen = false)}
			>
				{link.label()}
			</a>
		{/each}

		<div class="px-2 py-2">
			<PlayerSearch />
		</div>

		<div class="flex gap-1 px-2 pb-2">
			<ThemeSelector />
			<LanguageSelector />
		</div>
	</div>
{/if}
