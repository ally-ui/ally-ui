import type {DialogModel, DialogModelState} from '@ally-ui/core-dialog';
import {createContext, useContext} from 'solid-js';

export const DialogModelContext = createContext<DialogModel>();
export function useDialogModelContext() {
	return useContext(DialogModelContext);
}

export const DialogStateContext = createContext<DialogModelState>();
export function useDialogStateContext() {
	return useContext(DialogStateContext);
}
