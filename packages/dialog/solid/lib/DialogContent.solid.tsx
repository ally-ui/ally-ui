import {
	DialogContentModel,
	type DialogContentModelAttributes,
	type DialogContentModelProps,
	type DialogContentModelEvents,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	createDelayedBindRef,
	createSyncedOption,
	Slot,
	SlottableProps,
	SolidEventHandlers,
} from '@ally-ui/solid';
import {createEffect, JSX, onCleanup, onMount, Show} from 'solid-js';
import {createStore} from 'solid-js/store';
import {useDialogRootModel, useDialogRootState} from './context';

export type DialogContentProps = SlottableProps<
	DialogContentModelAttributes,
	JSX.HTMLAttributes<HTMLDivElement>
> &
	DialogContentModelProps &
	SolidEventHandlers<DialogContentModelEvents>;

export default function DialogContent(props: DialogContentProps) {
	const rootModel = useDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogContentModel(
		{
			forceMount: props.forceMount,
		},
		{
			openAutoFocus: props.onOpenAutoFocus,
			closeAutoFocus: props.onCloseAutoFocus,
			escapeKeyDown: props.onEscapeKeyDown,
			interactOutside: props.onInteractOutside,
		},
		rootModel,
	);
	const [state, setState] = createStore(component.state.initialValue);
	component.state.requestUpdate = setState;
	// TODO #44 Reduce syncing boilerplate.
	createSyncedOption({
		option: () => props.onOpenAutoFocus,
		onOptionChange: (onOpenAutoFocus) =>
			setState((prevState) => ({...prevState, onOpenAutoFocus})),
	});
	createSyncedOption({
		option: () => props.onCloseAutoFocus,
		onOptionChange: (onCloseAutoFocus) =>
			setState((prevState) => ({...prevState, onCloseAutoFocus})),
	});
	createSyncedOption({
		option: () => props.onEscapeKeyDown,
		onOptionChange: (onEscapeKeyDown) =>
			setState((prevState) => ({...prevState, onEscapeKeyDown})),
	});
	createSyncedOption({
		option: () => props.onInteractOutside,
		onOptionChange: (onInteractOutside) =>
			setState((prevState) => ({...prevState, onInteractOutside})),
	});
	createEffect(function onStateUpdate() {
		component.state.setValue({...state});
	});

	const rootState = useDialogRootState() ?? rootModel.state.value;
	const derivedState = () => component.derived(state, rootState);

	onMount(() => {
		component.mount();
	});
	onCleanup(() => {
		component.unmount();
		component.unregister();
	});

	const bindRef = createDelayedBindRef((node) => {
		if (node == null) {
			component.unbind();
		} else {
			component.bind(node);
		}
	});
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Show when={derivedState().show}>
			<Slot
				ref={ref}
				props={props}
				attributes={component.attributes(state, rootState)}
			>
				{(renderProps) => (
					<div ref={renderProps.ref} {...renderProps.attributes()}>
						{renderProps.children}
					</div>
				)}
			</Slot>
		</Show>
	);
}
