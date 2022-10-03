import {
	DialogContentModel,
	type DialogContentModelAttributes,
	type DialogContentModelOptions,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	createDelayedBindRef,
	createSyncedOption,
	Slot,
	SlottableProps,
} from '@ally-ui/solid';
import {createEffect, JSX, onCleanup, onMount, Show} from 'solid-js';
import {createStore} from 'solid-js/store';
import {useDialogRootModel, useDialogRootState} from './context';

export type DialogContentProps = SlottableProps<
	DialogContentModelAttributes,
	JSX.HTMLAttributes<HTMLDivElement>
> &
	DialogContentModelOptions;

export default function DialogContent(props: DialogContentProps) {
	const rootModel = useDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogContentModel(
		{
			forceMount: props.forceMount,
			onOpenAutoFocus: props.onOpenAutoFocus,
			onCloseAutoFocus: props.onCloseAutoFocus,
			onEscapeKeyDown: props.onEscapeKeyDown,
			onInteractOutside: props.onInteractOutside,
		},
		rootModel,
	);
	const [state, setState] = createStore(component.initialState);
	component.requestStateUpdate = setState;
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
		component.setState({...state});
	});

	const rootState = useDialogRootState() ?? rootModel.state;
	const derivedState = () => component.derived(rootState);

	onMount(() => {
		component.onMount();
	});
	onCleanup(() => {
		component.onUnmount();
		component.onDeregister();
	});

	const bindRef = createDelayedBindRef((node) => {
		if (node == null) {
			component.onUnbind();
		} else {
			component.onBind(node);
		}
	});
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Show when={derivedState().show}>
			<Slot
				ref={ref}
				props={props}
				attributes={component.attributes(rootState)}
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
