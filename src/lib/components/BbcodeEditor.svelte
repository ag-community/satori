<script lang="ts">
	import { onMount } from 'svelte';
	import 'sceditor/minified/themes/defaultdark.min.css';
	import sceditorSource from 'sceditor/minified/sceditor.min.js?raw';
	import bbcodeFormatSource from 'sceditor/minified/formats/bbcode.js?raw';
	import monoconsSource from 'sceditor/minified/icons/monocons.js?raw';
	import contentStyles from '#lib/styles/bbcode-editor.css?url';
	import { SKINS, type ThemeName } from '#lib/theme/skins.js';
	import { getTheme } from '#lib/theme/theme.svelte.js';

	interface SCEditorInstance {
		val(value?: string): string;
		bind(event: string, handler: () => void): void;
		destroy(): void;
		getBody(): HTMLElement;
	}

	interface SCEditorStatic {
		create(textarea: HTMLTextAreaElement, options: Record<string, unknown>): void;
		instance(textarea: HTMLTextAreaElement): SCEditorInstance | undefined;
		formats?: { bbcode?: unknown };
		icons?: Record<string, unknown>;
	}

	let { value = $bindable('') }: { value?: string } = $props();

	let textarea = $state<HTMLTextAreaElement | null>(null);
	let instance = $state<SCEditorInstance | null>(null);

	function applyContentTheme(editor: SCEditorInstance, theme: ThemeName): void {
		const style = editor.getBody().ownerDocument.documentElement.style;
		const skin = SKINS[theme];

		style.setProperty('--editor-text', skin.text);
		style.setProperty('--editor-gold', skin.gold);
	}

	onMount(() => {
		const global = window as unknown as { sceditor?: SCEditorStatic };

		if (!global.sceditor?.formats?.bbcode || !global.sceditor.icons?.monocons) {
			const script = document.createElement('script');
			script.textContent = [sceditorSource, bbcodeFormatSource, monoconsSource].join('\n');
			document.head.appendChild(script);
		}

		const editor = global.sceditor;
		if (!textarea || !editor) return;

		textarea.value = value;
		editor.create(textarea, {
			format: 'bbcode',
			style: contentStyles,
			icons: 'monocons',
			toolbar: 'bold,italic,underline,strike|link,unlink|source',
			emoticonsEnabled: false,
			enablePasteFiltering: true,
			bbcodeTrim: true,
			resizeEnabled: false,
			width: '100%',
			height: 220,
		});

		const created = editor.instance(textarea);
		if (!created) return;

		instance = created;
		created.bind('change', () => {
			if (instance) value = instance.val();
		});

		return () => {
			instance?.destroy();
			instance = null;
		};
	});

	$effect(() => {
		const theme = getTheme();
		if (instance) applyContentTheme(instance, theme);
	});
</script>

<div class="bbcode-editor">
	<textarea bind:this={textarea}>{value}</textarea>
</div>

