import {type DialogModel} from '@ally-ui/core-dialog';
import {useObservable} from '@ally-ui/react-utils';
import {PropsWithChildren, useEffect, useRef, useState} from 'react';

export interface DialogContentProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogContent({model, children}: DialogContentProps) {
	const [id] = useState(() => model.init('content'));
	const ref = useRef<HTMLDivElement | null>(null);
	const state = useObservable(model.state);

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

	return <div ref={ref}>{state.open && children}</div>;
}
