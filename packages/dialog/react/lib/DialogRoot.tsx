import {DialogModel, DialogModelOptions} from '@ally-ui/core-dialog';
import {useRunOnce, useSyncedOption} from '@ally-ui/react';
import React from 'react';
import {DialogModelContext, DialogStateContext} from './context';

export interface DialogRootProps
	extends React.PropsWithChildren,
		DialogModelOptions {
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
	const model = useRunOnce(() => new DialogModel(id, {initialOpen}));
	const [state, setState] = React.useState(() => model.initialState);
	useRunOnce(() => {
		model.setOptions((prevOptions) => ({
			...prevOptions,
			requestStateUpdate: setState,
		}));
	});
	useSyncedOption({
		option: open,
		onOptionChange: (open) => setState((prevState) => ({...prevState, open})),
		internal: state.open,
		onInternalChange: onOpenChange,
	});
	React.useEffect(
		function onStateUpdate() {
			model.setState(state);
		},
		[state],
	);

	// TODO Avoid nesting context providers.
	return (
		<DialogModelContext.Provider value={model}>
			<DialogStateContext.Provider value={state}>
				{children}
			</DialogStateContext.Provider>
		</DialogModelContext.Provider>
	);
}
