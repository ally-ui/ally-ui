import {
	DialogRootModel,
	type DialogRootModelOptions,
} from '@ally-ui/core-dialog';
import {createSyncedOption} from '@ally-ui/solid';
import {createEffect, ParentProps} from 'solid-js';
import {createStore} from 'solid-js/store';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export interface DialogRootProps extends ParentProps, DialogRootModelOptions {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function DialogRoot(props: DialogRootProps) {
	const id = '0';
	const rootModel = new DialogRootModel(id, {
		initialOpen: props.initialOpen,
		modal: props.modal,
	});
	const [rootState, setRootState] = createStore({...rootModel.initialState});
	rootModel.setStateOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: setRootState,
	}));
	createSyncedOption({
		option: () => props.open,
		onOptionChange: (open) =>
			setRootState((prevState) => ({...prevState, open})),
		internal: () => rootState.open,
		onInternalChange: props.onOpenChange,
	});
	createEffect(function onStateUpdate() {
		rootModel.setState({...rootState});
	});
	return (
		<DialogRootModelContext.Provider value={rootModel}>
			<DialogRootStateContext.Provider value={rootState}>
				{props.children}
			</DialogRootStateContext.Provider>
		</DialogRootModelContext.Provider>
	);
}
