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
		if (rootModel == null) {
			throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() => new DialogTriggerModel({}, rootModel));

		const rootState = useDialogRootState() ?? rootModel.state;

		React.useEffect(
			function mount() {
				// component.onRegister();
				component.onMount();
				return () => {
					component.onUnmount();
					// component.onDeregister();
				};
			},
			[component],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node == null) {
					component.onUnbind();
				} else {
					component.onBind(node);
				}
			},
			[component],
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
					reactProps(component.attributes(rootState)),
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
