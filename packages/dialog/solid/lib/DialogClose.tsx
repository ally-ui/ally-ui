import type {DialogModel} from '@ally-ui/core-dialog';
import {combinedRef, forwardEvent} from '@ally-ui/solid';
import {createEffect, JSX, splitProps} from 'solid-js';
import {useDialogModelContext} from './context';

export interface DialogCloseProps
	extends JSX.HTMLAttributes<HTMLButtonElement> {
	model?: DialogModel;
	ref?: (node: HTMLButtonElement) => void;
}

export default function DialogClose(props: DialogCloseProps) {
	const [local, restProps] = splitProps(props, [
		'model',
		'ref',
		'onClick',
		'children',
	]);
	const resolvedModel = useDialogModelContext() ?? local.model;
	if (resolvedModel === undefined) {
		throw new Error(
			'<Dialog.Close/> must have a `model` prop or be a child of `<Dialog.Root/>`',
		);
	}
	const id = resolvedModel.init('close');

	createEffect(
		function mount() {
			resolvedModel.mount(id);
			return () => {
				resolvedModel.unmount(id);
			};
		},
		[resolvedModel],
	);

	const bindRef = (node: HTMLElement | null) => {
		if (node === null) {
			resolvedModel.unbindNode(id);
		} else {
			resolvedModel.bindNode(id, node);
		}
	};
	const ref = combinedRef(bindRef, local.ref);

	return (
		<button
			ref={ref}
			{...resolvedModel.componentAttributes(id)}
			{...restProps}
			onClick={(ev) => {
				forwardEvent(ev, local.onClick);
				resolvedModel.close();
			}}
		>
			{local.children}
		</button>
	);
}
