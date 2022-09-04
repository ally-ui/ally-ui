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
	if (rootModel === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogContentModel(rootModel, {
			forceMount: props.forceMount,
			onActivateAutoFocus: props.onActivateAutoFocus,
			onDeactivateAutoFocus: props.onDeactivateAutoFocus,
			onEscapeKeyDown: props.onEscapeKeyDown,
			onInteractOutside: props.onInteractOutside,
		}),
	);
	const id = component.getId();
	const [state, setState] = createStore(component.initialState);
	component.requestStateUpdate = setState;
	// TODO #44 Reduce syncing boilerplate.
	createSyncedOption({
		option: () => props.onActivateAutoFocus,
		onOptionChange: (onActivateAutoFocus) =>
			setState((prevState) => ({...prevState, onActivateAutoFocus})),
	});
	createSyncedOption({
		option: () => props.onDeactivateAutoFocus,
		onOptionChange: (onDeactivateAutoFocus) =>
			setState((prevState) => ({...prevState, onDeactivateAutoFocus})),
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
	const derivedState = () => component.deriveState(rootState);

	onMount(() => {
		rootModel.mountComponent(id);
	});
	onCleanup(() => {
		rootModel.unmountComponent(id);
	});

	const bindRef = createDelayedBindRef(
		(node) => {
			if (node === null) {
				rootModel.unbindComponent(id);
			} else {
				rootModel.bindComponent(id, node);
			}
		},
		() => derivedState().show,
	);
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Show when={derivedState().show}>
			<Slot
				ref={ref}
				props={props}
				attributes={component.getAttributes(rootState)}
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
