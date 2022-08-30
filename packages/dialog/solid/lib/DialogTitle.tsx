import {DialogTitleModel} from '@ally-ui/core-dialog';
import {combinedRef, createBindRef} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogRootModel} from './context';

export interface DialogTitleProps
	extends JSX.HTMLAttributes<HTMLParagraphElement> {
	ref?: (node: HTMLDivElement) => void;
}

export default function DialogTitle(props: DialogTitleProps) {
	const [local, restProps] = splitProps(props, ['ref', 'children']);
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTitleModel(rootModel, {}),
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
		<h1 ref={ref} {...component.getAttributes.bind(component)()} {...restProps}>
			{local.children}
		</h1>
	);
}
