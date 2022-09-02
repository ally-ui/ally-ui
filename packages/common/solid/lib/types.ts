export type CallbackRef<TInstance> = (instance: TInstance) => void;

export type SolidReactiveProps<TReactive> = Partial<
	TReactive & SolidChangeHandlers<TReactive>
>;

type SolidChangeHandlers<TReactive> = {
	[TKey in keyof TReactive as ChangeHandler<TKey>]: (
		value: TReactive[TKey],
	) => void;
};

type ChangeHandler<TKey> = `on${TKey extends string
	? Capitalize<TKey>
	: never}Change`;
