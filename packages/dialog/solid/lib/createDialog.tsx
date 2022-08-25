import {
	DialogModel,
	DialogModelOptions,
	DialogModelState,
} from '@ally-ui/core-dialog';
import {createEffect} from 'solid-js';
import {createStore} from 'solid-js/store';

export interface CreateDialogOptions extends DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export type CreateDialogValue = [DialogModel, DialogModelState];

export default function createDialog({
	initialOpen,
	onOpenChange,
	open,
}: CreateDialogOptions = {}): CreateDialogValue {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen});

	const [state, setState] = createStore(model.initialState);

	model.setOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: setState,
	}));

	createEffect(
		function onStateUpdate() {
			model.setState(state);
		},
		[state],
	);

	// const flushDOM = useLayoutPromise([state]);
	// model.setUIOptions({
	// 	flushDOM,
	// });

	return [model, state];
}
