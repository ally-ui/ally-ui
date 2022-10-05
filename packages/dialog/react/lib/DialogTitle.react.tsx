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
	({ref: _, children, asChild, ...restProps}, forwardedRef) => {
		const rootModel = useDialogRootModel();
		if (rootModel == null) {
			throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(
			() => new DialogTitleModel({}, undefined, rootModel),
		);

		React.useEffect(
			function mount() {
				// component.register();
				component.mount();
				return () => {
					component.unmount();
					// component.unregister();
				};
			},
			[component],
		);

		const bindRef = React.useCallback(
			(node: HTMLElement | null) => {
				if (node == null) {
					component.unbind();
				} else {
					component.bind(node);
				}
			},
			[component],
		);
		const ref = useMultipleRefs(bindRef, forwardedRef);

		const Comp = asChild ? Slot : 'h1';

		return (
			<Comp
				{...mergeReactProps(reactProps(component.attributes()), restProps)}
				ref={ref}
			>
				{children}
			</Comp>
		);
	},
);

export default DialogTitle;
