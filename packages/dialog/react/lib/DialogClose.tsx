import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext} from './context';

export interface DialogCloseProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	({children, onClick, ...restProps}, forwardedRef) => {
		const model = useDialogModelContext();
		if (model === undefined) {
			throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
		}
		const id = useRunOnce(() => model.init('close'));

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
				model.close();
			},
			[model],
		);

		return (
			<button
				ref={ref}
				{...model.componentAttributes(id)}
				{...restProps}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

export default DialogClose;
