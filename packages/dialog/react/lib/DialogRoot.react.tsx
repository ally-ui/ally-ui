import {
	DialogRootModel,
	type DialogRootModelProps,
	type DialogRootModelEvents,
} from '@ally-ui/core-dialog';
import {
	useRunOnce,
	useSyncedOption,
	type ReactEventHandlers,
} from '@ally-ui/react';
import React from 'react';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export type DialogRootProps = React.PropsWithChildren &
	DialogRootModelProps &
	ReactEventHandlers<DialogRootModelEvents>;

export default function DialogRoot({
	children,
	open,
	onOpenChange,
	initialOpen,
	modal,
}: DialogRootProps) {
	const id = React.useId();
	const rootModel = useRunOnce(
		() =>
			new DialogRootModel(
				id,
				{
					initialOpen,
					modal,
				},
				{
					openChange: onOpenChange,
				},
			),
	);
	const [rootState, setRootState] = React.useState(
		() => rootModel.state.initialValue,
	);
	useRunOnce(() => {
		rootModel.state.requestUpdate = setRootState;
	});
	// TODO #44 Reduce syncing boilerplate.
	useSyncedOption({
		option: open,
		onOptionChange: (open) =>
			setRootState((prevState) => ({...prevState, open})),
		internal: rootState.open,
		onInternalChange: onOpenChange,
	});
	useSyncedOption({
		option: modal,
		onOptionChange: (modal) => {
			setRootState((prevState) => ({...prevState, modal}));
		},
	});
	React.useEffect(
		function onStateUpdate() {
			rootModel.state.setValue(rootState);
		},
		[rootState],
	);

	return (
		<DialogRootModelContext.Provider value={rootModel}>
			<DialogRootStateContext.Provider value={rootState}>
				{children}
			</DialogRootStateContext.Provider>
		</DialogRootModelContext.Provider>
	);
}
