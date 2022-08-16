import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react-utils';
import {PropsWithChildren, useCallback, useId} from 'react';

export interface DialogTitleProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogTitle({model, children}: DialogTitleProps) {
	const id = useId();
	useRunOnce(() => model.init(id, 'title'));

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
		<h1 ref={ref} {...model.submodelDOMAttributes(id)}>
			{children}
		</h1>
	);
}
