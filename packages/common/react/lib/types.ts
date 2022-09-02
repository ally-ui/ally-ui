export type ReactReactiveProps<TReactive> = Partial<
	TReactive & ReactChangeHandlers<TReactive>
>;

type ReactChangeHandlers<TReactive> = {
	[TKey in keyof TReactive as ChangeHandler<TKey>]: (
		value: TReactive[TKey],
	) => void;
};

type ChangeHandler<TKey> = `on${TKey extends string
	? Capitalize<TKey>
	: never}Change`;
