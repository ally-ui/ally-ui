export interface ContentFile {
	language: string;
	slug: string;
}

export function parseContentFile(filepath: string): ContentFile | undefined {
	const tokens = filepath.match(
		/content\/(?<slug>[\w-\/]+)\/(?<language>[\w-]+)\.(md|mdx)$/,
	);
	if (tokens === null) return undefined;
	return {
		slug: tokens.groups?.slug!,
		language: tokens.groups?.language!,
	};
}

export interface WidgetFile {
	language: string;
	widget: string;
	version: string;
}

export function parseWidgetFile(filepath: string): WidgetFile | undefined {
	const tokens = filepath.match(
		/content\/widgets\/(?<widget>[\w-\/]+)\/(?<version>\d+\.\d+\.\d+)\/(?<language>[\w-]+)\.(md|mdx)$/,
	);
	if (tokens === null) return undefined;
	return {
		widget: tokens.groups?.widget!,
		version: tokens.groups?.version!,
		language: tokens.groups?.language!,
	};
}
