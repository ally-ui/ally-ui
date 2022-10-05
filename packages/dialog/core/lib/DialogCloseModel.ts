import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel} from './DialogRootModel';

export interface DialogCloseModelProps {}
export interface DialogCloseModelState {}
export interface DialogCloseModelEvents {}
export interface DialogCloseModelAttributes {}

export class DialogCloseModel extends NodeComponentModel<
	DialogCloseModelProps,
	DialogCloseModelState,
	DialogCloseModelEvents,
	DialogCloseModelAttributes
> {
	id = 'close';

	onClick() {
		const root = this.root as DialogRootModel;
		root.state.requestUpdate?.((prev) => ({...prev, open: false}));
	}
}
