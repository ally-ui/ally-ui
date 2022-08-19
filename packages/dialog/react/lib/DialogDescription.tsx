import {type DialogModel} from '@ally-ui/core-dialog';
import {useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogContext} from './DialogRoot';

export interface DialogDescriptionProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLParagraphElement>,
		HTMLParagraphElement
	> {
	model?: DialogModel;
}

const DialogDescription = React.forwardRef<HTMLElement, DialogDescriptionProps>(
	({model, children, ...restProps}, forwardedRef) => {
		const resolvedModel = useDialogContext() ?? model;
		if (resolvedModel === undefined) {
			throw new Error(
				'<Dialog.Description /> must have a `model` prop or be a child of `<Dialog.Root/>`',
			);
		}
		const id = useRunOnce(() => resolvedModel.init('description'));

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
			<p ref={ref} {...resolvedModel.submodelDOMAttributes(id)} {...restProps}>
				{children}
			</p>
		);
	},
);

export default DialogDescription;
