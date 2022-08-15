import {type DialogModel} from '@ally-ui/core-dialog';
import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

export interface DialogTriggerProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogTrigger({model, children}: DialogTriggerProps) {
	const [id] = useState(() => model.init('trigger'));
	const ref = useRef<HTMLButtonElement | null>(null);

	useEffect(
		function mountModel() {
			model.mount(id, ref.current ?? undefined);
			return () => {
				model.unmount(id);
			};
		},
		[model],
	);

	const handleClick = useCallback(() => {
		model.setState((prevState) => ({...prevState, open: true}));
	}, [model]);

	return (
		<button ref={ref} onClick={handleClick}>
			{children}
		</button>
	);
}
