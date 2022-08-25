import type {DialogModel} from '@ally-ui/core-dialog';
import {combinedRef} from '@ally-ui/solid';
import {createEffect, JSX, Show, splitProps} from 'solid-js';
import {useDialogModelContext, useDialogStateContext} from './context';

export interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	model?: DialogModel;
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogContent(props: DialogContentProps) {
	const [local, restProps] = splitProps(props, ['model', 'ref', 'children']);
	const resolvedModel = useDialogModelContext() ?? local.model;
	if (resolvedModel === undefined) {
		throw new Error(
			'<Dialog.Content/> must have a `model` prop or be a child of `<Dialog.Root/>`',
		);
	}
	const id = resolvedModel.init('content');

	const resolvedState = useDialogStateContext() ?? resolvedModel.getState();

	createEffect(function mount() {
		resolvedModel.mount(id);
		return () => {
			resolvedModel.unmount(id);
		};
	});

	const bindRef = (node: HTMLElement | null) => {
		if (node === null) {
			resolvedModel.unbindNode(id);
		} else {
			resolvedModel.bindNode(id, node);
		}
	};
	const ref = combinedRef(bindRef, local.ref);

	return (
		<Show when={resolvedState.open}>
			<div
				ref={ref}
				{...resolvedModel.componentAttributes(id, resolvedState)}
				{...restProps}
			>
				{local.children}
			</div>
		</Show>
	);
}
