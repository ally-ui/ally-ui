import Prism from 'prismjs';
import 'prism-svelte';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markup';
import type {KNOWN_FRAMEWORKS} from '../config';

type Language = 'jsx' | 'svelte' | 'markup';

export function getLanguage(
	framework: keyof typeof KNOWN_FRAMEWORKS,
): Language {
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

export function getHighlighted(
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

export function getFileExtension(framework: keyof typeof KNOWN_FRAMEWORKS) {
	switch (framework) {
		case 'react':
		case 'solid':
			return 'tsx';
		case 'svelte':
			return 'svelte';
		case 'vue':
			return 'vue';
	}
}

export function getFilename(framework: keyof typeof KNOWN_FRAMEWORKS) {
	return `./${framework}.${getFileExtension(framework)}`;
}

export async function getCode(
	sources: Record<string, () => Promise<string>>,
	framework: keyof typeof KNOWN_FRAMEWORKS,
) {
	const filename = getFilename(framework);
	let code = await sources[filename]?.();
	if (code == null) {
		code = '';
	}
	code = code.replace(/^\/\*\* @jsxImportSource [\w-]+ \*\/\n/, '');
	code = code.replaceAll('\t', '  ');
	return code;
}
