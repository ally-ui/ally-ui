import {DialogModel, DialogModelState} from '@ally-ui/core-dialog';
import React from 'react';

export const DialogModelContext = React.createContext<DialogModel | undefined>(
	undefined,
);
export function useDialogModelContext() {
	return React.useContext(DialogModelContext);
}

export const DialogStateContext = React.createContext<
	DialogModelState | undefined
>(undefined);
export function useDialogStateContext() {
	return React.useContext(DialogStateContext);
}
