import {
	DialogTitleModel,
	type DialogTitleModelAttributes,
} from '@ally-ui/core-dialog';
import {reactProps, Slot, useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export type DialogTitleProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLHeadingElement>,
	HTMLHeadingElement
> & {
	asChild?: true;
};

const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(
	(props, forwardedRef) => {
		const {ref: _, children, asChild, ...restProps} = props;

		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(new DialogTitleModel(rootModel, {})),
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

		const Comp = asChild ? Slot : 'h1';

		return (
			<Comp ref={ref} {...reactProps(component.getAttributes())} {...restProps}>
				{children}
			</Comp>
		);
	},
);

export default DialogTitle;
