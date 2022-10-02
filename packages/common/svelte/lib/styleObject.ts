export function styleObject(
	style: Record<string, unknown> | string | null | undefined,
): Record<string, unknown> {
	if (style == null) return {};
	if (typeof style === 'object') return style;
	return Object.fromEntries(
		style.split(';').map((kv) => kv.split(':').map((t) => t.trim())),
	);
}

export function styleString(
	style: Record<string, unknown> | string | null | undefined,
): string {
	if (style == null) return '';
	if (typeof style === 'string') return style;
	return Object.entries(style)
		.map(([k, v]) => `${k}:${v}`)
		.join(';');
}
