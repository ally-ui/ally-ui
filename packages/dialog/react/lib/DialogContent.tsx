import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext, useDialogStateContext} from './context';

export interface DialogContentProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> {}

const DialogContent = React.forwardRef<HTMLElement, DialogContentProps>(
	({children, ...restProps}, forwardedRef) => {
		const model = useDialogModelContext();
		if (model === undefined) {
			throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
		}
		const id = useRunOnce(() => model.init('content'));

		const resolvedState = useDialogStateContext() ?? model.getState();

		React.useEffect(
			function mount() {
				model.mount(id);
				return () => {
					model.unmount(id);
				};
			},
			[model],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node === null) {
					model.unbindNode(id);
				} else {
					model.bindNode(id, node);
				}
			},
			[model],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		return (
			<>
				{resolvedState.open && (
					<div
						ref={ref}
						{...model.componentAttributes(id, resolvedState)}
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
