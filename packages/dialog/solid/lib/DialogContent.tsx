import {DialogContentModel} from '@ally-ui/core-dialog';
import {combinedRef, createDelayedBindRef} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, Show, splitProps} from 'solid-js';
import {useDialogRootModel, useDialogRootState} from './context';

export interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogContent(props: DialogContentProps) {
	const [local, restProps] = splitProps(props, ['ref', 'children']);
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogContentModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = useDialogRootState() ?? rootModel.getState();

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
	const ref = combinedRef(bindRef, local.ref);

	return (
		<Show when={rootState.open}>
			<div ref={ref} {...component.getAttributes(rootState)} {...restProps}>
				{local.children}
			</div>
		</Show>
	);
}
