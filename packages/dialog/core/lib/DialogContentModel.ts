import {$StateOf, ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogContentModelOptions {}

export interface DialogContentModelState {}

export class DialogContentModel extends ComponentModel<
	DialogRootModel,
	DialogContentModelOptions,
	DialogContentModelState
> {
	deriveInitialState(): DialogContentModelState {
		return {};
	}

	getType(): DialogComponentType {
		return 'content';
	}

	getAttributes(rootState: $StateOf<DialogRootModel>) {
		return {
			id: this.domId(),
			role: 'dialog',
			'aria-modal': 'true',
			'aria-labelledby': this.rootModel.componentDomId('title'),
			'aria-describedby': this.rootModel.componentDomId('description'),
			'data-state': rootState.open ? 'open' : 'closed',
		} as const;
	}
}
