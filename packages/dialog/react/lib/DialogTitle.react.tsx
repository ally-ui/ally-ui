import {
	DialogTitleModel,
	type DialogTitleModelAttributes,
} from '@ally-ui/core-dialog';
import {
	Slot,
	SlottableProps,
	useMultipleRefs,
	useRunOnce,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export type DialogTitleProps = SlottableProps<
	DialogTitleModelAttributes,
	React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLHeadingElement>,
		HTMLHeadingElement
	>
>;

const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(
	(props, forwardedRef) => {
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

		return (
			<Slot slotRef={ref} props={props} attributes={component.getAttributes()}>
				{({ref, attributes, children}) => (
					<h1 ref={ref} {...attributes}>
						{children}
					</h1>
				)}
			</Slot>
		);
	},
);

export default DialogTitle;
