import {
	DialogCloseModel,
	type DialogCloseModelAttributes,
} from '@ally-ui/core-dialog';
import {
	Slot,
	SlottableProps,
	useMultipleRefs,
	useRunOnce,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export interface DialogCloseHandlers {
	onClick: React.MouseEventHandler;
}

export type DialogCloseProps = SlottableProps<
	DialogCloseModelAttributes & DialogCloseHandlers,
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
>;

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	(props, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(new DialogCloseModel(rootModel, {})),
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

		const handleClick = React.useCallback<
			React.MouseEventHandler<HTMLButtonElement>
		>(
			(ev) => {
				if (!props.asChild) {
					props.onClick?.(ev);
				}
				component.onClick();
			},
			[rootModel],
		);

		return (
			<Slot
				slotRef={ref}
				props={props}
				attributes={{
					...component.getAttributes(),
					onClick: handleClick,
				}}
			>
				{({ref, children, attributes}) => (
					<button ref={ref} {...attributes}>
						{children}
					</button>
				)}
			</Slot>
		);
	},
);

export default DialogClose;
