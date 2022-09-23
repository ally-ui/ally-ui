import type {DialogRootModel, DialogRootModelState} from '@ally-ui/core-dialog';
import React from 'react';

export const DialogRootModelContext = React.createContext<
	DialogRootModel | undefined
>(undefined);
export function useDialogRootModel() {
	return React.useContext(DialogRootModelContext);
}

export const DialogRootStateContext = React.createContext<
	DialogRootModelState | undefined
>(undefined);
export function useDialogRootState() {
	return React.useContext(DialogRootStateContext);
}

export const DialogPortalForceMountContext = React.createContext<
	boolean | undefined
>(undefined);
export function useDialogPortalForceMount() {
	return React.useContext(DialogPortalForceMountContext);
}
