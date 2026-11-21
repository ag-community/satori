<script lang="ts">
	let { code }: { code: string } = $props();
	let container = $state<HTMLDivElement>();
	let counter = 0;

	$effect(() => {
		if (!container) return;

		const diagram = code;
		const id = `mermaid-${Date.now()}-${++counter}`;
		let cancelled = false;

		void (async () => {
			const mermaid = (await import('mermaid')).default;
			mermaid.initialize({
				startOnLoad: false,
				theme: 'base',
				themeVariables: {
					darkMode: true,
					fontFamily: 'var(--font-sans)',
				},
			});
			const { svg } = await mermaid.render(id, diagram);
			if (!cancelled && container) container.innerHTML = svg;
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<div bind:this={container} class="mermaid-diagram flex justify-center"></div>
