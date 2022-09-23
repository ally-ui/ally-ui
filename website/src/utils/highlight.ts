import Prism from 'prismjs';
import 'prism-svelte';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markup';
import type {KNOWN_FRAMEWORKS} from '../config';

type Language = 'jsx' | 'svelte' | 'markup';

export function language(framework: keyof typeof KNOWN_FRAMEWORKS): Language {
	switch (framework) {
		case 'react':
		case 'solid':
			return 'jsx';
		case 'svelte':
			return 'svelte';
		case 'vue':
			return 'markup';
	}
}

export function highlight(
	code: string,
	framework: keyof typeof KNOWN_FRAMEWORKS,
): [Language, string] {
	switch (framework) {
		case 'react':
		case 'solid':
			return ['jsx', Prism.highlight(code, Prism.languages.jsx!, 'jsx')];
		case 'svelte':
			return [
				'svelte',
				Prism.highlight(code, Prism.languages.svelte!, 'svelte'),
			];
		case 'vue':
			return [
				'markup',
				Prism.highlight(code, Prism.languages.markup!, 'markup'),
			];
	}
}
