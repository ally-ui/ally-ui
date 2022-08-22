import {type DialogModel} from '@ally-ui/core-dialog';
import React from 'react';
import useDialog, {UseDialogOptions} from './useDialog';

export interface DialogRootProps
	extends React.PropsWithChildren,
		UseDialogOptions {}

const DialogContext = React.createContext<DialogModel | undefined>(undefined);
export function useDialogContext() {
	return React.useContext(DialogContext);
}

export default function DialogRoot({children, ...options}: DialogRootProps) {
	const dialog = useDialog(options, {debug: true});
	return (
		<DialogContext.Provider
			value={dialog}
			key={dialog.getState().open ? 'open' : 'closed'}
		>
			{children}
		</DialogContext.Provider>
	);
}
