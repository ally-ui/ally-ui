import {DialogModelContext, DialogStateContext} from './context';
import {useDialog, type UseDialogOptions} from './useDialog';

export interface DialogRootProps
	extends React.PropsWithChildren,
		UseDialogOptions {}

export default function DialogRoot({children, ...options}: DialogRootProps) {
	const [model, state] = useDialog(options);
	// TODO Avoid nesting context providers.
	return (
		<DialogModelContext.Provider value={model}>
			<DialogStateContext.Provider value={state}>
				{children}
			</DialogStateContext.Provider>
		</DialogModelContext.Provider>
	);
}
