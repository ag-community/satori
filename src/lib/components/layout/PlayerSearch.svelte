<script lang="ts">
	import { goto } from '$app/navigation';
	import { Combobox } from 'bits-ui';
	import { Debounced } from 'runed';
	import { searchPlayers } from '#lib/api/client.js';
	import type { PlayerDto } from '#lib/api/types.js';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import { m } from '#lib/paraglide/messages.js';

	let query = $state('');
	let results = $state<PlayerDto[]>([]);
	let open = $state(false);
	let loading = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);

	const debouncedQuery = new Debounced(() => query.trim(), 300);
	const pending = $derived(
		query.trim().length >= 2 && query.trim() !== debouncedQuery.current,
	);
	const items = $derived(
		results.map((player) => ({
			value: String(player.id),
			label: player.steam_name,
		})),
	);

	$effect(() => {
		if (inputEl && inputEl.value !== query) inputEl.value = query;
	});

	$effect(() => {
		const value = debouncedQuery.current;
		if (value.length < 2) {
			results = [];
			loading = false;
			return;
		}

		const controller = new AbortController();
		loading = true;

		void (async () => {
			try {
				results = await searchPlayers(value, controller.signal);
			} catch {
				if (!controller.signal.aborted) results = [];
			} finally {
				if (!controller.signal.aborted) loading = false;
			}
		})();

		return () => controller.abort();
	});

	function handleInput(event: Event & { currentTarget: HTMLInputElement }): void {
		query = event.currentTarget.value;
		open = query.trim().length >= 2;
	}

	function handleFocus(): void {
		if (query.trim().length >= 2) open = true;
	}

	function handleValueChange(next: string): void {
		open = false;
		query = '';
		void goto(`/player/${next}`);
	}
</script>

<div class="w-full min-w-0">
	<Combobox.Root
		type="single"
		bind:open
		{items}
		onValueChange={handleValueChange}
	>
		<Combobox.Input
			bind:ref={inputEl}
			class="vgui-input"
			type="search"
			placeholder={m.navbar_search()}
			aria-label={m.navbar_search()}
			oninput={handleInput}
			onfocus={handleFocus}
		/>

		<Combobox.Portal>
			<Combobox.Content
				class="raised-panel bevel-raised z-20 max-h-64 overflow-y-auto"
				style="width: var(--bits-combobox-anchor-width);"
				sideOffset={4}
			>
				{#if loading || pending}
					<p class="m-0 px-2 py-1 text-sm">{m.navbar_searching()}</p>
				{:else if results.length === 0}
					<p class="m-0 px-2 py-1 text-sm">{m.navbar_no_results()}</p>
				{:else}
					{#each results as player (player.id)}
						<Combobox.Item
							value={String(player.id)}
							label={player.steam_name}
							class="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-surface-lighter data-[highlighted]:bg-surface-lighter"
						>
							<Avatar
								url={player.steam_avatar_url}
								alt={player.steam_name}
								size={20}
							/>
							<span class="truncate">{player.steam_name}</span>
						</Combobox.Item>
					{/each}
				{/if}
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</div>
