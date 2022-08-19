import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';

export interface DialogContentProps extends React.PropsWithChildren {
	model: DialogModel;
}

const DialogContent = React.forwardRef<HTMLElement, DialogContentProps>(
	({model, children}, forwardedRef) => {
		const id = useRunOnce(() => model.init('content'));

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
				{model.getState().open && (
					<div ref={ref} {...model.submodelDOMAttributes(id)}>
						{children}
					</div>
				)}
			</>
		);
	},
);

export default DialogContent;
