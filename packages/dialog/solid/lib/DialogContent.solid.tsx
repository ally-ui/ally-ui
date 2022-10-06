import {
	DialogContentModel,
	type DialogContentModelAttributes,
	type DialogContentModelProps,
	type DialogContentModelEvents,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	useNodeComponentModel,
	Slot,
	SlottableProps,
	SolidEventHandlers,
} from '@ally-ui/solid';
import {createEffect, JSX, Show} from 'solid-js';
import {useDialogRootModel, useDialogRootState} from './context';

export type DialogContentProps = SlottableProps<
	DialogContentModelAttributes,
	JSX.HTMLAttributes<HTMLDivElement>
> &
	DialogContentModelProps &
	SolidEventHandlers<DialogContentModelEvents>;

export default function DialogContent(props: DialogContentProps) {
	const rootModel = useDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogContentModel(
		{
			forceMount: props.forceMount,
		},
		{
			openAutoFocus: props.onOpenAutoFocus,
			closeAutoFocus: props.onCloseAutoFocus,
			escapeKeyDown: props.onEscapeKeyDown,
			interactOutside: props.onInteractOutside,
		},
		rootModel,
	);

	const [bindRef, state] = useNodeComponentModel(component, {delayBind: true});
	const ref = combinedRef(bindRef, props.ref);

	createEffect(() => {
		component.events = {
			openAutoFocus: props.onOpenAutoFocus,
			closeAutoFocus: props.onCloseAutoFocus,
			escapeKeyDown: props.onEscapeKeyDown,
			interactOutside: props.onInteractOutside,
		};
	});

	const rootState = useDialogRootState() ?? rootModel.state.value;
	const derivedState = () => component.derived(state, rootState);

	return (
		<Show when={derivedState().show}>
			<Slot
				ref={ref}
				props={props}
				attributes={component.attributes(rootState)}
			>
				{(renderProps) => (
					<div ref={renderProps.ref} {...renderProps.attributes()}>
						{renderProps.children}
					</div>
				)}
			</Slot>
		</Show>
	);
}
