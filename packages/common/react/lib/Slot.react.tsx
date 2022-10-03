import React from 'react';
import {combinedRef, mergeReactProps} from './main';

// CREDIT https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
	(props, forwardedRef) => {
		const {children, ...slotProps} = props;
		const childrenArray = React.Children.toArray(children);
		const slottable = childrenArray.find(isSlottable);

		if (slottable) {
			// The new element to render is the one passed as a child of `Slottable`
			const newElement = slottable.props.children as React.ReactNode;
			const newChildren = childrenArray.map((child) => {
				if (child === slottable) {
					// because the new element will be the one rendered, we are only interested
					// in grabbing its children (`newElement.props.children`)
					if (React.Children.count(newElement) > 1)
						return React.Children.only(null);
					return React.isValidElement(newElement)
						? (newElement.props.children as React.ReactNode)
						: null;
				} else {
					return child;
				}
			});

			return (
				<SlotClone {...slotProps} ref={forwardedRef}>
					{React.isValidElement(newElement)
						? React.cloneElement(newElement, undefined, newChildren)
						: null}
				</SlotClone>
			);
		}

		return (
			<SlotClone {...slotProps} ref={forwardedRef}>
				{children}
			</SlotClone>
		);
	},
);

Slot.displayName = 'Slot';

interface SlotCloneProps {
	children: React.ReactNode;
}

export const SlotClone = React.forwardRef<any, SlotCloneProps>(
	(props, forwardedRef) => {
		const {children, ...slotProps} = props;

		if (React.isValidElement(children)) {
			return React.cloneElement(children, {
				...mergeReactProps(slotProps, children.props),
				ref: combinedRef([forwardedRef, (children as any).ref]),
			} as any);
		}

		return React.Children.count(children) > 1
			? React.Children.only(null)
			: null;
	},
);

SlotClone.displayName = 'SlotClone';

const Slottable = ({children}: {children: React.ReactNode}) => {
	return <>{children}</>;
};

function isSlottable(child: React.ReactNode): child is React.ReactElement {
	return React.isValidElement(child) && child.type === Slottable;
}
