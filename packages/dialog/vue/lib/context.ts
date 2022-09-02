import type {
	DialogRootModel,
	DialogRootModelOptions,
	DialogRootModelState,
} from '@ally-ui/core-dialog';
import type {InjectionKey, Ref} from 'vue';

export const DIALOG_ROOT_MODEL = Symbol(
	'DIALOG_ROOT_MODEL',
) as InjectionKey<DialogRootModel>;
export const DIALOG_ROOT_STATE = Symbol('DIALOG_ROOT_STATE') as InjectionKey<
	Ref<DialogRootModelOptions & DialogRootModelState>
>;
