import {combinedRef, createBindRef, forwardEvent} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogModelContext} from './context';

export interface DialogCloseProps
	extends JSX.HTMLAttributes<HTMLButtonElement> {
	ref?: (node: HTMLButtonElement) => void;
}

export default function DialogClose(props: DialogCloseProps) {
	const [local, restProps] = splitProps(props, ['ref', 'onClick', 'children']);
	const model = useDialogModelContext();
	if (model === undefined) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const id = model.init('close');

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
			{...model.componentAttributes(id)}
			{...restProps}
			onClick={(ev) => {
				forwardEvent(ev, local.onClick);
				model.onCloseClick();
			}}
		>
			{local.children}
		</button>
	);
}
