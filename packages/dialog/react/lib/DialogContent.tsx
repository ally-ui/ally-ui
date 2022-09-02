import {
	DialogContentModel,
	DialogContentModelAttributes,
	DialogContentModelOptions,
} from '@ally-ui/core-dialog';
import {
	Slot,
	SlottableProps,
	useMultipleRefs,
	useRunOnce,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel, useDialogRootState} from './context';

export type DialogContentProps = SlottableProps<
	DialogContentModelAttributes,
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> &
	DialogContentModelOptions;

const DialogContent = React.forwardRef<HTMLElement, DialogContentProps>(
	({forceMount, ...props}, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(
				new DialogContentModel(rootModel, {forceMount}),
			),
		);
		const id = component.getId();

		const rootState = useDialogRootState() ?? rootModel.getState();
		const derivedState = component.deriveState(rootState);

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
			<>
				{derivedState.show && (
					<Slot
						slotRef={ref}
						props={props}
						attributes={component.getAttributes(rootState)}
					>
						{({ref, children, attributes}) => (
							<div ref={ref} {...attributes}>
								{children}
							</div>
						)}
					</Slot>
				)}
			</>
		);
	},
);

export default DialogContent;
