import {DialogTriggerModel} from '@ally-ui/core-dialog';
import {
	mergeReactProps,
	reactProps,
	Slot,
	useMultipleRefs,
	useRunOnce,
} from '@ally-ui/react';
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
		const {ref: _, children, asChild, onClick, ...restProps} = props;

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
				if (!asChild) {
					onClick?.(ev);
				}
				component.onClick();
			},
			[rootModel],
		);

		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				ref={ref}
				{...mergeReactProps(
					reactProps(component.getAttributes(rootState)),
					restProps,
				)}
				onClick={handleClick}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogTrigger;
