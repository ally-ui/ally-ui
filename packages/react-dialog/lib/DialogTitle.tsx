import {type DialogModel} from '@ally-ui/core-dialog';
import {PropsWithChildren, useEffect, useRef, useState} from 'react';

export interface DialogTitleProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogTitle({model, children}: DialogTitleProps) {
	const [id] = useState(() => model.init('title'));
	const ref = useRef<HTMLHeadingElement | null>(null);

	useEffect(
		function mountModel() {
			model.mount(id, ref.current ?? undefined);
			return () => {
				model.unmount(id);
			};
		},
		[model],
	);

	return <h1 ref={ref}>{children}</h1>;
}
