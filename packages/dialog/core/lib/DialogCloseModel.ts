import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel} from './DialogRootModel';

export interface DialogCloseModelOptions {}

export interface DialogCloseModelReactive {}

export type DialogCloseModelState = DialogCloseModelOptions &
	DialogCloseModelReactive;

export interface DialogCloseModelDerived {}

export interface DialogCloseModelAttributes {}

export class DialogCloseModel extends NodeComponentModel<
	DialogCloseModelState,
	DialogCloseModelDerived,
	DialogCloseModelAttributes
> {
	id = 'close';

	onClick() {
		const root = this.root as DialogRootModel;
		root.requestStateUpdate?.((prev) => ({...prev, open: false}));
	}
}
