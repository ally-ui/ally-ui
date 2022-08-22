import type {DialogModel} from '@ally-ui/core-dialog';
import {getContext, setContext} from 'svelte';
import type {Readable} from 'svelte/store';

const KEY = Symbol('DIALOG_MODEL');
export const getDialogContext = () => getContext(KEY) as Readable<DialogModel>;
export const setDialogContext = (value: Readable<DialogModel>) =>
	setContext(KEY, value);
