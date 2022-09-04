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
