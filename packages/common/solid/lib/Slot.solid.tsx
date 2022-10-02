import {Accessor, JSX, ParentProps, splitProps} from 'solid-js';
import {mergeSlotProps, type CallbackRef} from './main';

type SlotRenderPropGetter<
	TAttributes extends object,
	TRegularProps extends object,
> = (userProps?: TRegularProps) => {
	ref: CallbackRef<HTMLElement>;
} & TAttributes;

type SlottablePropsAsChild<
	TAttributes extends object,
	TRegularProps extends object,
> = {
	asChild: true;
} & {
	ref?: CallbackRef<HTMLElement>;
	children: (
		props: SlotRenderPropGetter<TAttributes, TRegularProps>,
	) => JSX.Element;
};

type SlottablePropsAsRegular<TRegularProps extends ParentProps> = {
	asChild?: undefined;
} & {
	ref?: CallbackRef<HTMLElement>;
} & TRegularProps;

/**
 * Prop definitions for a component that either renders a regular template or
 * an as-child render template when `asChild` is true.
 *
 * `TAttributes` is the common attributes that should be applied to both the
 * regular and as-child render template.
 *
 * `TRegularProps` is the prop definition for the regular template.
 */
export type SlottableProps<
	TAttributes extends object,
	TRegularProps extends ParentProps,
> =
	| SlottablePropsAsChild<TAttributes, Exclude<TRegularProps, 'children'>>
	| SlottablePropsAsRegular<TRegularProps>;

interface RegularRenderProp<TAttributes extends object> {
	ref: CallbackRef<HTMLElement>;
	attributes: Accessor<TAttributes>;
	children: JSX.Element;
}

export interface SlotProps<
	TAttributes extends object,
	TRegularProps extends ParentProps,
> {
	ref: CallbackRef<HTMLElement>;
	/**
	 * The props object of the current component.
	 */
	props: SlottableProps<TAttributes, TRegularProps>;
	/**
	 * The common attributes that should be applied to both the regular and
	 * as-child render template.
	 */
	attributes: TAttributes;
	/**
	 * The regular template.
	 */
	children: (props: RegularRenderProp<TAttributes>) => JSX.Element;
}

/**
 * A helper component to render `SlottableProps`.
 */
export function Slot<
	TAttributes extends object,
	TRegularProps extends ParentProps,
>(slotProps: SlotProps<TAttributes, TRegularProps>) {
	// `asChild` is never updated dynamically, so an early return here is okay.
	if (slotProps.props.asChild) {
		return (
			<>
				{slotProps.props.children((userProps) => ({
					ref: slotProps.ref,
					...(userProps === undefined
						? slotProps.attributes
						: (mergeSlotProps(slotProps.attributes, userProps) as any)),
				}))}
			</>
		);
	}
	const [, restProps] = splitProps(slotProps.props, ['asChild', 'children']);
	const attributes = () =>
		mergeSlotProps(slotProps.attributes, restProps) as TAttributes;
	return (
		<>
			{slotProps.children({
				ref: slotProps.ref,
				attributes: attributes,
				children: slotProps.props.children,
			})}
		</>
	);
}
