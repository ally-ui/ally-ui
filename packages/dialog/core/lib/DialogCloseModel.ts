import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogCloseModelOptions {}

export interface DialogCloseModelState {}

export interface DialogCloseModelDerived {}

export interface DialogCloseModelAttributes {}

export class DialogCloseModel extends ComponentModel<
	DialogRootModel,
	DialogCloseModelOptions,
	DialogCloseModelState,
	DialogCloseModelDerived,
	DialogCloseModelAttributes
> {
	getType(): DialogComponentType {
		return 'close';
	}

	onClick() {
		this.rootModel.requestStateUpdate?.((prevState) => ({
			...prevState,
			open: false,
		}));
	}
}
