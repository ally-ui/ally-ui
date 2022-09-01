import {Accessor, JSX, ParentProps, splitProps} from 'solid-js';
import type {CallbackRef} from './types';

type SlotRenderProp<TAttributes extends object> = Accessor<
	{
		ref: CallbackRef<HTMLElement>;
	} & TAttributes
>;

type SlottablePropsAsChild<TAttributes extends object> = {
	asChild: true;
} & {
	ref?: CallbackRef<HTMLElement>;
	children: (props: SlotRenderProp<TAttributes>) => JSX.Element;
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
> = SlottablePropsAsChild<TAttributes> | SlottablePropsAsRegular<TRegularProps>;

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
		const renderProp = () => ({
			ref: slotProps.ref,
			...slotProps.attributes,
		});
		return <>{slotProps.props.children(renderProp)}</>;
	}
	const [, restProps] = splitProps(slotProps.props, ['asChild', 'children']);
	const attributes = () => ({...slotProps.attributes, ...restProps});
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
