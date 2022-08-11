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
			if (ref.current !== null) {
				model.mount(id, ref.current);
			}
			return () => {
				model.unmount(id);
			};
		},
		[model],
	);

	const handleClick = useCallback(() => {
		model.state.update((s) => ({...s, open: true}));
	}, [model]);

	return (
		<button ref={ref} onClick={handleClick}>
			{children}
		</button>
	);
}
