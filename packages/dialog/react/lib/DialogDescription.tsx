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
		const resolvedModel = useDialogModelContext();
		if (resolvedModel === undefined) {
			throw new Error(
				'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
			);
		}
		const id = useRunOnce(() => resolvedModel.init('description'));

		React.useEffect(
			function mount() {
				resolvedModel.mount(id);
				return () => {
					resolvedModel.unmount(id);
				};
			},
			[resolvedModel],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node === null) {
					resolvedModel.unbindNode(id);
				} else {
					resolvedModel.bindNode(id, node);
				}
			},
			[resolvedModel],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		return (
			<p ref={ref} {...resolvedModel.componentAttributes(id)} {...restProps}>
				{children}
			</p>
		);
	},
);

export default DialogDescription;
