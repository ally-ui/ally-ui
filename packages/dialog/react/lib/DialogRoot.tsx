import {type DialogModel} from '@ally-ui/core-dialog';
import React from 'react';

export interface DialogRootProps extends React.PropsWithChildren {
	model: DialogModel;
}

const DialogContext = React.createContext<DialogModel | undefined>(undefined);
export function useDialogContext() {
	return React.useContext(DialogContext);
}

function DialogRoot({model, children}: DialogRootProps) {
	return (
		<DialogContext.Provider value={model}>{children}</DialogContext.Provider>
	);
}

export default DialogRoot;
