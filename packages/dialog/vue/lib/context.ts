import {DialogModel, DialogModelState} from '@ally-ui/core-dialog';
import type {InjectionKey, Ref} from 'vue';

export const modelKey = Symbol('DIALOG_MODEL') as InjectionKey<DialogModel>;
export const stateKey = Symbol('DIALOG_STATE') as InjectionKey<
	Ref<DialogModelState>
>;
