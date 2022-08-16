import {DialogModel, DialogModelOptions} from '@ally-ui/core-dialog';
import {
	useLayoutPromise,
	useRunOnce,
	useSyncOption,
} from '@ally-ui/react-utils';
import {useId, useState} from 'react';

export interface UseDialogOptions extends DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function useDialog({
	initialOpen,
	onOpenChange,
	open,
}: UseDialogOptions = {}): DialogModel {
	const id = useId();
	const model = useRunOnce(() => new DialogModel(id, {initialOpen}));

	const [state, setState] = useState(() => model.initialState);

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

	const waitForDOM = useLayoutPromise([state]);
	model.setUIOptions({waitForDOM});

	return model;
}
