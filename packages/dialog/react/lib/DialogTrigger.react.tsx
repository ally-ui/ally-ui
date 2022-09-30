import {
	DialogTriggerModel,
	type DialogTriggerModelAttributes,
} from '@ally-ui/core-dialog';
import {Slot, useMultipleRefs, useRunOnce} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel, useDialogRootState} from './context';

export interface DialogTriggerHandlers {
	onClick: React.MouseEventHandler;
}

export type DialogTriggerProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	asChild?: true;
};

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

		const Comp = props.asChild ? Slot : 'button';

		return (
			<Comp
				ref={ref}
				{...component.getAttributes(rootState)}
				onClick={handleClick}
			>
				{props.children}
			</Comp>
		);
	},
);

export default DialogTrigger;
