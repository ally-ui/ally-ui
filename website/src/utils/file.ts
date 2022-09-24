export interface ContentFile {
	language: string;
	slug: string;
}

export function parseContentFile(filepath: string): ContentFile | undefined {
	const tokens = filepath.match(/content\/([\w-\/]+)\/([\w-]+)\.(md|mdx)$/);
	if (tokens === null) return undefined;
	if (tokens.length !== 4) return undefined;
	return {
		slug: tokens[1]!,
		language: tokens[2]!,
	};
}

export interface WidgetFile {
	language: string;
	widget: string;
	version: string;
}

export function parseWidgetFile(filepath: string): WidgetFile | undefined {
	const tokens = filepath.match(
		/content\/widgets\/([\w-\/]+)\/(\d+\.\d+\.\d+)\/([\w-]+)\.(md|mdx)$/,
	);
	if (tokens === null) return undefined;
	if (tokens.length !== 5) return undefined;
	return {
		widget: tokens[1]!,
		version: tokens[2]!,
		language: tokens[3]!,
	};
}
