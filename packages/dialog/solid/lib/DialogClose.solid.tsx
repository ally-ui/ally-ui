import {
	DialogCloseModel,
	type DialogCloseModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	createBindRef,
	Slot,
	type SlottableProps,
} from '@ally-ui/solid';
import {JSX, onCleanup, onMount} from 'solid-js';
import {useDialogRootModel} from './context';

export interface DialogCloseHandlers {
	onClick: JSX.EventHandlerUnion<HTMLElement, Event>;
}

export type DialogCloseProps = SlottableProps<
	DialogCloseModelAttributes & DialogCloseHandlers,
	JSX.HTMLAttributes<HTMLButtonElement>
>;

export default function DialogClose(props: DialogCloseProps) {
	const rootModel = useDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogCloseModel({}, undefined, rootModel);

	onMount(() => {
		component.mount();
	});
	onCleanup(() => {
		component.unmount();
		component.unregister();
	});

	const bindRef = createBindRef((node) => {
		if (node == null) {
			component.unbind();
		} else {
			component.bind(node);
		}
	});
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Slot
			ref={ref}
			props={props}
			attributes={{
				...component.attributes(),
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
