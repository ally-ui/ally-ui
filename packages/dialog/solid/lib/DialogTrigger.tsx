import {combinedRef, createBindRef, forwardEvent} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogModelContext, useDialogStateContext} from './context';

export interface DialogTriggerProps
	extends JSX.HTMLAttributes<HTMLButtonElement> {
	ref?: (node: HTMLButtonElement) => void;
}

export default function DialogTrigger(props: DialogTriggerProps) {
	const [local, restProps] = splitProps(props, ['ref', 'onClick', 'children']);
	const model = useDialogModelContext();
	if (model === undefined) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const id = model.init('trigger');

	const resolvedState = useDialogStateContext() ?? model.getState();

	onMount(() => {
		model.mount(id);
	});
	onCleanup(() => {
		model.unmount(id);
	});

	const bindRef = createBindRef((node) => {
		if (node === null) {
			model.unbindNode(id);
		} else {
			model.bindNode(id, node);
		}
	});
	const ref = combinedRef(bindRef, local.ref);

	return (
		<button
			ref={ref}
			{...model.componentAttributes(id, resolvedState)}
			{...restProps}
			onClick={(ev) => {
				forwardEvent(ev, local.onClick);
				model.open();
			}}
		>
			{local.children}
		</button>
	);
}
