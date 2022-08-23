import type {DevOptions} from '@ally-ui/core';
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

export default function useDialog(
	{initialOpen, onOpenChange, open}: UseDialogOptions = {},
	devOptions: DevOptions = {},
): UseDialogValue {
	const id = React.useId();
	const model = useRunOnce(
		() => new DialogModel(id, {initialOpen}, devOptions),
	);

	const [state, setState] = React.useState(() => model.initialState);

	useSyncOption({
		option: open,
		onOptionChange: (open) => {
			setState((prevState) => ({...prevState, open}));
		},
		internal: state.open,
		onInternalChange: onOpenChange,
	});

	model.setOptions((prevOptions) => ({
		...prevOptions,
		state,
		onStateChange: setState,
	}));

	const flushDOM = useLayoutPromise([state]);
	model.setUIOptions({
		flushDOM,
	});

	return [model, state];
}
