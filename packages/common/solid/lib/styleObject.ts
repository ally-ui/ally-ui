export function styleObject(
	style: string | Record<string, unknown>,
): Record<string, unknown> {
	if (typeof style === 'object') return style;
	return Object.fromEntries(
		style.split(';').map((kv) => kv.split(':').map((t) => t.trim())),
	);
}
