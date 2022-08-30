import {
	DialogRootModel,
	type DialogRootModelOptions,
} from '@ally-ui/core-dialog';
import {useRunOnce, useSyncedOption} from '@ally-ui/react';
import React from 'react';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export interface DialogRootProps
	extends React.PropsWithChildren,
		DialogRootModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function DialogRoot({
	children,
	initialOpen,
	onOpenChange,
	open,
}: DialogRootProps) {
	const id = React.useId();
	const rootModel = useRunOnce(() => new DialogRootModel(id, {initialOpen}));
	const [rootState, setRootState] = React.useState(
		() => rootModel.initialState,
	);
	useRunOnce(() => {
		rootModel.setStateOptions((prevOptions) => ({
			...prevOptions,
			requestStateUpdate: setRootState,
		}));
	});
	useSyncedOption({
		option: open,
		onOptionChange: (open) =>
			setRootState((prevState) => ({...prevState, open})),
		internal: rootState.open,
		onInternalChange: onOpenChange,
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
