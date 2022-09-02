import {
	DialogRootModel,
	DialogRootModelState,
	type DialogRootModelOptions,
} from '@ally-ui/core-dialog';
import {
	useRunOnce,
	useSyncedOption,
	type ReactStateProps,
} from '@ally-ui/react';
import React from 'react';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export type DialogRootProps = React.PropsWithChildren &
	DialogRootModelOptions &
	ReactStateProps<DialogRootModelState>;

export default function DialogRoot({
	children,
	initialOpen,
	modal,
	onOpenChange,
	open,
	clickOutsideDeactivates,
	escapeDeactivates,
	returnFocusTo,
}: DialogRootProps) {
	const id = React.useId();
	const rootModel = useRunOnce(
		() =>
			new DialogRootModel(id, {
				initialOpen,
				modal,
				clickOutsideDeactivates,
				escapeDeactivates,
				returnFocusTo,
			}),
	);
	const [rootState, setRootState] = React.useState(
		() => rootModel.initialState,
	);
	useRunOnce(() => {
		rootModel.requestStateUpdate = setRootState;
	});
	useSyncedOption({
		option: open,
		onOptionChange: (open) =>
			setRootState((prevState) => ({...prevState, open})),
		internal: rootState.open,
		onInternalChange: onOpenChange,
	});
	useSyncedOption({
		option: modal,
		onOptionChange: (modal) =>
			setRootState((prevState) => ({...prevState, modal})),
	});
	React.useEffect(
		function onStateUpdate() {
			rootModel.setState(rootState);
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
