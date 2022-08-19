import type {DialogModel} from '@ally-ui/core-dialog';
import {createContext} from '@ally-ui/svelte';
import type {Readable} from 'svelte/store';

export const {get: getDialogContext, set: setDialogContext} =
	createContext<Readable<DialogModel>>();
