import {combinedRef, createDelayedBindRef} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, Show, splitProps} from 'solid-js';
import {useDialogModelContext, useDialogStateContext} from './context';

export interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogContent(props: DialogContentProps) {
	const [local, restProps] = splitProps(props, ['ref', 'children']);
	const model = useDialogModelContext();
	if (model === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const id = model.init('content');

	const resolvedState = useDialogStateContext() ?? model.getState();

	onMount(() => {
		model.mount(id);
	});
	onCleanup(() => {
		model.unmount(id);
	});

	const bindRef = createDelayedBindRef(
		(node) => {
			if (node === null) {
				model.unbindNode(id);
			} else {
				model.bindNode(id, node);
			}
		},
		() => resolvedState.open,
	);
	const ref = combinedRef(bindRef, local.ref);

	return (
		<Show when={resolvedState.open}>
			<div
				ref={ref}
				{...model.componentAttributes(id, resolvedState)}
				{...restProps}
			>
				{local.children}
			</div>
		</Show>
	);
}
