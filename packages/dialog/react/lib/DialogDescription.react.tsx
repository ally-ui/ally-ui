import {DialogDescriptionModel} from '@ally-ui/core-dialog';
import {
	mergeReactProps,
	reactProps,
	Slot,
	useMultipleRefs,
	useNodeComponentModel,
	useRunOnce,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export type DialogDescriptionProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLParagraphElement>,
	HTMLParagraphElement
> & {
	asChild?: true;
};

const DialogDescription = React.forwardRef<HTMLElement, DialogDescriptionProps>(
	({ref: _, children, asChild, ...restProps}, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel == null) {
			throw new Error(
				'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
			);
		}
		const component = useRunOnce(
			() => new DialogDescriptionModel({}, undefined, rootModel),
		);
		const [bindRef] = useNodeComponentModel(component);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const Comp = asChild ? Slot : 'p';

		return (
			<Comp
				{...mergeReactProps(reactProps(component.attributes()), restProps)}
				ref={ref}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogDescription;
