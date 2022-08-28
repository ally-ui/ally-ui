import {ParentProps, splitProps} from 'solid-js';
import {DialogModelContext, DialogStateContext} from './context';
import {createDialog, type CreateDialogOptions} from './createDialog';

export interface DialogRootProps extends ParentProps, CreateDialogOptions {}

export default function DialogRoot(props: DialogRootProps) {
	const [local, restProps] = splitProps(props, [
		'initialOpen',
		'onOpenChange',
		'open',
	]);
	const [model, state] = createDialog(local);
	// TODO Avoid nesting context providers.
	return (
		<DialogModelContext.Provider value={model}>
			<DialogStateContext.Provider value={state}>
				{restProps.children}
			</DialogStateContext.Provider>
		</DialogModelContext.Provider>
	);
}
