import type {DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext, useDialogStateContext} from './context';

export interface DialogTriggerProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	model?: DialogModel;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
	({model, children, onClick, ...restProps}, forwardedRef) => {
		const resolvedModel = useDialogModelContext() ?? model;
		if (resolvedModel === undefined) {
			throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
		}
		const id = useRunOnce(() => resolvedModel.init('trigger'));

		const resolvedState = useDialogStateContext() ?? resolvedModel.getState();

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
				resolvedModel.onTriggerClick();
			},
			[resolvedModel],
		);

		return (
			<button
				ref={ref}
				{...resolvedModel.componentAttributes(id, resolvedState)}
				{...restProps}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

export default DialogTrigger;
