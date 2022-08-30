import {DialogCloseModel} from '@ally-ui/core-dialog';
import {combinedRef, createBindRef, forwardEvent} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogRootModel} from './context';

export interface DialogCloseProps
	extends JSX.HTMLAttributes<HTMLButtonElement> {
	ref?: (node: HTMLButtonElement) => void;
}

export default function DialogClose(props: DialogCloseProps) {
	const [local, restProps] = splitProps(props, ['ref', 'onClick', 'children']);
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogCloseModel(rootModel, {}),
	);
	const id = component.getId();

	onMount(() => {
		rootModel.mountComponent(id);
	});
	onCleanup(() => {
		rootModel.unmountComponent(id);
	});

	const bindRef = createBindRef((node) => {
		if (node === null) {
			rootModel.unbindComponent(id);
		} else {
			rootModel.bindComponent(id, node);
		}
	});
	const ref = combinedRef(bindRef, local.ref);

	return (
		<button
			ref={ref}
			{...component.getAttributes()}
			{...restProps}
			onClick={(ev) => {
				forwardEvent(ev, local.onClick);
				component.onClick();
			}}
		>
			{local.children}
		</button>
	);
}
