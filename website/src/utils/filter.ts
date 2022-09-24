export function isNotUndefined<TValue>(
	value: TValue,
): value is Exclude<TValue, undefined> {
	return value !== undefined;
}
