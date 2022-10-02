import {
	DialogDescriptionModel,
	type DialogDescriptionModelAttributes,
} from '@ally-ui/core-dialog';
import {
	mergeSlotProps,
	reactProps,
	Slot,
	useMultipleRefs,
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
	(props, forwardedRef) => {
		const {ref: _, children, asChild, ...restProps} = props;

		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error(
				'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
			);
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(new DialogDescriptionModel(rootModel, {})),
		);
		const id = component.getId();

		React.useEffect(
			function mount() {
				rootModel.mountComponent(id);
				return () => {
					rootModel.unmountComponent(id);
					// rootModel.deregisterComponent(id);
				};
			},
			[rootModel],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node === null) {
					rootModel.unbindComponent(id);
				} else {
					rootModel.bindComponent(id, node);
				}
			},
			[rootModel],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const Comp = asChild ? Slot : 'p';

		return (
			<Comp
				ref={ref}
				{...mergeSlotProps(reactProps(component.getAttributes()), restProps)}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogDescription;
