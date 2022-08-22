import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext, useDialogStateContext} from './DialogRoot';

export interface DialogContentProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> {
	model?: DialogModel;
}

const DialogContent = React.forwardRef<HTMLElement, DialogContentProps>(
	({model, children, ...restProps}, forwardedRef) => {
		const resolvedModel = useDialogModelContext() ?? model;
		if (resolvedModel === undefined) {
			throw new Error(
				'<Dialog.Content /> must have a `model` prop or be a child of `<Dialog.Root/>`',
			);
		}
		const id = useRunOnce(() => resolvedModel.init('content'));

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

		return (
			<>
				{resolvedState.open && (
					<div
						ref={ref}
						{...resolvedModel.componentAttributes(id, resolvedState)}
						{...restProps}
					>
						{children}
					</div>
				)}
			</>
		);
	},
);

export default DialogContent;
