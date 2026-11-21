<script lang="ts">
	import { goto } from '$app/navigation';
	import { Pagination as BitsPagination } from 'bits-ui';
	import { m } from '#lib/paraglide/messages.js';

	let {
		page,
		pageSize,
		total,
		hrefFor,
		showRange = true,
	}: {
		page: number;
		pageSize: number;
		total: number;
		hrefFor: (page: number) => string;
		showRange?: boolean;
	} = $props();

	const totalPages = $derived(pageSize > 0 ? Math.ceil(total / pageSize) : 1);
	const from = $derived(total === 0 ? 0 : (page - 1) * pageSize + 1);
	const to = $derived(Math.min(page * pageSize, total));

	function change(next: number): void {
		void goto(hrefFor(next));
	}
</script>

<BitsPagination.Root
	count={total}
	perPage={pageSize}
	page={page}
	onPageChange={change}
>
	<div class="mt-3 flex justify-between">
		<span>
			{#if showRange}
				{m.pagination_displayed_rows({ from, to, total })}
			{:else}
				{page} / {totalPages}
			{/if}
		</span>

		<div class="flex gap-2">
			{#if page > 1}
				<BitsPagination.PrevButton class="cursor-pointer text-gold">
					← {m.pagination_previous()}
				</BitsPagination.PrevButton>
			{/if}

			{#if showRange}
				<span>{page} / {totalPages}</span>
			{/if}

			{#if page < totalPages}
				<BitsPagination.NextButton class="cursor-pointer text-gold">
					{m.pagination_next()} →
				</BitsPagination.NextButton>
			{/if}
		</div>
	</div>
</BitsPagination.Root>
