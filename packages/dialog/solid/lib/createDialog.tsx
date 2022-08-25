import {
	DialogModel,
	DialogModelOptions,
	DialogModelState,
} from '@ally-ui/core-dialog';
import {createSyncedOption} from '@ally-ui/solid';
import {createEffect} from 'solid-js';
import {createStore} from 'solid-js/store';

export interface CreateDialogOptions extends DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export type CreateDialogValue = [DialogModel, DialogModelState];

export function createDialog(
	props: CreateDialogOptions = {},
): CreateDialogValue {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen: props.initialOpen});

	const [state, setState] = createStore(model.initialState);

	model.setOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: setState,
	}));

	createSyncedOption({
		option: () => props.open,
		onOptionChange: (open) => {
			setState((prevState) => ({...prevState, open}));
		},
		internal: () => state.open,
		onInternalChange: props.onOpenChange,
	});

	createEffect(function onStateUpdate() {
		model.setState({...state});
	});

	return [model, state];
}
