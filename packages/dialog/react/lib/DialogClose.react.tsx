import {DialogCloseModel} from '@ally-ui/core-dialog';
import {Slot, useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export interface DialogCloseHandlers {
	onClick: React.MouseEventHandler;
}

export type DialogCloseProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	asChild?: true;
};

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	(props, forwardedRef) => {
		const {ref: _, children, asChild, onClick, ...restProps} = props;

		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(new DialogCloseModel(rootModel, {})),
		);
		const id = component.getId();

		React.useEffect(
			function mount() {
				rootModel.mountComponent(id);
				return () => {
					rootModel.unmountComponent(id);
					// rootModel.deregisterComponent(id);
				};
			},
			[rootModel],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node === null) {
					rootModel.unbindComponent(id);
				} else {
					rootModel.bindComponent(id, node);
				}
			},
			[rootModel],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const handleClick = React.useCallback<
			React.MouseEventHandler<HTMLButtonElement>
		>(
			(ev) => {
				onClick?.(ev);
				component.onClick();
			},
			[rootModel],
		);

		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				ref={ref}
				{...component.getAttributes()}
				{...restProps}
				onClick={handleClick}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogClose;
