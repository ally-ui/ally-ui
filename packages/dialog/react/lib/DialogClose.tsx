import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogContext} from './DialogRoot';

export interface DialogCloseProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	model?: DialogModel;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	({model, children, onClick, ...restProps}, forwardedRef) => {
		const resolvedModel = useDialogContext() ?? model;
		if (resolvedModel === undefined) {
			throw new Error(
				'<Dialog.Close /> must have a `model` prop or be a child of `<Dialog.Root/>`',
			);
		}
		const id = useRunOnce(() => resolvedModel.init('close'));

		React.useEffect(
			function mount() {
				resolvedModel.mount(id);
				return () => {
					resolvedModel.unmount(id);
				};
			},
			[resolvedModel],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node === null) {
					resolvedModel.unbindNode(id);
				} else {
					resolvedModel.bindNode(id, node);
				}
			},
			[resolvedModel],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const handleClick = React.useCallback<
			React.MouseEventHandler<HTMLButtonElement>
		>(
			(ev) => {
				onClick?.(ev);
				resolvedModel.setState((prevState) => ({...prevState, open: false}));
			},
			[resolvedModel],
		);

		return (
			<button
				ref={ref}
				{...resolvedModel.componentAttributes(id)}
				{...restProps}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

export default DialogClose;
