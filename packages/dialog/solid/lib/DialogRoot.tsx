import {
	DialogRootModel,
	DialogRootModelState,
	type DialogRootModelOptions,
} from '@ally-ui/core-dialog';
import {createSyncedOption, type SolidStateProps} from '@ally-ui/solid';
import {createEffect, ParentProps} from 'solid-js';
import {createStore} from 'solid-js/store';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export type DialogRootProps = ParentProps &
	DialogRootModelOptions &
	SolidStateProps<DialogRootModelState>;

export default function DialogRoot(props: DialogRootProps) {
	const id = '0';
	const rootModel = new DialogRootModel(id, {
		initialOpen: props.initialOpen,
		modal: props.modal,
	});
	const [rootState, setRootState] = createStore({...rootModel.initialState});
	rootModel.requestStateUpdate = setRootState;
	createSyncedOption({
		option: () => props.open,
		onOptionChange: (open) =>
			setRootState((prevState) => ({...prevState, open})),
		internal: () => rootState.open,
		onInternalChange: props.onOpenChange,
	});
	createSyncedOption({
		option: () => props.modal,
		onOptionChange: (modal) =>
			setRootState((prevState) => ({...prevState, modal})),
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
