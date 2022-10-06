import {
	DialogTriggerModel,
	type DialogTriggerModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	Slot,
	SlottableProps,
	useNodeComponentModel,
} from '@ally-ui/solid';
import type {JSX} from 'solid-js';
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
	if (rootModel == null) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogTriggerModel({}, undefined, rootModel);

	const [bindRef] = useNodeComponentModel(component);
	const ref = combinedRef(bindRef, props.ref);

	const rootState = useDialogRootState() ?? rootModel.state.value;

	return (
		<Slot
			ref={ref}
			props={props}
			attributes={{
				...component.attributes(rootState),
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
