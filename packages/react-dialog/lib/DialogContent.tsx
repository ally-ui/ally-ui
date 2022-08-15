import {type DialogModel} from '@ally-ui/core-dialog';
import {PropsWithChildren, useEffect, useRef, useState} from 'react';

export interface DialogContentProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogContent({model, children}: DialogContentProps) {
	const [id] = useState(() => model.init('content'));
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(
		function mountModel() {
			model.mount(id, ref.current ?? undefined);
			return () => {
				model.unmount(id);
			};
		},
		[model],
	);

	return <div ref={ref}>{model.getState().open && children}</div>;
}
