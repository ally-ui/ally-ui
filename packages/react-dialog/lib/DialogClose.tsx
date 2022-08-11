import {type DialogModel} from '@ally-ui/core-dialog';
import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

export interface DialogCloseProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogClose({model, children}: DialogCloseProps) {
	const [id] = useState(() => model.init('close'));
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
		model.state.update((s) => ({...s, open: false}));
	}, [model]);

	return (
		<button ref={ref} onClick={handleClick}>
			{children}
		</button>
	);
}
