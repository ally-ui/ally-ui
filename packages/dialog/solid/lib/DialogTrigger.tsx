import {DialogTriggerModel} from '@ally-ui/core-dialog';
import {combinedRef, createBindRef, forwardEvent} from '@ally-ui/solid';
import {JSX, onCleanup, onMount, splitProps} from 'solid-js';
import {useDialogRootModel, useDialogRootState} from './context';

export interface DialogTriggerProps
	extends JSX.HTMLAttributes<HTMLButtonElement> {
	ref?: (node: HTMLButtonElement) => void;
}

export default function DialogTrigger(props: DialogTriggerProps) {
	const [local, restProps] = splitProps(props, ['ref', 'onClick', 'children']);
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTriggerModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = useDialogRootState() ?? rootModel.getState();

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
			{...component.getAttributes(rootState)}
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
