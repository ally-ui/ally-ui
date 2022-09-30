import {
	DialogTriggerModel,
	type DialogTriggerModelAttributes,
} from '@ally-ui/core-dialog';
import {combinedRef, createBindRef, Slot, SlottableProps} from '@ally-ui/solid';
import {JSX, onCleanup, onMount} from 'solid-js';
import {useDialogRootModel, useDialogRootState} from './context';

export interface DialogTriggerHandlers {
	onClick: JSX.EventHandlerUnion<HTMLElement, Event>;
}

export type DialogTriggerProps = SlottableProps<
	DialogTriggerModelAttributes & DialogTriggerHandlers,
	JSX.HTMLAttributes<HTMLButtonElement>
>;

export default function DialogTrigger(props: DialogTriggerProps) {
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTriggerModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = useDialogRootState() ?? rootModel.state;

	onMount(() => {
		rootModel.mountComponent(id);
	});
	onCleanup(() => {
		rootModel.unmountComponent(id);
		rootModel.deregisterComponent(id);
	});

	const bindRef = createBindRef((node) => {
		if (node === null) {
			rootModel.unbindComponent(id);
		} else {
			rootModel.bindComponent(id, node);
		}
	});
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Slot
			ref={ref}
			props={props}
			attributes={{
				...component.getAttributes(rootState),
				onClick: () => component.onClick(),
			}}
		>
			{(renderProps) => (
				<button ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</button>
			)}
		</Slot>
	);
}
