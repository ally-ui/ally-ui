import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext, useDialogStateContext} from './context';

export interface DialogTriggerProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
	({children, onClick, ...restProps}, forwardedRef) => {
		const model = useDialogModelContext();
		if (model === undefined) {
			throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
		}
		const id = useRunOnce(() => model.init('trigger'));

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

		const handleClick = React.useCallback<
			React.MouseEventHandler<HTMLButtonElement>
		>(
			(ev) => {
				onClick?.(ev);
				model.onTriggerClick();
			},
			[model],
		);

		return (
			<button
				ref={ref}
				{...model.componentAttributes(id, resolvedState)}
				{...restProps}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

export default DialogTrigger;
