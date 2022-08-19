import type {DialogModel} from '@ally-ui/core-dialog';
import {getContext, setContext} from 'svelte';
import type {Readable} from 'svelte/store';

const key = Symbol('DIALOG_MODEL');
export const getDialogContext = () => getContext(key) as Readable<DialogModel>;
export const setDialogContext = (value: Readable<DialogModel>) =>
	setContext(key, value);
