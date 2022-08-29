import {DialogModel, DialogModelOptions} from '@ally-ui/core-dialog';
import {createSyncedOption} from '@ally-ui/solid';
import {createEffect, ParentProps} from 'solid-js';
import {createStore} from 'solid-js/store';
import {DialogModelContext, DialogStateContext} from './context';

export interface DialogRootProps extends ParentProps, DialogModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function DialogRoot(props: DialogRootProps) {
	const id = '0';
	const model = new DialogModel(id, {initialOpen: props.initialOpen});
	const [state, setState] = createStore({...model.initialState});
	model.setOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: setState,
	}));
	createSyncedOption({
		option: () => props.open,
		onOptionChange: (open) => setState((prevState) => ({...prevState, open})),
		internal: () => state.open,
		onInternalChange: props.onOpenChange,
	});
	createEffect(function onStateUpdate() {
		model.setState({...state});
	});
	return (
		<DialogModelContext.Provider value={model}>
			<DialogStateContext.Provider value={state}>
				{props.children}
			</DialogStateContext.Provider>
		</DialogModelContext.Provider>
	);
}
