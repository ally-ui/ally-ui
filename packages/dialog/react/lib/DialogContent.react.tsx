import {
	DialogContentModel,
	type DialogContentModelOptions,
} from '@ally-ui/core-dialog';
import {
	mergeReactProps,
	reactProps,
	Slot,
	useMultipleRefs,
	useRunOnce,
	useSyncedOption,
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
	DialogContentModelOptions & {
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
			...props
		},
		forwardedRef,
	) => {
		const {ref: _, children, asChild, ...restProps} = props;

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
						onOpenAutoFocus,
						onCloseAutoFocus,
						onEscapeKeyDown,
						onInteractOutside,
					},
					rootModel,
				),
		);

		const [state, setState] = React.useState(() => component.initialState);
		useRunOnce(() => {
			component.requestStateUpdate = setState;
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
				component.setState(state);
			},
			[state],
		);

		const rootState = useDialogRootState() ?? rootModel.state;
		const derivedState = component.derived(rootState);

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

		const Comp = asChild ? Slot : 'div';

		return (
			<>
				{derivedState.show && (
					<Comp
						ref={ref}
						{...mergeReactProps(
							reactProps(component.attributes(rootState)),
							restProps,
						)}
					>
						{children}
					</Comp>
				)}
			</>
		);
	},
);

export default DialogContent;
