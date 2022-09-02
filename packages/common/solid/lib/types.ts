export type CallbackRef<TInstance> = (instance: TInstance) => void;

export type SolidStateProps<TState> = Partial<
	TState & SolidChangeHandlers<TState>
>;

type SolidChangeHandlers<TState> = {
	[TKey in keyof TState as ChangeHandler<TKey>]: (value: TState[TKey]) => void;
};

type ChangeHandler<TKey> = `on${TKey extends string
	? Capitalize<TKey>
	: never}Change`;
