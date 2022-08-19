import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';

export interface DialogCloseProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	model: DialogModel;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	({model, children, onClick, ...restProps}, forwardedRef) => {
		const id = useRunOnce(() => model.init('close'));

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
				model.setState((prevState) => ({...prevState, open: false}));
			},
			[model],
		);

		return (
			<button
				ref={ref}
				{...model.submodelDOMAttributes(id)}
				{...restProps}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

export default DialogClose;
