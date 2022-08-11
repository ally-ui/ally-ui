import {type DialogModel} from '@ally-ui/core-dialog';
import {PropsWithChildren, useEffect, useRef, useState} from 'react';

export interface DialogDescriptionProps extends PropsWithChildren {
	model: DialogModel;
}

export default function DialogDescription({
	model,
	children,
}: DialogDescriptionProps) {
	const [id] = useState(() => model.init('title'));
	const ref = useRef<HTMLParagraphElement | null>(null);

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

	return <p ref={ref}>{children}</p>;
}
