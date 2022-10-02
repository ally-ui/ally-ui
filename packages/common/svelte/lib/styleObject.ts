export function styleObject(style: string): Record<string, unknown> {
	return Object.fromEntries(
		style.split(';').map((kv) => kv.split(':').map((t) => t.trim())),
	);
}

export function styleString(style: Record<string, unknown>): string {
	return Object.entries(style)
		.map(([k, v]) => `${k}:${v}`)
		.join(';');
}
