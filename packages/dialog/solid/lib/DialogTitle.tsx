import type {DialogModel} from '@ally-ui/core-dialog';
import {combinedRef} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogModelContext} from './context';

export interface DialogTitleProps
	extends JSX.HTMLAttributes<HTMLParagraphElement> {
	model?: DialogModel;
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogTitle(props: DialogTitleProps) {
	const [local, restProps] = splitProps(props, ['model', 'ref', 'children']);
	const resolvedModel = useDialogModelContext() ?? local.model;
	if (resolvedModel === undefined) {
		throw new Error(
			'<Dialog.Title/> must have a `model` prop or be a child of `<Dialog.Root/>`',
		);
	}
	const id = resolvedModel.init('title');

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
		<h1 ref={ref} {...resolvedModel.componentAttributes(id)} {...restProps}>
			{local.children}
		</h1>
	);
}
