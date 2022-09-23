import {createEffect, createSignal, ParentProps, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {
	DialogPortalForceMountContext,
	useDialogRootModel,
	useDialogRootState,
} from './context';

export type DialogPortalProps = ParentProps & {
	container?: HTMLElement | string;
	forceMount?: boolean;
};

export default function DialogPortal(props: DialogPortalProps) {
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Portal/> must be a child of `<Dialog.Root/>`');
	}
	const rootState = useDialogRootState() ?? rootModel.state;
	const [node, setNode] = createSignal<Element>();
	createEffect(function findNode() {
		if (typeof props.container === 'string') {
			setNode(globalThis.document?.querySelector(props.container) ?? undefined);
		} else {
			setNode(props.container);
		}
	});

	return (
		<DialogPortalForceMountContext.Provider value={props.forceMount}>
			<Show when={rootState.open}>
				<Portal mount={node()}>{props.children}</Portal>
			</Show>
		</DialogPortalForceMountContext.Provider>
	);
}
