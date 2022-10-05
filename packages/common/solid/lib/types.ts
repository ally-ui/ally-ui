export type CallbackRef<TInstance> = (instance: TInstance) => void;

export type SolidEventHandlers<TEvents> = {
	[TKey in keyof TEvents as `on${TKey extends string
		? Capitalize<TKey>
		: never}`]: TEvents[TKey];
};
