import {
	DialogContentModel,
	type DialogContentModelProps,
	type DialogContentModelEvents,
} from '@ally-ui/core-dialog';
import {
	mergeReactProps,
	reactProps,
	Slot,
	useMultipleRefs,
	useRunOnce,
	useSyncedOption,
	type ReactEventHandlers,
} from '@ally-ui/react';
import React from 'react';
import {
	useDialogPortalForceMount,
	useDialogRootModel,
	useDialogRootState,
} from './context';

export type DialogContentProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> &
	DialogContentModelProps &
	ReactEventHandlers<DialogContentModelEvents> & {
		asChild?: true;
	};

const DialogContent = React.forwardRef<HTMLElement, DialogContentProps>(
	(
		{
			forceMount,
			onOpenAutoFocus,
			onCloseAutoFocus,
			onEscapeKeyDown,
			onInteractOutside,
			children,
			asChild,
			...restProps
		},
		forwardedRef,
	) => {
		const rootModel = useDialogRootModel();
		if (rootModel == null) {
			throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
		}
		const portalForceMount = useDialogPortalForceMount();
		const component = useRunOnce(
			() =>
				new DialogContentModel(
					{
						forceMount: forceMount ?? portalForceMount,
					},
					{
						openAutoFocus: onOpenAutoFocus,
						closeAutoFocus: onCloseAutoFocus,
						escapeKeyDown: onEscapeKeyDown,
						interactOutside: onInteractOutside,
					},
					rootModel,
				),
		);

		const [state, setState] = React.useState(
			() => component.state.initialValue,
		);
		useRunOnce(() => {
			component.state.requestUpdate = setState;
		});
		// TODO #44 Reduce syncing boilerplate.
		useSyncedOption({
			option: onOpenAutoFocus,
			onOptionChange: (onOpenAutoFocus) =>
				setState((prevState) => ({...prevState, onOpenAutoFocus})),
		});
		useSyncedOption({
			option: onCloseAutoFocus,
			onOptionChange: (onCloseAutoFocus) =>
				setState((prevState) => ({...prevState, onCloseAutoFocus})),
		});
		useSyncedOption({
			option: onEscapeKeyDown,
			onOptionChange: (onEscapeKeyDown) =>
				setState((prevState) => ({...prevState, onEscapeKeyDown})),
		});
		useSyncedOption({
			option: onInteractOutside,
			onOptionChange: (onInteractOutside) =>
				setState((prevState) => ({...prevState, onInteractOutside})),
		});
		React.useEffect(
			function onStateUpdate() {
				component.state.setValue(state);
			},
			[state],
		);

		const rootState = useDialogRootState() ?? rootModel.state.value;
		const derivedState = component.derived(state, rootState);

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

		const Comp = asChild ? Slot : 'div';

		return (
			<>
				{derivedState.show && (
					<Comp
						{...mergeReactProps(
							reactProps(component.attributes(state, rootState)),
							restProps,
						)}
						ref={ref}
					>
						{children}
					</Comp>
				)}
			</>
		);
	},
);

export default DialogContent;
