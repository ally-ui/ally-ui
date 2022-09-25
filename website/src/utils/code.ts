import Prism from 'prismjs';
import 'prism-svelte';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup';
import type {KNOWN_FRAMEWORKS} from '../config';

type Language = 'tsx' | 'svelte' | 'markup';

export function getLanguage(
	framework: keyof typeof KNOWN_FRAMEWORKS,
): Language {
	switch (framework) {
		case 'react':
		case 'solid':
			return 'tsx';
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
			return ['tsx', Prism.highlight(code, Prism.languages.tsx!, 'tsx')];
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

export function getFilename(framework: keyof typeof KNOWN_FRAMEWORKS) {
	return `./${framework}.${getLanguage(framework)}`;
}

export async function getCode(
	sources: Record<string, () => Promise<string>>,
	framework: keyof typeof KNOWN_FRAMEWORKS,
) {
	const filename = getFilename(framework);
	let code = await sources[filename]?.();
	console.log(sources, filename);
	if (code === undefined) {
		code = '';
	}
	code = code.replace(/^\/\*\* @jsxImportSource [\w-]+ \*\/\n/, '');
	code = code.replaceAll('\t', '  ');
	return code;
}
