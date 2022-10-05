import {DialogTriggerModel} from '@ally-ui/core-dialog';
import {
	mergeReactProps,
	reactProps,
	Slot,
	useMultipleRefs,
	useNodeComponentModel,
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
	({ref: _, children, asChild, onClick, ...restProps}, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel == null) {
			throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(
			() => new DialogTriggerModel({}, undefined, rootModel),
		);
		const [bindRef] = useNodeComponentModel(component);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const rootState = useDialogRootState() ?? rootModel.state.value;

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
				{...mergeReactProps(
					reactProps(component.attributes(rootState)),
					restProps,
				)}
				ref={ref}
				onClick={handleClick}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogTrigger;
