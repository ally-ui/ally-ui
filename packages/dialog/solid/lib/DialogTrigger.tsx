import {
	DialogTriggerModel,
	DialogTriggerModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	createBindRef,
	forwardEvent,
	Slot,
	SlottableProps,
} from '@ally-ui/solid';
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
	const ref = combinedRef(bindRef, props.ref);

	const handleClick: DialogTriggerHandlers['onClick'] = (ev) => {
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
			attributes={{...component.getAttributes(rootState), onClick: handleClick}}
		>
			{(renderProps) => (
				<button ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</button>
			)}
		</Slot>
	);
}
