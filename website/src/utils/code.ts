import type {KNOWN_FRAMEWORKS} from '../config';

export function getFilename(framework: keyof typeof KNOWN_FRAMEWORKS) {
	switch (framework) {
		case 'react':
			return './react.tsx';
		case 'solid':
			return './solid.tsx';
		case 'svelte':
			return './svelte.svelte';
		case 'vue':
			return './vue.vue';
	}
}

export async function getCode(
	sources: Record<string, () => Promise<string>>,
	framework: keyof typeof KNOWN_FRAMEWORKS,
) {
	const filename = getFilename(framework);
	let code = await sources[filename]?.();
	if (code === undefined) {
		code = '';
	}
	code = code.replace(/^\/\*\* @jsxImportSource [\w-]+ \*\/\n/, '');
	code = code.replaceAll('\t', '  ');
	return code;
}
