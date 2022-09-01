import type React from 'react';

type SlotRenderProp<TAttributes extends object> = {
	ref: React.RefCallback<HTMLElement>;
} & TAttributes;

type SlottablePropsAsChild<TAttributes extends object> = {
	asChild: true;
} & {
	children: (props: SlotRenderProp<TAttributes>) => React.ReactNode;
};

type SlottablePropsAsRegular<TRegularProps extends React.PropsWithChildren> = {
	asChild?: undefined;
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
	TRegularProps extends React.PropsWithChildren,
> = SlottablePropsAsChild<TAttributes> | SlottablePropsAsRegular<TRegularProps>;

interface RegularRenderProp<TAttributes extends object> {
	ref: React.RefCallback<HTMLElement>;
	attributes: TAttributes;
	children: React.ReactNode;
}

export interface SlotProps<
	TAttributes extends object,
	TRegularProps extends React.PropsWithChildren,
> {
	slotRef: React.RefCallback<HTMLElement>;
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
	children: (props: RegularRenderProp<TAttributes>) => React.ReactNode;
}

/**
 * A helper component to render `SlottableProps`.
 */
export function Slot<
	TAttributes extends object,
	TRegularProps extends React.PropsWithChildren,
>({
	slotRef,
	props,
	attributes,
	children,
}: SlotProps<TAttributes, TRegularProps>) {
	if (props.asChild) {
		return (
			<>
				{props.children({
					ref: slotRef,
					...attributes,
				})}
			</>
		);
	}
	const {asChild, children: child, ...restProps} = props;
	return (
		<>
			{children({
				ref: slotRef,
				attributes: {...attributes, ...restProps},
				children: child,
			})}
		</>
	);
}
