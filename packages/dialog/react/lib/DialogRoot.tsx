import {DialogModel, DialogModelState} from '@ally-ui/core-dialog';
import React from 'react';
import useDialog, {UseDialogOptions} from './useDialog';

export interface DialogRootProps
	extends React.PropsWithChildren,
		UseDialogOptions {}

const DialogModelContext = React.createContext<DialogModel | undefined>(
	undefined,
);
export function useDialogModelContext() {
	return React.useContext(DialogModelContext);
}

const DialogStateContext = React.createContext<DialogModelState | undefined>(
	undefined,
);
export function useDialogStateContext() {
	return React.useContext(DialogStateContext);
}

export default function DialogRoot({children, ...options}: DialogRootProps) {
	const [model, state] = useDialog(options, {debug: true});
	// TODO Avoid nesting context providers.
	return (
		<DialogModelContext.Provider value={model}>
			<DialogStateContext.Provider value={state}>
				{children}
			</DialogStateContext.Provider>
		</DialogModelContext.Provider>
	);
}
