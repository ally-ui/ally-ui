import {
	DialogModel,
	DialogModelOptions,
	DialogModelState,
} from '@ally-ui/core-dialog';
import {useLayoutPromise, useRunOnce, useSyncOption} from '@ally-ui/react';
import React from 'react';

export interface UseDialogOptions extends DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export type UseDialogValue = [DialogModel, DialogModelState];

export default function useDialog({
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

	useSyncOption({
		option: open,
		onOptionChange: (open) => {
			setState((prevState) => ({...prevState, open}));
		},
		internal: state.open,
		onInternalChange: onOpenChange,
	});

	React.useEffect(
		function updateState() {
			model.setState(state);
		},
		[state],
	);

	const flushDOM = useLayoutPromise([state]);
	model.setUIOptions({
		flushDOM,
	});

	return [model, state];
}
