import type {SvelteProps} from './main';

type SlotRenderPropGetter<
	TAttributes extends object,
	TRegularProps extends object,
> = (userProps?: TRegularProps) => SvelteProps<TAttributes>;

export type DefaultSlot<
	TAsChild extends true | undefined,
	TAttributes extends object,
	TProps extends object,
	TRef,
> = undefined extends TAsChild
	? Record<string, never>
	: {
			props: SlotRenderPropGetter<TAttributes, TProps>;
			ref: TRef;
	  };
