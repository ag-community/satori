<script module lang="ts">
	import bbobHTML from '@bbob/html';
	import presetHTML5 from '@bbob/preset-html5';
	import type { TagNodeObject } from '@bbob/types';
	import DOMPurify, { type NodeHook } from 'isomorphic-dompurify';
	import { BBCODE_TAGS } from '#lib/bbcode.js';

	const overrides = Object.fromEntries(
		BBCODE_TAGS.filter((entry) => !entry.usePresetHandler).map((entry) => [
			entry.tag,
			(node: TagNodeObject) => ({ tag: entry.html, content: node.content }),
		]),
	);

	const preset = presetHTML5.extend((tags) => ({ ...tags, ...overrides }));

	const externalLinks: NodeHook = (node) => {
		if (node.nodeName === 'A') {
			const anchor = node as Element;
			anchor.setAttribute('target', '_blank');
			anchor.setAttribute('rel', 'nofollow ugc noopener noreferrer');
		}
	};

	DOMPurify.addHook('afterSanitizeAttributes', externalLinks);

	const sanitizeOptions = {
		ALLOWED_TAGS: [...new Set(BBCODE_TAGS.map((entry) => entry.html))],
		ALLOWED_URI_REGEXP: /^https?:\/\//i,
	};

	function renderBbcode(source: string): string {
		const rendered = bbobHTML(source, preset(), {
			onlyAllowTags: BBCODE_TAGS.map((entry) => entry.tag),
			caseFreeTags: true,
		});

		return DOMPurify.sanitize(rendered, sanitizeOptions);
	}
</script>

<script lang="ts">
	let { source, class: className = '' }: { source: string; class?: string } = $props();

	const html = $derived(renderBbcode(source));
</script>

<span class="whitespace-pre-line wrap-break-word {className}">{@html html}</span>
