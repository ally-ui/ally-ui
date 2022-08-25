import {
	DialogModel,
	DialogModelOptions,
	DialogModelState,
} from '@ally-ui/core-dialog';
import {useRunOnce, useSyncedOption} from '@ally-ui/react';
import React from 'react';

export interface UseDialogOptions extends DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export type UseDialogValue = [DialogModel, DialogModelState];

export function useDialog({
	initialOpen,
	onOpenChange,
	open,
}: UseDialogOptions = {}): UseDialogValue {
	const id = React.useId();
	const model = useRunOnce(() => new DialogModel(id, {initialOpen}));

	const [state, setState] = React.useState(() => model.initialState);

	useRunOnce(() =>
		model.setOptions((prevOptions) => ({
			...prevOptions,
			requestStateUpdate: setState,
		})),
	);

	useSyncedOption({
		option: open,
		onOptionChange: (open) => {
			setState((prevState) => ({...prevState, open}));
		},
		internal: state.open,
		onInternalChange: onOpenChange,
	});

	React.useEffect(
		function onStateUpdate() {
			model.setState(state);
		},
		[state],
	);

	return [model, state];
}
