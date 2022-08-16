import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react-utils';
import {PropsWithChildren, useCallback, useId} from 'react';

export interface DialogDescriptionProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogDescription({
	model,
	children,
}: DialogDescriptionProps) {
	const id = useId();
	useRunOnce(() => model.init(id, 'description'));

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
		<p ref={ref} {...model.submodelDOMAttributes(id)}>
			{children}
		</p>
	);
}
