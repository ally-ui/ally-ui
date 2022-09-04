export type DefaultSlot<
	TAsChild extends true | undefined,
	TProps,
	TRef,
> = undefined extends TAsChild
	? Record<string, never>
	: {
			props: TProps;
			ref: TRef;
	  };

export type ComponentEvents<TEvents> = {
	[TKey in keyof TEvents]: CustomEvent<TEvents[TKey]>;
};
