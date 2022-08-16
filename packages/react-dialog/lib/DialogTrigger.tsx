import {type DialogModel} from '@ally-ui/core-dialog';
import {useRunOnce} from '@ally-ui/react-utils';
import {PropsWithChildren, useCallback, useId} from 'react';

export interface DialogTriggerProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogTrigger({model, children}: DialogTriggerProps) {
	const id = useId();
	useRunOnce(() => model.init(id, 'trigger'));

	const ref = useCallback(
		(node: HTMLButtonElement | null) => {
			if (node === null) {
				return;
			}
			model.bindNode(id, node);
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
