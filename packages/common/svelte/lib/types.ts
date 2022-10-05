export type SvelteEventHandlers<TEvents> = {
	[TKey in keyof TEvents]-?: TEvents[TKey] extends
		| undefined
		| ((ev: infer TEvent) => void)
		? TEvent
		: never;
};
