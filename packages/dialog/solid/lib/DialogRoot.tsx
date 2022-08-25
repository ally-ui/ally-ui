import type {ParentProps} from 'solid-js';
import {DialogModelContext, DialogStateContext} from './context';
import createDialog, {type CreateDialogOptions} from './createDialog';

export interface DialogRootProps extends ParentProps, CreateDialogOptions {}

export default function DialogRoot(props: DialogRootProps) {
	const [model, state] = createDialog({
		initialOpen: props.initialOpen,
		onOpenChange: props.onOpenChange,
		open: props.open,
	});
	// TODO Avoid nesting context providers.
	return (
		<DialogModelContext.Provider value={model}>
			<DialogStateContext.Provider value={state}>
				{props.children}
			</DialogStateContext.Provider>
		</DialogModelContext.Provider>
	);
}
