import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogModelContext} from './context';

export interface DialogTitleProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLHeadingElement>,
		HTMLHeadingElement
	> {}

const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(
	({children, ...restProps}, forwardedRef) => {
		const resolvedModel = useDialogModelContext();
		if (resolvedModel === undefined) {
			throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
		}
		const id = useRunOnce(() => resolvedModel.init('title'));

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
			<h1 ref={ref} {...resolvedModel.componentAttributes(id)} {...restProps}>
				{children}
			</h1>
		);
	},
);

export default DialogTitle;
