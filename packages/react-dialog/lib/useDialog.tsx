import {DialogModel, DialogModelOptions} from '@ally-ui/core-dialog';
import {useLayoutPromise} from '@ally-ui/react-utils';
import {useState} from 'react';

export interface UseDialogOptions extends DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function useDialog({
	initialOpen,
	onOpenChange,
	open,
}: UseDialogOptions = {}) {
	const [model] = useState(() => new DialogModel({initialOpen}));

	const [state, setState] = useState(() => model.initialState);

	model.setOptions((prevOptions) => ({
		...prevOptions,
		state,
		onStateChange: setState,
	}));

	const waitForDOM = useLayoutPromise([state]);
	model.setUIOptions({waitForDOM});

	return [model, state] as const;
}
