import {DialogTitleModel} from '@ally-ui/core-dialog';
import {
	mergeReactProps,
	reactProps,
	Slot,
	useMultipleRefs,
	useRunOnce,
} from '@ally-ui/react';
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
		if (rootModel == null) {
			throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() => new DialogTitleModel({}, rootModel));

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

		const Comp = asChild ? Slot : 'h1';

		return (
			<Comp
				ref={ref}
				{...mergeReactProps(reactProps(component.attributes()), restProps)}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogTitle;
