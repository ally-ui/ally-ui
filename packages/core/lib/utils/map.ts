export function findInMap<TKey, TValue>(
	map: Map<TKey, TValue>,
	predicate: (value: TValue) => boolean,
): TValue | undefined {
	for (const value of map.values()) {
		if (predicate(value)) {
			return value;
		}
	}
	return undefined;
}

export function findLastInMap<TKey, TValue>(
	map: Map<TKey, TValue>,
	predicate: (value: TValue) => boolean,
): TValue | undefined {
	let lastValue: TValue | undefined;
	for (const value of map.values()) {
		if (predicate(value)) {
			lastValue = value;
		}
	}
	return lastValue;
}
