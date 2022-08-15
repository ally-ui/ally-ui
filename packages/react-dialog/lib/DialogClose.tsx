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
			model.mount(id, ref.current ?? undefined);
			return () => {
				model.unmount(id);
			};
		},
		[model],
	);

	const handleClick = useCallback(() => {
		model.setState((prevState) => ({...prevState, open: false}));
	}, [model]);

	return (
		<button ref={ref} onClick={handleClick}>
			{children}
		</button>
	);
}
