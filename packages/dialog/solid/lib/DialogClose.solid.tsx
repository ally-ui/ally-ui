import {
	DialogCloseModel,
	type DialogCloseModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	Slot,
	useNodeComponentModel,
	type SlottableProps,
} from '@ally-ui/solid';
import type {JSX} from 'solid-js';
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

	const [bindRef] = useNodeComponentModel(component);
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
