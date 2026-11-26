<script lang="ts">
	import { goto } from '$app/navigation';
	import { DropdownMenu as Menu } from 'bits-ui';
	import type { AuthUserDto } from '#lib/api/types.js';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import { m } from '#lib/paraglide/messages.js';

	let { user }: { user: AuthUserDto } = $props();

	const itemClass =
		'cursor-pointer px-2.5 py-1 text-sm outline-hidden hover:bg-surface-lighter data-[highlighted]:bg-surface-lighter';
</script>

<Menu.Root>
	<Menu.Trigger
		class="flex max-w-40 items-center gap-1.5 px-1.5 py-1 transition-colors hover:bg-surface-lighter"
	>
		<Avatar url={user.steam_avatar_url} alt={user.steam_name} size={20} />
		<span class="max-w-20 truncate text-sm">{user.steam_name}</span>
	</Menu.Trigger>

	<Menu.Portal>
		<Menu.Content
			class="raised-panel bevel-raised z-50 min-w-44 py-1"
			style="border-radius: var(--radius-skin)"
			sideOffset={4}
			align="end"
		>
			<Menu.Item class={itemClass} onSelect={() => goto(`/player/${user.id}`)}>
				{m.auth_visit_profile()}
			</Menu.Item>
			<Menu.Item class={itemClass} onSelect={() => goto('/settings')}>
				{m.auth_settings()}
			</Menu.Item>
			<Menu.Separator class="my-1 border-t border-divider" />
			<form method="POST" action="/api/auth/logout">
				<button type="submit" class="{itemClass} block w-full text-left">
					{m.auth_sign_out()}
				</button>
			</form>
		</Menu.Content>
	</Menu.Portal>
</Menu.Root>
