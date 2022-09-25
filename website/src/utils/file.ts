import type {KNOWN_LANGUAGES} from '../config';

export interface ContentFile {
	language: keyof typeof KNOWN_LANGUAGES;
	slug: string;
}

export function parseContentFile(filepath: string): ContentFile | undefined {
	const tokens = filepath.match(
		/content\/(?<slug>[\w-\/]+)\/(?<language>[\w-]+)\.(md|mdx)$/,
	);
	if (tokens === null) return undefined;
	return {
		language: tokens.groups?.language! as keyof typeof KNOWN_LANGUAGES,
		slug: tokens.groups?.slug!,
	};
}

export interface WidgetFile {
	language: keyof typeof KNOWN_LANGUAGES;
	slug: string;
	widget: string;
	version: string;
}

export function parseWidgetFile(filepath: string): WidgetFile | undefined {
	const tokens = filepath.match(
		/content\/widgets\/(?<widget>[\w-\/]+)\/(?<version>\d+\.\d+\.\d+)\/(?<language>[\w-]+)\.(md|mdx)$/,
	);
	if (tokens === null) return undefined;
	return {
		language: tokens.groups?.language! as keyof typeof KNOWN_LANGUAGES,
		slug: `widgets/${tokens.groups?.widget!}`,
		widget: tokens.groups?.widget!,
		version: tokens.groups?.version!,
	};
}
