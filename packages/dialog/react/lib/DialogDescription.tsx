import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import {forwardRef, PropsWithChildren, useCallback} from 'react';

export interface DialogDescriptionProps extends PropsWithChildren {
	model: DialogModel;
}

const DialogDescription = forwardRef<HTMLElement, DialogDescriptionProps>(
	({model, children}, forwardedRef) => {
		const id = useRunOnce(() => model.init('description'));

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
			<p ref={ref} {...model.submodelDOMAttributes(id)}>
				{children}
			</p>
		);
	},
);

export default DialogDescription;
