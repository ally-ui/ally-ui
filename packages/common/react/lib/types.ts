export type ReactEventHandlers<TEvents> = {
	[TKey in keyof TEvents as `on${TKey extends string
		? Capitalize<TKey>
		: never}`]: TEvents[TKey];
};
