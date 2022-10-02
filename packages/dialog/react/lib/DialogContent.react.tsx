import {
	DialogContentModel,
	type DialogContentModelOptions,
} from '@ally-ui/core-dialog';
import {
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
		if (rootModel === undefined) {
			throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
		}
		const portalForceMount = useDialogPortalForceMount();
		const component = useRunOnce(() =>
			rootModel.registerComponent(
				new DialogContentModel(rootModel, {
					forceMount: forceMount ?? portalForceMount,
					onOpenAutoFocus,
					onCloseAutoFocus,
					onEscapeKeyDown,
					onInteractOutside,
				}),
			),
		);
		const id = component.getId();

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
		const derivedState = component.deriveState(rootState);

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

		const Comp = asChild ? Slot : 'div';

		return (
			<>
				{derivedState.show && (
					<Comp
						ref={ref}
						{...reactProps(component.getAttributes(rootState))}
						{...restProps}
					>
						{children}
					</Comp>
				)}
			</>
		);
	},
);

export default DialogContent;
