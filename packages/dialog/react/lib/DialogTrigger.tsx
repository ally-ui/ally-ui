import {
	DialogTriggerModel,
	type DialogTriggerModelAttributes,
} from '@ally-ui/core-dialog';
import {
	Slot,
	useMultipleRefs,
	useRunOnce,
	type SlottableProps,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel, useDialogRootState} from './context';

export interface DialogTriggerHandlers {
	onClick: React.MouseEventHandler;
}

export type DialogTriggerProps = SlottableProps<
	DialogTriggerModelAttributes & DialogTriggerHandlers,
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
>;

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
	(props, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(new DialogTriggerModel(rootModel, {})),
		);
		const id = component.getId();

		const rootState = useDialogRootState() ?? rootModel.state;

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
					...component.getAttributes(rootState),
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

export default DialogTrigger;
