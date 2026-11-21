<script lang="ts">
	let { label, value }: { label: string; value: string } = $props();
</script>

<div class="inset-panel bevel-sunken flex flex-col gap-1 rounded-(--radius-skin) p-2.5">
	<p class="text-xs text-text">{label}</p>
	<p class="font-bold">{value}</p>
</div>
