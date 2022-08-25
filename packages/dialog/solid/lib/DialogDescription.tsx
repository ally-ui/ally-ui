import type {DialogModel} from '@ally-ui/core-dialog';
import {combinedRef} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogModelContext} from './context';

export interface DialogDescriptionProps
	extends JSX.HTMLAttributes<HTMLParagraphElement> {
	model?: DialogModel;
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogDescription(props: DialogDescriptionProps) {
	const [local, restProps] = splitProps(props, ['model', 'ref', 'children']);
	const resolvedModel = useDialogModelContext() ?? local.model;
	if (resolvedModel === undefined) {
		throw new Error(
			'<Dialog.Description/> must have a `model` prop or be a child of `<Dialog.Root/>`',
		);
	}
	const id = resolvedModel.init('description');

	onMount(() => {
		resolvedModel.mount(id);
	});
	onCleanup(() => {
		resolvedModel.unmount(id);
	});

	const bindRef = (node: HTMLElement) => {
		resolvedModel.bindNode(id, node);
	};
	onCleanup(() => {
		resolvedModel.unbindNode(id);
	});
	const ref = combinedRef(bindRef, local.ref);

	return (
		<p ref={ref} {...resolvedModel.componentAttributes(id)} {...restProps}>
			{local.children}
		</p>
	);
}
