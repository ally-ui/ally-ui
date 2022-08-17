import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import {forwardRef, PropsWithChildren, useCallback} from 'react';

export interface DialogCloseProps extends PropsWithChildren {
	model: DialogModel;
}

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
	({model, children}, forwardedRef) => {
		const id = useRunOnce(() => model.init('close'));

		const bindRef = useCallback(
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

		const handleClick = useCallback(() => {
			model.setState((prevState) => ({...prevState, open: false}));
		}, [model]);

		return (
			<button
				ref={ref}
				{...model.submodelDOMAttributes(id)}
				onClick={handleClick}
			>
				{children}
			</button>
		);
	},
);

export default DialogClose;
