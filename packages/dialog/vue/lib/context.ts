import type {DialogRootModel, DialogRootModelState} from '@ally-ui/core-dialog';
import type {InjectionKey, Ref} from 'vue';

export const DIALOG_ROOT_MODEL = Symbol(
	'DIALOG_ROOT_MODEL',
) as InjectionKey<DialogRootModel>;
export const DIALOG_ROOT_STATE = Symbol('DIALOG_ROOT_STATE') as InjectionKey<
	Ref<DialogRootModelState>
>;
export const DIALOG_PORTAL_FORCE_MOUNT = Symbol(
	'DIALOG_PORTAL_FORCE_MOUNT',
) as InjectionKey<boolean | undefined>;
