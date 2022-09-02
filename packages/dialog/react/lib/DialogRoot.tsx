import {
	DialogRootModel,
	type DialogRootModelOptions,
	type DialogRootModelReactive,
} from '@ally-ui/core-dialog';
import {
	useRunOnce,
	useSyncedOption,
	type ReactReactiveProps,
} from '@ally-ui/react';
import React from 'react';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export type DialogRootProps = React.PropsWithChildren &
	DialogRootModelOptions &
	ReactReactiveProps<DialogRootModelReactive>;

export default function DialogRoot({
	children,
	open,
	onOpenChange,
	initialOpen,
	modal,
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
	useSyncedOption({
		option: clickOutsideDeactivates,
		onOptionChange: (clickOutsideDeactivates) =>
			setRootState((prevState) => ({...prevState, clickOutsideDeactivates})),
	});
	useSyncedOption({
		option: escapeDeactivates,
		onOptionChange: (escapeDeactivates) =>
			setRootState((prevState) => ({...prevState, escapeDeactivates})),
	});
	useSyncedOption({
		option: returnFocusTo,
		onOptionChange: (returnFocusTo) =>
			setRootState((prevState) => ({...prevState, returnFocusTo})),
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
