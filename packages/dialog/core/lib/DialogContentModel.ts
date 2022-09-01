import {ComponentModel} from '@ally-ui/core';
import type {
	DialogComponentType,
	DialogRootModel,
	DialogRootModelState,
} from './DialogRootModel';

export interface DialogContentModelOptions {
	forceMount?: boolean;
}

export interface DialogContentModelState {}

export interface DialogContentModelDerived {
	show: boolean;
}

export interface DialogContentModelAttributes {
	id: string;
	role: 'dialog';
	'aria-modal': 'true' | undefined;
	'aria-labelledby': string;
	'aria-describedby': string;
	'data-state': 'open' | 'closed';
}

export class DialogContentModel extends ComponentModel<
	DialogRootModel,
	DialogContentModelOptions,
	DialogContentModelState,
	DialogContentModelDerived,
	DialogContentModelAttributes
> {
	getType(): DialogComponentType {
		return 'content';
	}

	deriveState(rootState: DialogRootModelState): DialogContentModelDerived {
		return {
			show: this.options.forceMount || rootState.open,
		};
	}

	getAttributes(rootState: DialogRootModelState): DialogContentModelAttributes {
		return {
			id: this.domId(),
			role: 'dialog',
			'aria-modal': rootState.modal ? 'true' : undefined,
			'aria-labelledby': this.rootModel.componentDomId('title'),
			'aria-describedby': this.rootModel.componentDomId('description'),
			'data-state': rootState.open ? 'open' : 'closed',
		};
	}
}
