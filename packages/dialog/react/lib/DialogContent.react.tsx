import {
	DialogContentModel,
	type DialogContentModelAttributes,
	type DialogContentModelOptions,
} from '@ally-ui/core-dialog';
import {
	Slot,
	SlottableProps,
	useMultipleRefs,
	useRunOnce,
	useSyncedOption,
} from '@ally-ui/react';
import React from 'react';
import {useDialogRootModel, useDialogRootState} from './context';

export type DialogContentProps = SlottableProps<
	DialogContentModelAttributes,
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> &
	DialogContentModelOptions;

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
		const rootModel = useDialogRootModel();
		if (rootModel === undefined) {
			throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
		}
		const component = useRunOnce(() =>
			rootModel.registerComponent(
				new DialogContentModel(rootModel, {
					forceMount,
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

		return (
			<>
				{derivedState.show && (
					<Slot
						slotRef={ref}
						props={props}
						attributes={component.getAttributes(rootState)}
					>
						{({ref, children, attributes}) => (
							<div ref={ref} {...attributes}>
								{children}
							</div>
						)}
					</Slot>
				)}
			</>
		);
	},
);

export default DialogContent;
