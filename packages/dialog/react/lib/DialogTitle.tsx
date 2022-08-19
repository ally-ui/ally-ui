import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';

export interface DialogTitleProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLHeadingElement>,
		HTMLHeadingElement
	> {
	model: DialogModel;
}

const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(
	({model, children, ...restProps}, forwardedRef) => {
		const id = useRunOnce(() => model.init('title'));

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
			<h1 ref={ref} {...model.submodelDOMAttributes(id)} {...restProps}>
				{children}
			</h1>
		);
	},
);

export default DialogTitle;
