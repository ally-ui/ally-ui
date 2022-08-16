import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react-utils';
import {PropsWithChildren, useCallback, useId} from 'react';

export interface DialogContentProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogContent({model, children}: DialogContentProps) {
	const id = useId();
	useRunOnce(() => model.init(id, 'content'));

	const ref = useCallback(
		(node: HTMLElement | null) => {
			if (node === null) {
				return;
			}
			model.bindNode(id, node);
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
