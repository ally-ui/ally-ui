import {DialogCloseModel} from '@ally-ui/core-dialog';
import {
	Slot,
	useMultipleRefs,
	useRunOnce,
	reactProps,
	mergeReactProps,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel} from './context';

export interface DialogCloseHandlers {
	onClick: React.MouseEventHandler;
}

export type DialogCloseProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	asChild?: true;
};

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	(props, forwardedRef) => {
		const {ref: _, children, asChild, onClick, ...restProps} = props;

		const rootModel = useDialogRootModel();
		if (rootModel == null) {
			throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() => new DialogCloseModel({}, rootModel));

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
				onClick?.(ev);
				component.onClick();
			},
			[component],
		);

		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				ref={ref}
				{...mergeReactProps(reactProps(component.attributes()), restProps)}
				onClick={handleClick}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogClose;
