import {
	DialogContentModel,
	DialogContentModelAttributes,
	DialogContentModelOptions,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	createDelayedBindRef,
	Slot,
	SlottableProps,
} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, Show} from 'solid-js';
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
		new DialogContentModel(rootModel, {forceMount: props.forceMount}),
	);
	const id = component.getId();

	const rootState = useDialogRootState() ?? rootModel.getState();
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
		() => rootState.open,
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
