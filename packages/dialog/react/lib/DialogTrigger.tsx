import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react';
import {PropsWithChildren, useCallback} from 'react';

export interface DialogTriggerProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogTrigger({model, children}: DialogTriggerProps) {
	const id = useRunOnce(() => model.init('trigger'));

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

	const handleClick = useCallback(() => {
		model.setState((prevState) => ({...prevState, open: true}));
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
