import type {DialogModel, DialogModelState} from '@ally-ui/core-dialog';
import type {InjectionKey, Ref} from 'vue';

export const MODEL_KEY = Symbol('DIALOG_MODEL') as InjectionKey<DialogModel>;
export const STATE_KEY = Symbol('DIALOG_STATE') as InjectionKey<
	Ref<DialogModelState>
>;
