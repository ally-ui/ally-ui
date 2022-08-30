import type {DialogRootModel, DialogRootModelState} from '@ally-ui/core-dialog';
import {createContext, useContext} from 'solid-js';

export const DialogRootModelContext = createContext<DialogRootModel>();
export function useDialogRootModel() {
	return useContext(DialogRootModelContext);
}

export const DialogRootStateContext = createContext<DialogRootModelState>();
export function useDialogRootState() {
	return useContext(DialogRootStateContext);
}
