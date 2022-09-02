export type ReactStateProps<TState> = Partial<
	TState & ReactChangeHandlers<TState>
>;

type ReactChangeHandlers<TState> = {
	[TKey in keyof TState as ChangeHandler<TKey>]: (value: TState[TKey]) => void;
};

type ChangeHandler<TKey> = `on${TKey extends string
	? Capitalize<TKey>
	: never}Change`;
