import {combinedRef, createBindRef} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogModelContext} from './context';

export interface DialogDescriptionProps
	extends JSX.HTMLAttributes<HTMLParagraphElement> {
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogDescription(props: DialogDescriptionProps) {
	const [local, restProps] = splitProps(props, ['ref', 'children']);
	const model = useDialogModelContext();
	if (model === undefined) {
		throw new Error(
			'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
		);
	}
	const id = model.init('description');

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
		<p ref={ref} {...model.componentAttributes(id)} {...restProps}>
			{local.children}
		</p>
	);
}
