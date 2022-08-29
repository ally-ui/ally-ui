import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext} from './context';

export interface DialogDescriptionProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLParagraphElement>,
		HTMLParagraphElement
	> {}

const DialogDescription = React.forwardRef<HTMLElement, DialogDescriptionProps>(
	({children, ...restProps}, forwardedRef) => {
		const model = useDialogModelContext();
		if (model === undefined) {
			throw new Error(
				'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
			);
		}
		const id = useRunOnce(() => model.init('description'));

		React.useEffect(
			function mount() {
				model.mount(id);
				return () => {
					model.unmount(id);
				};
			},
			[model],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node === null) {
					model.unbindNode(id);
				} else {
					model.bindNode(id, node);
				}
			},
			[model],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		return (
			<p ref={ref} {...model.componentAttributes(id)} {...restProps}>
				{children}
			</p>
		);
	},
);

export default DialogDescription;
