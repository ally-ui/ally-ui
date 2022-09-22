import React from 'react';
import {PortalFunctionParams, PortalWithState} from 'react-portal';
import {
	DialogPortalForceMountContext,
	useDialogRootModel,
	useDialogRootState,
} from './context';

export type DialogPortalProps = React.PropsWithChildren & {
	container?: HTMLElement | string;
	forceMount?: boolean;
};

export default function DialogPortal({
	container,
	forceMount,
	children,
}: DialogPortalProps) {
	const [node, setNode] = React.useState<Element>();
	React.useEffect(
		function findNode() {
			if (typeof container === 'string') {
				setNode(globalThis.document?.querySelector(container) ?? undefined);
			} else {
				setNode(container);
			}
		},
		[container],
	);
	return (
		<DialogPortalForceMountContext.Provider value={forceMount}>
			<PortalWithState
				node={node}
				defaultOpen={forceMount}
				closeOnEsc={false}
				closeOnOutsideClick={false}
			>
				{(renderProps) => (
					<DialogPortalManager {...renderProps}>{children}</DialogPortalManager>
				)}
			</PortalWithState>
		</DialogPortalForceMountContext.Provider>
	);
}

type DialogPortalManagerProps = React.PropsWithChildren & PortalFunctionParams;

function DialogPortalManager({
	openPortal,
	closePortal,
	portal,
	children,
}: DialogPortalManagerProps) {
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Portal/> must be a child of `<Dialog.Root/>`');
	}
	const rootState = useDialogRootState() ?? rootModel.state;
	React.useEffect(
		function syncPortalOpen() {
			if (rootState.open) {
				openPortal();
			} else {
				closePortal();
			}
		},
		[rootState.open],
	);
	return portal(children);
}
