import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react-utils';
import {PropsWithChildren, useCallback} from 'react';

export interface DialogContentProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogContent({model, children}: DialogContentProps) {
	const id = useRunOnce(() => model.init('content'));

	const ref = useCallback(
		(node: HTMLElement | null) => {
			if (node === null) {
				model.unbindNode(id);
			} else {
				model.bindNode(id, node);
			}
		},
		[model],
	);

	return (
		<>
			{model.getState().open && (
				<div ref={ref} {...model.submodelDOMAttributes(id)}>
					{children}
				</div>
			)}
		</>
	);
}
