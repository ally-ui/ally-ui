import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react-utils';
import {PropsWithChildren, useCallback} from 'react';

export interface DialogCloseProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogClose({model, children}: DialogCloseProps) {
	const id = useRunOnce(() => model.init('close'));

	const ref = useCallback(
		(node: HTMLButtonElement | null) => {
			if (node === null) {
				model.unbindNode(id);
			} else {
				model.bindNode(id, node);
			}
		},
		[model],
	);

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
}
