import {
	DialogCloseModel,
	type DialogCloseModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	createBindRef,
	forwardEvent,
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

	const handleClick: DialogCloseHandlers['onClick'] = (ev) => {
		if (!props.asChild) {
			forwardEvent(
				ev as MouseEvent & {
					currentTarget: HTMLButtonElement;
					target: Element;
				},
				props.onClick,
			);
		}
		component.onClick();
	};

	return (
		<Slot
			ref={ref}
			props={props}
			attributes={{...component.getAttributes(), onClick: handleClick}}
			mergeProps={(attributes, userProps) => ({
				...attributes,
				...userProps,
				onClick: (ev) => {
					forwardEvent(ev, userProps.onClick);
					attributes.onClick(ev);
				},
			})}
		>
			{(renderProps) => (
				<button ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</button>
			)}
		</Slot>
	);
}
