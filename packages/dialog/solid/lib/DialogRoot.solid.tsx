import {
	DialogRootModel,
	type DialogRootModelProps,
	type DialogRootModelEvents,
} from '@ally-ui/core-dialog';
import {
	createSyncedOption,
	useComponentModel,
	type SolidEventHandlers,
} from '@ally-ui/solid';
import type {ParentProps} from 'solid-js';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export type DialogRootProps = ParentProps &
	DialogRootModelProps &
	SolidEventHandlers<DialogRootModelEvents>;

export default function DialogRoot(props: DialogRootProps) {
	const id = '0';
	const rootModel = new DialogRootModel(
		id,
		{
			initialOpen: props.initialOpen,
			modal: props.modal,
		},
		{
			openChange: props.onOpenChange,
		},
	);
	const [rootState, setRootState] = useComponentModel(rootModel);
	// TODO #44 Reduce syncing boilerplate.
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

	return (
		<DialogRootModelContext.Provider value={rootModel}>
			<DialogRootStateContext.Provider value={rootState}>
				{props.children}
			</DialogRootStateContext.Provider>
		</DialogRootModelContext.Provider>
	);
}
