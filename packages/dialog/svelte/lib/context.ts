import type {
	DialogRootModel,
	DialogRootModelOptions,
	DialogRootModelState,
} from '@ally-ui/core-dialog';
import {createContext} from '@ally-ui/svelte';
import type {Readable} from 'svelte/store';

export const [getDialogRootModel, setDialogRootModel] =
	createContext<DialogRootModel>('DIALOG_ROOT_MODEL');
export const [getDialogRootState, setDialogRootState] =
	createContext<Readable<DialogRootModelOptions & DialogRootModelState>>(
		'DIALOG_ROOT_STATE',
	);
