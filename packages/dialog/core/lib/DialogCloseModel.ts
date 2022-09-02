import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogCloseModelOptions {}

export interface DialogCloseModelReactive {}

export type DialogCloseModelState = DialogCloseModelOptions &
	DialogCloseModelReactive;

export interface DialogCloseModelDerived {}

export interface DialogCloseModelAttributes {}

export class DialogCloseModel extends ComponentModel<
	DialogRootModel,
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
