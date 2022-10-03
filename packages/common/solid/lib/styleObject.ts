export function styleObject(
	style: string | Record<string, unknown>,
): Record<string, unknown> {
	if (typeof style === 'object') return style;
	return Object.fromEntries(
		style
			.split(';')
			.filter((s) => s !== '')
			.map((kv) => kv.split(':').map((t) => t.trim())),
	);
}
