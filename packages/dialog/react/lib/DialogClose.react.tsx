import {DialogCloseModel} from '@ally-ui/core-dialog';
import {
	Slot,
	useMultipleRefs,
	useRunOnce,
	reactProps,
	mergeReactProps,
	useNodeComponentModel,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export type DialogCloseProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	asChild?: true;
};

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	({children, asChild, onClick, ...restProps}, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel == null) {
			throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(
			() => new DialogCloseModel({}, undefined, rootModel),
		);

		const [bindRef] = useNodeComponentModel(component);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const handleClick = React.useCallback<
			React.MouseEventHandler<HTMLButtonElement>
		>(
			(ev) => {
				onClick?.(ev);
				component.onClick();
			},
			[component],
		);

		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				{...mergeReactProps(reactProps(component.attributes()), restProps)}
				ref={ref}
				onClick={handleClick}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogClose;
