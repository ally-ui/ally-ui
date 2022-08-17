import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import {forwardRef, PropsWithChildren, useCallback} from 'react';

export interface DialogTitleProps extends PropsWithChildren {
	model: DialogModel;
}

const DialogTitle = forwardRef<HTMLElement, DialogTitleProps>(
	({model, children}, forwardedRef) => {
		const id = useRunOnce(() => model.init('title'));

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

		return (
			<h1 ref={ref} {...model.submodelDOMAttributes(id)}>
				{children}
			</h1>
		);
	},
);

export default DialogTitle;
