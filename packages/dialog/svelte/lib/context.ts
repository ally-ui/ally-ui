import type {DialogRootModel, DialogRootModelState} from '@ally-ui/core-dialog';
import {createContext} from '@ally-ui/svelte';
import type {Readable} from 'svelte/store';

export const [getDialogRootModel, setDialogRootModel] =
	createContext<DialogRootModel>('DIALOG_ROOT_MODEL');
export const [getDialogRootState, setDialogRootState] =
	createContext<Readable<DialogRootModelState>>('DIALOG_ROOT_STATE');
export const [getDialogPortalForceMount, setDialogPortalForceMount] =
	createContext<boolean | undefined>('DIALOG_PORTAL_FORCE_MOUNT');
