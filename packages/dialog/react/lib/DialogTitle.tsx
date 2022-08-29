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
		const model = useDialogModelContext();
		if (model === undefined) {
			throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
		}
		const id = useRunOnce(() => model.init('title'));

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
			<h1 ref={ref} {...model.componentAttributes(id)} {...restProps}>
				{children}
			</h1>
		);
	},
);

export default DialogTitle;
