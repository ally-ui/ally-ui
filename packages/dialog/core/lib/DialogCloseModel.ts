import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogCloseModelOptions {}

export interface DialogCloseModelState {}

export class DialogCloseModel extends ComponentModel<
	DialogRootModel,
	DialogCloseModelOptions,
	DialogCloseModelState
> {
	deriveInitialState(): DialogCloseModelState {
		return {};
	}

	getType(): DialogComponentType {
		return 'close';
	}

	onClick() {
		this.rootModel.getStateOptions().requestStateUpdate?.((prevState) => ({
			...prevState,
			open: false,
		}));
	}
}
