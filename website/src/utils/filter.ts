export function isNotNull<TValue>(
	value: TValue,
): value is Exclude<TValue, undefined | null> {
	return value != null;
}
